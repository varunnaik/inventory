import { Router, Request, Response, NextFunction } from "express";
import { celebrate, Joi, errors } from "celebrate";
import { AssetType, AssetStatusType } from "../types/http/Asset";
import { getRepository } from "typeorm";
import { Asset } from "../entity/Asset";
import { constants } from "http2";
import { handleApiErrors } from "../utils/handleApiErrors";
import { JwtChecker } from "./middleware/JwtChecker";
import { ConfigType } from "../types/app/Config";
import { Logger } from "winston";

export interface IAssetController {
  (config: ConfigType, logger: Logger): Router;
}

export let AssetController: IAssetController = (
  config: ConfigType,
  logger: Logger
): Router => {
  const router = Router({ mergeParams: true });
  const jwtChecker = JwtChecker(config);

  /* Create one */
  router.post(
    "/",
    [
      celebrate({
        body: AssetType
      }),
      jwtChecker
    ],
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const repository = getRepository(Asset);
        const asset = await repository.create(req.body);
        const result = await repository.save(asset);
        res.status(constants.HTTP_STATUS_OK).json({ result });
      } catch (err) {
        handleApiErrors({ err, req, res, next, logger });
      }
    }
  );

  /* Get one */
  router.get(
    "/:id",
    [jwtChecker],
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const repository = getRepository(Asset);
        const result = await repository.find({ id: req.params.id });
        res.status(constants.HTTP_STATUS_OK).json({ result });
      } catch (err) {
        handleApiErrors({ err, req, res, next, logger });
      }
    }
  );

  /* List all */
  router.get(
    "/",
    [jwtChecker],
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const repository = getRepository(Asset);
        const result = await repository.find();
        res.status(constants.HTTP_STATUS_OK).json({ result });
      } catch (err) {
        handleApiErrors({ err, req, res, next, logger });
      }
    }
  );

  /* Delete one */
  router.delete(
    "/:id",
    [jwtChecker],
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const repository = getRepository(Asset);
        await repository.findOneOrFail({ id: req.params.id });
        const result = await repository.delete({ id: req.params.id });
        res
          .status(constants.HTTP_STATUS_OK)
          .json({ result: { id: req.params.id, status: "deleted" } });
      } catch (err) {
        handleApiErrors({ err, req, res, next, logger });
      }
    }
  );

  /* Activate or take offline */
  router.patch(
    "/status/:id",
    [
      celebrate({
        body: AssetStatusType
      }),
      jwtChecker
    ],
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const repository = getRepository(Asset);
        await repository.findOneOrFail({ id: req.params.id });
        const result = await repository.update(req.params.id, req.body);
        res.status(constants.HTTP_STATUS_OK).json({ result });
      } catch (err) {
        handleApiErrors({ err, req, res, next, logger });
      }
    }
  );

  /* Update one */
  router.patch(
    "/:id",
    [
      celebrate({
        body: AssetType
      }),
      jwtChecker
    ],
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const repository = getRepository(Asset);
        await repository.findOneOrFail({ id: req.params.id });
        const result = await repository.update(req.params.id, req.body);
        res.status(constants.HTTP_STATUS_OK).json({ result });
      } catch (err) {
        handleApiErrors({ err, req, res, next, logger });
      }
    }
  );

  return router;
};
