import "reflect-metadata";
import { createConnection } from "typeorm";
import express from "express";
import * as bodyParser from "body-parser";
import compression from "compression";
import cors from "cors";
import { handleApiErrors } from "./utils/handleApiErrors";

import ShoppingCentreController from "./controllers/ShoppingCentreController";
import AssetController from "./controllers/AssetController";

const { PORT = 3000 } = process.env;

const app = () => {
  createConnection()
    .then(async connection => {
      const app = express();
      app.disable("x-powered-by");

      app.use(cors());
      app.use(compression());
      app.use(bodyParser.json());

      app.get("/", (req, res) => res.json({ name: "Inventory API" }));

      app.use("/asset", AssetController());
      app.use("/shopping-centre", ShoppingCentreController());

      app.use(handleApiErrors);
      app.listen(PORT, () => {
        console.log(`Server started on port ${PORT}`);
      });
    })
    .catch(error => console.log(error));
};

app();
