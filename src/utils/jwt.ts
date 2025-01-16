import jwt from "jsonwebtoken";

type Payload = {
  id: string;
  email: string;
};

export const generateJWT = (payload: Payload) => {
  return jwt.sign(payload, process.env.JWT_TOKEN, {
    expiresIn: "6h",
  });
};
