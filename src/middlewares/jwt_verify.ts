import jwt from "jsonwebtoken";
export default (req, res, next) => {
  try {
    //   @ts-ignore
    const token = req.headers.authorization.split(" ")[1];
    // console.log(token);
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    //   @ts-ignore
    req.userData = { email: decoded.email, userId: decoded.id };
    next();
  } catch (err) {
    //   @ts-ignore
    res.status(401).json({
      message: "Auth failed",
    });
  }
};
