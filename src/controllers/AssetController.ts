import { Router, Request, Response, NextFunction } from "express";
import { celebrate, Joi, errors } from "celebrate";
import { AssetType } from "../types/http/Asset";
import { getRepository } from "typeorm";
import { Asset } from "../entity/Asset";
import { constants } from "http2";
import { handleApiErrors } from "../utils/handleApiErrors";

export default function AssetController(): Router {
  const router = Router({ mergeParams: true });

  /* Create one */
  router.post(
    "/",
    celebrate({
      body: AssetType
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const repository = getRepository(Asset);
        const asset = await repository.create(req.body);
        const result = await repository.save(asset);
        res.status(constants.HTTP_STATUS_OK).json({ result });
      } catch (err) {
        handleApiErrors(err, req, res, next);
      }
    }
  );

  /* Get one */
  router.get(
    "/:id",
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const repository = getRepository(Asset);
        const result = await repository.find({ id: req.params.id });
        res.status(constants.HTTP_STATUS_OK).json({ result });
      } catch (err) {
        handleApiErrors(err, req, res, next);
      }
    }
  );

  /* List all */
  router.get("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const repository = getRepository(Asset);
      const result = await repository.find();
      res.status(constants.HTTP_STATUS_OK).json({ result });
    } catch (err) {
      handleApiErrors(err, req, res, next);
    }
  });

  /* Delete one */
  router.delete(
    "/:id",
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const repository = getRepository(Asset);
        const result = await repository.delete({ id: req.params.id });
        res.status(constants.HTTP_STATUS_OK).json({ result });
      } catch (err) {
        handleApiErrors(err, req, res, next);
      }
    }
  );

  /* Update one */
  router.patch(
    "/:id",
    celebrate({
      body: AssetType
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const repository = getRepository(Asset);
        const result = await repository.update(req.params.id, req.body);
        res.status(constants.HTTP_STATUS_OK).json({ result });
      } catch (err) {
        handleApiErrors(err, req, res, next);
      }
    }
  );
  return router;
}
