import mongoose from 'mongoose'

const connectDB = async() => {
    try {
        console.log(process.env.MONGODB_URI)
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex:true,
        })
        console.log(` Connection String ${conn.connection.host}`)
        
    } catch (error) {
        console.log(`Error: ${error.message}`);
    }
};
export default connectDB