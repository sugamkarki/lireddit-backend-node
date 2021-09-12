import jwt from "jsonwebtoken";

export const createToken = (expiry, data) => {
  const token = jwt.sign(
    {
      ...data,
    },
    process.env.TOKEN_SECRET,
    {
      expiresIn: expiry,
    }
  );
  return token;
};
