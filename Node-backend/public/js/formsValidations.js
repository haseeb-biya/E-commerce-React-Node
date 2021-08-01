function validateAddUserForm() {
                var name = document.forms["myuserForm"]["name"].value;
                var email = document.forms["myuserForm"]["email"].value;
                var phone_no = document.forms["myuserForm"]["phone_no"].value;
                var password = document.forms["myuserForm"]["password"].value;
                var cpassword = document.forms["myuserForm"]["cpassword"].value;
                if (name == "") {
                    $('#message').html("<br><div class='alert alert-danger'>Please add User name</div>");
                    slideUp();
                    return false;
                } else if (email == "") {
                    $('#message').html("<br><div class='alert alert-danger'>Please add User email</div>");
                    slideUp();
                    return false;
                } else if (phone_no == "") {
                    $('#message').html("<br><div class='alert alert-danger'>Please add User phone Number</div>");
                    slideUp();
                    return false;
                } else if (password == "") {
                    $('#message').html("<br><div class='alert alert-danger'>Please add User password</div>");
                    slideUp();
                    return false;
                } else if (cpassword == "") {
                    $('#message').html("<br><div class='alert alert-danger'>Please add User confirm password</div>");
                    slideUp();
                    return false;
                } else if (password != cpassword) {
                    $('#message').html("<br><div class='alert alert-danger'>Password and Confirm Password Doesn'\t Match</div>");
                    slideUp();
                    return false;
                } else if (!(phone_no.match('[0-9]{10}'))) {
                    $('#message').html("<br><div class='alert alert-danger'>Please Enter 10 Digit Mobile Number</div>");
                    slideUp();
                    return false;
                } else {
                    return true;
                }
            }
            function validateEditUserForm() {

                var name = document.forms["myEditForm"]["name"].value;
                var email = document.forms["myEditForm"]["email"].value;
                var phone_no = document.forms["myEditForm"]["phone_no"].value;
                if (name == "") {
                    $('#message').html("<br><div class='alert alert-danger'>Please add User name</div>");
                    slideUp();
                    return false;
                } else if (email == "") {
                    $('#message').html("<br><div class='alert alert-danger'>Please add User email</div>");
                    slideUp();
                    return false;
                } else if (phone_no == "") {
                    $('#message').html("<br><div class='alert alert-danger'>Please add User phone Number</div>");
                    slideUp();
                    return false;
                } else if (!(phone_no.match('[0-9]{10}'))) {
                    $('#message').html("<br><div class='alert alert-danger'>Please Enter 10 Digit Mobile Number</div>");
                    slideUp();
                    return false;
                } else {
                    return true;
                }
            }
            function validateEditAdminForm() {

                var name = document.forms["myAdminEditForm"]["name"].value;
                var email = document.forms["myAdminEditForm"]["email"].value;
                var phone_no = document.forms["myAdminEditForm"]["phone_no"].value;
                if (name == "") {
                    $('#message').html("<br><div class='alert alert-danger'>Please add User name</div>");
                    slideUp();
                    return false;
                } else if (email == "") {
                    $('#message').html("<br><div class='alert alert-danger'>Please add User email</div>");
                    slideUp();
                    return false;
                } else if (phone_no == "") {
                    $('#message').html("<br><div class='alert alert-danger'>Please add User phone Number</div>");
                    slideUp();
                    return false;
                } else if (!(phone_no.match('[0-9]{10}'))) {
                    $('#message').html("<br><div class='alert alert-danger'>Please Enter 10 Digit Mobile Number</div>");
                    slideUp();
                    return false;
                } else {
                    return true;
                }
            }
            function validateEditAdminPasswordForm() {
                var oldpassword = document.forms["myAdminEditPasswordForm"]["opassword"].value;
                var password = document.forms["myAdminEditPasswordForm"]["password"].value;
                var cnpassword = document.forms["myAdminEditPasswordForm"]["cnpassword"].value;
                if (oldpassword == "") {
                    $('#message').html("<br><div class='alert alert-danger'>Please add Old Password</div>");
                    slideUp();
                    return false;
                } else if (password == "") {
                    $('#message').html("<br><div class='alert alert-danger'>Please add New Password</div>");
                    slideUp();
                    return false;
                } else if (cnpassword == "") {
                    $('#message').html("<br><div class='alert alert-danger'>Please add Confirm New Password</div>");
                    slideUp();
                    return false;
                } else if (password != cnpassword) {
                    $('#message').html("<br><div class='alert alert-danger'>Password and Confirm Password Doesn'\t Match</div>");
                    slideUp();
                    return false;
                } else {
                    return true;
                }
            }
function openModal(el, url, text) {
    $('#exampleModal').modal();
    $('#delvalue').val(el);
    document.getElementById("delForm").action = url;
    $('#modalBody').html(text);
}
function openAddModal(url, title, label, placeholder) {
    $('#addModal').modal();
    $('#header').html(title);
    $('#modal_text').html(label);
    document.getElementById('addForm').action = url;
    document.getElementById("name").placeholder = placeholder;
}
function openSubcat(category_id) {
    $('#loader').removeClass('hide_loader');
    $('#loader').addClass('display_loader');
    var parameter = { id: category_id }
    $.post('/product/get-sub-category', parameter, function (data) {
        if (data == "") {
            $('#error_sub').html("Sorry! No Data Found for the selected Category.Try Adding One")
            closeError();
            var html = "<select class='form-control'  required name='subcategory' id='subcat'>";
            html += "<option value=''>--Please select a SubCategory--</option>";
            html += "</select>";
            $('#subcat').html(html);
            $('#loader').addClass('hide_loader');
            $('#loader').removeClass('display_loader');
        } else {
             $('#loader').addClass('hide_loader');
            $('#loader').removeClass('display_loader');
            var html = "<select class='form-control' required name='subcategory' id='subcat'>";
            $.each(data, function (index, jsonObject) {
                html += '<option value="' + jsonObject._id + '">' + jsonObject.name + '</option>';
            });
            html += "</select>";
            console.log(html);
            $('#subcat').html(html)
        }
    })
}
function closeError() {
    $("#error_sub").fadeTo(3000, 500).slideUp(500, function () {
            $("#error_sub").slideUp(500);
        });
}
function checkForPaid(value, status) {
    
    if (status != 'true' && value == 'Delivered') {
        $('#paidDate').removeClass('paidDate')
        $('#deliveryDate').removeClass('deliveryDate')
    }
    if (value == 'Shipping' || value == 'Order Placed' || value == 'Processing') {
        $('#paidDate').addClass('paidDate')
        $('#deliveryDate').addClass('deliveryDate')
    }
}

        