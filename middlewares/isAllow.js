export default function isAllow(...roles) {
  return (req, res, next) => {
    if (roles.includes(req.user.role)) {
      next();
    } else {
      res.status(401).send({ message: "You Are Not Allowed" });
    }
  };
}
