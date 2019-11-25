import { getConfig } from "../../src/utils/getConfig";
import { ShoppingCentreController } from "../../src/controllers/ShoppingCentreController";
import { IAssetController } from "../../src/controllers/AssetController";
import generateJwt from "../../scripts/makeJwt";
import App from "../../src/app";
import express from "express";
import { Logger } from "winston";
import { ConfigType } from "../../src/types/app/Config";
import supertest from "supertest";
import dotenv from "dotenv";
import * as winston from "winston";
import uuid from "uuid";

const shoppingCentre1 = {
  name: "Ultra shopping centre",
  address: "Out of this wrorld"
};

describe("Shopping Centre", () => {
  let token: string;
  let apiApp: any;

  beforeAll(async () => {
    const env = dotenv.config({ path: "./env.test" });
    const config = getConfig(env.parsed);
    const logger = winston.createLogger({
      transports: [new winston.transports.Console({ silent: true })]
    });
    const AssetController: IAssetController = (
      config: ConfigType,
      logger: Logger
    ) => express.Router();
    token = generateJwt(config.jwtSecret);
    const api = new App({
      config,
      ShoppingCentreController,
      AssetController,
      logger
    });
    await api.createServer();
    apiApp = api.app;
  });

  afterAll(done => {
    apiApp.close(done);
  });

  describe("Access control", () => {
    test("Should allow access with valid token", async () => {
      const res = await supertest(apiApp)
        .get("/shopping-centre")
        .set({
          Authorization: `Bearer ${token}`
        });

      expect(res.status).toBe(200);
    });
    test("Should deny access with invalid token", async () => {
      const res = await supertest(apiApp)
        .get("/shopping-centre")
        .set({
          Authorization: `Bearer invalid${token}`
        });

      expect(res.status).toBe(401);
    });
  });

  describe("POST /shopping-centre", () => {
    test("should create shopping-centre", async () => {
      const res = await supertest(apiApp)
        .post("/shopping-centre")
        .set({
          Authorization: `Bearer ${token}`
        })
        .send(shoppingCentre1);

      expect(res.status).toBe(200);
      expect(res.body.result.name).toEqual(shoppingCentre1.name);
      expect(res.body.result.address).toEqual(shoppingCentre1.address);
      expect(res.body.result.id).not.toBeUndefined();
    });

    test("should reject invalid shopping-centres", async () => {
      const res = await supertest(apiApp)
        .post("/shopping-centre")
        .set({
          Authorization: `Bearer ${token}`
        })
        .send({});

      expect(res.status).toBe(400);
    });
  });

  describe("GET /shopping-centre", () => {
    test("should get shopping-centres", async () => {
      const res = await supertest(apiApp)
        .get("/shopping-centre")
        .set({
          Authorization: `Bearer ${token}`
        });

      expect(res.status).toBe(200);
      expect(res.body.result.length).toBeGreaterThan(0);
    });

    test("should get single shopping centre", async () => {
      const res = await supertest(apiApp)
        .get("/shopping-centre")
        .set({
          Authorization: `Bearer ${token}`
        });

      const sc = res.body.result[0];

      const res2 = await supertest(apiApp)
        .get(`/shopping-centre/${sc.id}`)
        .set({
          Authorization: `Bearer ${token}`
        });

      expect(res2.status).toBe(200);
      expect(res2.body.result[0].name).not.toBeUndefined();
      expect(res2.body.result[0].address).not.toBeUndefined();
      expect(res2.body.result[0].id).toEqual(sc.id);
    });
  });

  describe("DELETE /shopping-centre/:id", () => {
    test("should delete a centre", async () => {
      const create = await supertest(apiApp)
        .post("/shopping-centre")
        .set({
          Authorization: `Bearer ${token}`
        })
        .send(shoppingCentre1);

      const id = create.body.result.id;

      const res = await supertest(apiApp)
        .delete(`/shopping-centre/${id}`)
        .set({
          Authorization: `Bearer ${token}`
        });

      expect(res.status).toBe(200);
    });
  });

  describe("PATCH /shopping-centre/:id", () => {
    test("should update a centre", async () => {
      const name = "Mega Shopping Centre";
      const create = await supertest(apiApp)
        .post("/shopping-centre")
        .set({
          Authorization: `Bearer ${token}`
        })
        .send(shoppingCentre1);

      const id = create.body.result.id;

      const res = await supertest(apiApp)
        .patch(`/shopping-centre/${id}`)
        .set({
          Authorization: `Bearer ${token}`
        })
        .send({ name, address: shoppingCentre1.address });

      expect(res.status).toBe(200);

      const res2 = await supertest(apiApp)
        .get(`/shopping-centre/${id}`)
        .set({
          Authorization: `Bearer ${token}`
        });

      expect(res2.status).toBe(200);
      expect(res2.body.result[0].name).toEqual(name);
    });
  });
});
