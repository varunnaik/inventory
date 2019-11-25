import { getConfig } from "../../src/utils/getConfig";
import { AssetController } from "../../src/controllers/AssetController";
import { ShoppingCentreController } from "../../src/controllers/ShoppingCentreController";
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

const asset1 = {
  name: "a screen",
  shoppingcentre: "",
  dimensions: { width: 100, height: 100 },
  location: { floor: "1", area: "12-c34" },
  status: "active"
};

describe("Shopping Centre", () => {
  let token: string;
  let apiApp: any;
  let shoppingCentre: any;

  beforeAll(async () => {
    const env = dotenv.config({ path: "./env.test" });
    const config = getConfig(env.parsed);
    const logger = winston.createLogger({
      transports: [new winston.transports.Console({ silent: true })]
    });
    token = generateJwt(config.jwtSecret);
    const api = new App({
      config,
      ShoppingCentreController,
      AssetController,
      logger
    });
    await api.createServer();
    apiApp = api.app;

    const res = await supertest(apiApp)
      .post("/shopping-centre")
      .set({
        Authorization: `Bearer ${token}`
      })
      .send(shoppingCentre1);

    shoppingCentre = res.body.result;
    asset1.shoppingcentre = shoppingCentre.id;
  });

  afterAll(done => {
    apiApp.close(done);
  });

  describe("POST /asset", () => {
    test("should create asset", async () => {
      const res = await supertest(apiApp)
        .post("/asset")
        .set({
          Authorization: `Bearer ${token}`
        })
        .send(asset1);

      expect(res.status).toBe(200);
      expect(res.body.result.name).toEqual(asset1.name);
      expect(res.body.result.dimensions).toEqual(asset1.dimensions);
      expect(res.body.result.id).not.toBeUndefined();
    });

    test("should reject invalid assets", async () => {
      const res = await supertest(apiApp)
        .post("/asset")
        .set({
          Authorization: `Bearer ${token}`
        })
        .send({});

      expect(res.status).toBe(400);
    });
  });

  describe("GET /asset", () => {
    test("should get assets", async () => {
      const res = await supertest(apiApp)
        .get("/asset")
        .set({
          Authorization: `Bearer ${token}`
        });

      expect(res.status).toBe(200);
      expect(res.body.result.length).toBeGreaterThan(0);
    });

    test("should get single asset", async () => {
      const res = await supertest(apiApp)
        .get("/asset")
        .set({
          Authorization: `Bearer ${token}`
        });

      const sc = res.body.result[0];

      const res2 = await supertest(apiApp)
        .get(`/asset/${sc.id}`)
        .set({
          Authorization: `Bearer ${token}`
        });

      expect(res2.status).toBe(200);
      expect(res2.body.result[0].name).not.toBeUndefined();
      expect(res2.body.result[0].dimensions).not.toBeUndefined();
      expect(res2.body.result[0].id).toEqual(sc.id);
    });
  });

  describe("DELETE /asset/:id", () => {
    test("should delete a asset", async () => {
      const create = await supertest(apiApp)
        .post("/asset")
        .set({
          Authorization: `Bearer ${token}`
        })
        .send(asset1);

      const id = create.body.result.id;

      const res = await supertest(apiApp)
        .delete(`/asset/${id}`)
        .set({
          Authorization: `Bearer ${token}`
        });

      expect(res.status).toBe(200);
    });
  });

  describe("PATCH /asset/:id", () => {
    test("should update a asset", async () => {
      const name = "a different asset";
      const create = await supertest(apiApp)
        .post("/asset")
        .set({
          Authorization: `Bearer ${token}`
        })
        .send(asset1);

      const id = create.body.result.id;

      const res = await supertest(apiApp)
        .patch(`/asset/${id}`)
        .set({
          Authorization: `Bearer ${token}`
        })
        .send({ ...asset1, name });

      expect(res.status).toBe(200);

      const res2 = await supertest(apiApp)
        .get(`/asset/${id}`)
        .set({
          Authorization: `Bearer ${token}`
        });

      expect(res2.status).toBe(200);
      expect(res2.body.result[0].name).toEqual(name);
    });
  });
});
