import * as jwt from "jsonwebtoken";
import * as uuid from "uuid";
import dotenv from "dotenv";
dotenv.config({ path: "./env.development" });

const generateJwt = () => {
  const secret = <string>process.env.JWT_SECRET;

  return jwt.sign({ userId: uuid.v4() }, secret, { expiresIn: "1w" });
};

const jwtToken = generateJwt();
console.log(jwtToken);
