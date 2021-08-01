function ensureAuthentication(req,res,next) {
    if (req.isAuthenticated()) {
            return next();
        }
        req.flash('error_msg', 'Not Authorized');
        res.redirect('/login');
}
export default ensureAuthentication