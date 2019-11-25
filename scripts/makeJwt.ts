import * as jwt from "jsonwebtoken";
import * as uuid from "uuid";
import dotenv from "dotenv";

const isTest = process.env.NODE_ENV === "test";

dotenv.config({ path: "./env.development" });

const generateJwt = (secret: string) => {
  return jwt.sign({ userId: uuid.v4() }, secret, { expiresIn: "1w" });
};

const jwtToken = generateJwt(<string>process.env.JWT_SECRET);

if (!isTest) {
  console.log(jwtToken);
}

export default generateJwt;
