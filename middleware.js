// Middleware para chequear si el usuario esta logeado correctamente

exports.requireLogin = (req, res, next) => {
  return req.session && req.session.user ? next() : res.redirect("/login");
};
