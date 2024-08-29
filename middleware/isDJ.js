module.exports = function (req, res, next) {
  if (req.session.user && req.session.user.role === 'DJ') {
    return next();
  } else {
    return res.status(403).send('Access denied. DJ access only.');
  }
};