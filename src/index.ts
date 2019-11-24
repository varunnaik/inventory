import "reflect-metadata";
import { createConnection } from "typeorm";
import express from "express";
import * as bodyParser from "body-parser";
import compression from "compression";
import cors from "cors";
import { handleApiErrors } from "./utils/handleApiErrors";
import { NotFoundError } from "./types/http/Errors";

import ShoppingCentreController from "./controllers/ShoppingCentreController";
import AssetController from "./controllers/AssetController";

import { getConfig } from "./utils/getConfig";

const { PORT = 3000 } = process.env;

const config = getConfig(process.env);
console.log(config.database);
const app = () => {
  createConnection(config.database)
    .then(async connection => {
      const app = express();
      app.disable("x-powered-by");

      app.use(cors());
      app.use(compression());
      app.use(bodyParser.json());

      app.get("/", (req, res) => res.json({ name: "Inventory API" }));

      app.use("/asset", AssetController(config));
      app.use("/shopping-centre", ShoppingCentreController(config));

      app.use(function(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
      ) {
        if (!req.route) return next(new NotFoundError());
        next();
      });

      app.use(handleApiErrors);

      app.listen(PORT, () => {
        console.log(`Server started on port ${PORT}`);
      });
    })
    .catch(error => console.log(error));
};

app();
