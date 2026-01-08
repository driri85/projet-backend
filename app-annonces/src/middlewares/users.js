const isAdmin = (req, res, next) => {
    if (req.user.role !== "admin") return res.status(401).json({ message: "Vous n'avez pas les droits nécessaires pour accéder à la ressource"});
    next();
}

module.exports = {
    isAdmin
}