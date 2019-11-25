import { createConnection } from "typeorm";
import express from "express";
import * as bodyParser from "body-parser";
import compression from "compression";
import cors from "cors";
import { handleApiErrors } from "./utils/handleApiErrors";
import { NotFoundError } from "./types/http/Errors";
import "reflect-metadata";
import { Logger } from "winston";
import { ConfigType } from "./types/app/Config";
import { IShoppingCentreController } from "./controllers/ShoppingCentreController";
import { IAssetController } from "./controllers/AssetController";

interface ApiConfig {
  config: ConfigType;
  logger: Logger;
  AssetController: IAssetController;
  ShoppingCentreController: IShoppingCentreController;
}

class App {
  app: express.Application;
  apiConfig: ApiConfig;

  constructor(config: ApiConfig) {
    this.apiConfig = config;
  }

  async createServer() {
    const {
      config,
      logger,
      AssetController,
      ShoppingCentreController
    } = this.apiConfig;
    try {
      const connection = await createConnection(config.database);
      const app = express();

      app.use(cors());
      app.use(compression());
      app.use(bodyParser.json());

      app.get("/", (req, res) => res.json({ name: "Inventory API" }));

      app.use("/asset", AssetController(config, logger));
      app.use("/shopping-centre", ShoppingCentreController(config, logger));

      // 404 error catcher
      app.use(
        (
          req: express.Request,
          res: express.Response,
          next: express.NextFunction
        ) => {
          if (!req.route) return next(new NotFoundError());
          next();
        }
      );

      // Middleware error catcher
      app.use(
        (
          err: any,
          req: express.Request,
          res: express.Response,
          next: express.NextFunction
        ) => handleApiErrors({ err, req, res, next, logger })
      );

      this.app = app;
    } catch (e) {
      logger.error(e);
    }
  }

  startServer() {
    const { config, logger } = this.apiConfig;

    this.app.listen(config.port, () => {
      logger.info(`Server started on port ${config.port}`);
    });
  }
}
export default App;
