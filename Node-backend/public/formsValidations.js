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

function validateSubCategoryForm() {
    alert();
    var parent = document.forms["addSubCategoryForm"]["parent_category"].value;
    var name = document.forms["addSubCategoryForm"]["name"].value;
    if (parent == "") {
        $('#message').html("<br><div class='alert alert-danger'>Please select a valid Parent Category</div>");
        slideUp();
        return false;
    } else if (name == "") {
        $('#message').html("<br><div class='alert alert-danger'>Please enter a valid name</div>");
        slideUp();
        return false;
    } else {
        return true;
    }
}