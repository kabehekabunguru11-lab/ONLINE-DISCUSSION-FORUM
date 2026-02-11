// Check if user is authenticated
const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.user) {
        return next();
    }
    req.session.returnTo = req.originalUrl;
    res.redirect('/');
};

// Check if user is admin
const isAdmin = (req, res, next) => {
    if (req.session && req.session.user && req.session.user.role === 'admin') {
        return next();
    }
    res.status(403).render('error', { 
        message: 'Access denied. Admin only.',
        user: req.session.user || null
    });
};

// Set local variables for all views
const setLocals = (req, res, next) => {
    res.locals.user = req.session.user || null;
    res.locals.success = req.session.success || null;
    res.locals.error = req.session.error || null;
    
    // Clear flash messages
    delete req.session.success;
    delete req.session.error;
    
    next();
};

module.exports = { isAuthenticated, isAdmin, setLocals };