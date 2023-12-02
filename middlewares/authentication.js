const userAuth = async (req, res, next) => {
    if (req.session && req.session.user) {
        req.user = { userId: req.session.user._id };
        next();
    } else {
        next('Unathorized');
    }
}

export default userAuth;
