// ensure the user is authenticated
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
      return next();
  }
  // redirect the user to the login page
  res.redirect("/auth/login");
};

module.exports = ensureAuthenticated;