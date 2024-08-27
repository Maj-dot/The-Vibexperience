module.exports = function(req, res, next) {
  if (req.session.user) return next();
  res.redirect('/auth/sign-up');
};

module.exports = function ensureAuthenticated(req, res, next) {
  if (req.session.user) {
    return next(); 
  } else {
    res.redirect('/auth/login'); 
  }
};
