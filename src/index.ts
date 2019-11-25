import App from "./app";

import { ShoppingCentreController } from "./controllers/ShoppingCentreController";
import { AssetController } from "./controllers/AssetController";

import * as winston from "winston";
import { getConfig } from "./utils/getConfig";

const config = getConfig(process.env);

const logger = winston.createLogger({
  exitOnError: false,
  level: "info",
  format: winston.format.simple(),
  transports: [new winston.transports.Console()]
});

class LogStream {
  write(text: string) {
    logger.info(text);
  }
}

const app = new App({
  config,
  logger,
  ShoppingCentreController,
  AssetController
});
app.createServer();
app.startServer();
