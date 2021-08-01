import asyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';
import User  from '../models/userModel.js'
import Tracking from '../models/trackingModel.js'
const saveOrderItems = asyncHandler(async (req, res) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        totalPrice
    } = req.body
    if (orderItems && orderItems.length === 0) {
        res.status(400)
        throw new Error('No Order Items')
        return
    } else {
        const order = new Order({
            orderItems,
            user: req.user._id,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            shippingPrice,
            totalPrice
        })
        
        const createdOrder = await order.save();
        console.log(createdOrder);
        res.status(201).json(createdOrder)
    }

});


const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate('user','name email',User)
    if (order) {
        res.json(order)
    } else {
        res.status(400)
        throw new Error('Order Not Found')
    }
});


const updateOrderToPaid = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)
        
    if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address:req.body.payer.email_address
        }
        const updatedOrder = await order.save()
        res.json(updatedOrder)
    } else {
        res.status(400)
        throw new Error('Order Not Found')
    }
});

const getMyOrders = asyncHandler(async (req, res) => {
    
    const order = await Order.find({ user: req.user._id })
    res.json(order)
});

const getAdminOrders = asyncHandler(async (req, res) => {
     
    // const orderQuery = await Order.aggregate([
    //     {
    //         "$lookup": {
    //             "from": User.collection.name,
    //             "localField": "user",
    //             "foreignField": "_id",
    //             "as": "user"
    //         }
    //     },
    //     {
    //         "$unwind": "$user"
    //     },
    //     {
    //         "$lookup": {
    //             "from": Tracking.collection.name,
    //             "localField": "tracking",
    //             "foreignField": "_id",
    //             "as": "tracking"
    //         }
    //     },
    //     {
    //         "$unwind": "$tracking"
    //     },
    // ]);
    const orderQuery = await Order.find({})
        .populate('user', 'name email phone', User)
        .populate('tracking', 'name trackingId', Tracking).lean()
    console.log(orderQuery)
    res.render('orders/view', {
        title: 'View Orders',
        orders:orderQuery
    })
    
});
const getSingleOrderDetails = asyncHandler(async (req, res) => {
    const getOrder = await Order.findOne({ _id:req.params.id }).populate('user', 'name email phone_no', User).lean();
    console.log(getOrder.orderItems)
    res.render('orders/detail', {
        title: 'View Order Details',
        order:getOrder
    })

})
const getFailedOrderDetails = asyncHandler(async (req, res) => {
    const getFailedOrders = await Order.find({ orderStatus: 'Failed' })
        .populate('user', 'name email phone_no').lean();
    res.render('orders/failed', {
        title: "Failed Orders",
        order:getFailedOrders
    })
})
// const getProcessingOrderDetails = asyncHandler(async (req, res) => {
//     const getProcessingOrders = await Order.find({ orderStatus: 'Processing' })
//         .populate('user', 'name email phone_no').lean();
//     res.render('orders/processing', {
//         title: "Processing Orders",
//         order:getProcessingOrders
//     })
// })
const getDeliveredOrderDetails = asyncHandler(async (req, res) => {
    const getDeliveredOrders = await Order.find({ orderStatus: 'Delivered' })
        .populate('user', 'name email phone_no').lean();
    res.render('orders/delivered', {
        title: "Delivered Orders",
        order:getDeliveredOrders
    })
});

const getCancelledOrderDetails = asyncHandler(async (req, res) => {
    const getCancelledOrders = await Order.find({ orderStatus: 'Cancelled' })
        .populate('user', 'name email phone_no').lean();
    res.render('orders/cancelled', {
        title: "Cancelled Orders",
        order:getCancelledOrders
    })
});

// const getShippingOrderDetails = asyncHandler(async (req, res) => {
//     const getCancelledOrders = await Order.find({ orderStatus: 'Cancelled' })
//         .populate('user', 'name email phone_no').lean();
//     res.render('orders/cancelled', {
//         title: "Cancelled Orders",
//         order:getCancelledOrders
//     })
// });



const cancelOrderAdmin = asyncHandler(async (req, res) => {
    const getCancelOrder = await Order.findOne({ _id: req.params.id });
    if (getCancelOrder) {
        getCancelOrder.orderStatus = "Cancelled";
        await getCancelOrder.save();
        req.flash('success_msg', 'Order Cancelled');
    } else {
        req.flash('error_msg', 'Order Not Found');
        
    }
    res.redirect('/orders/view');
});

const editOrderStatus = asyncHandler(async (req, res) => {
    const getOrder = await Order.findOne({ _id: req.params.id })
        .populate('user', 'name email phone_no', User).lean();
    const tracking = await Tracking.findOne({ order: getOrder._id }).lean();
    
    res.render('orders/edit', {
        title: 'Edit Order',
        order: getOrder,
        tracking:tracking
    })
});

const saveOrderStatus = asyncHandler(async (req, res) => {
    const getOrder = await Order.findOne({ _id: req.params.id });
    if (getOrder) {
        if (req.body.orderStatus == 'Delivered') {
            getOrder.deliveredAt = req.body.deliveredAt
            if (!getOrder.isPaid) {
                getOrder.paidAt = req.body.paidAt
            }
        }
        getOrder.isPaid = req.body.isPaid || getOrder.isPaid
        getOrder.isDelivered = req.body.isDelivered || getOrder.isDelivered
        getOrder.orderStatus = req.body.orderStatus || getOrder.orderStatus
        
        await getOrder.save();
        req.flash('success_msg', 'Order Updated Successfully');
    } else {
        req.flash('error_msg', 'Order Not Found');
        
    }
    res.redirect('/orders/view')
});

const assignTrackingOrder = asyncHandler(async (req, res) => {
    const getOrder = await Order.findOne({ _id: req.params.id }).lean();
    res.render('tracking/add', {
        title: 'Add tracking',
        order:getOrder
    })
});
const saveTrackingOrder = asyncHandler(async (req, res) => {
    const getOrder = await Order.findOne({ _id: req.params.id });
    const user = await User.findOne({_id:getOrder.user})
    const tracking = await Tracking.create({
        name: req.body.name,
        trackingId: req.body.trackingId,
        order: getOrder._id,
        user:user._id
    });
    
    getOrder.tracking = tracking._id;
    getOrder.orderStatus = 'Shipping';
    await getOrder.save();
    req.flash('success_msg', 'Tracking Added Successfully');
    res.redirect(`/order/view/tracking`);

});
const viewTrackingOrder = asyncHandler(async (req, res) => {
    const getTrackingDetails = await Tracking.find({})
        .populate('order', '_id isPaid isDelivered paidAt deliveredAt totalPrice shippingAddress user', Order)
        .populate('user', 'name email phone_no', User).lean();
    console.log(getTrackingDetails)
    res.render('tracking/view', {
        title: 'Tracking Details',
        tracking:getTrackingDetails
    })
})

export {getDeliveredOrderDetails,assignTrackingOrder,saveTrackingOrder,viewTrackingOrder,editOrderStatus,saveOrderStatus,cancelOrderAdmin,getCancelledOrderDetails,getFailedOrderDetails,saveOrderItems,getOrderById,getSingleOrderDetails,updateOrderToPaid,getMyOrders,getAdminOrders}