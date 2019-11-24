import { Router, Request, Response, NextFunction } from "express";
import { celebrate, Joi, errors } from "celebrate";
import { ShoppingCentreType } from "../types/http/ShoppingCentre";
import { getRepository } from "typeorm";
import { ShoppingCentre } from "../entity/ShoppingCentre";
import { constants } from "http2";
import { handleApiErrors } from "../utils/handleApiErrors";

export default function ShoppingCentreController(): Router {
  const router = Router({ mergeParams: true });

  /* Create one */
  router.post(
    "/",
    celebrate({
      body: ShoppingCentreType
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const repository = getRepository(ShoppingCentre);
        const shoppingCentre = await repository.create(req.body);
        const result = await repository.save(shoppingCentre);
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
        const repository = getRepository(ShoppingCentre);
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
      const repository = getRepository(ShoppingCentre);
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
        const repository = getRepository(ShoppingCentre);
        await repository.findOneOrFail({ id: req.params.id });
        const result = await repository.delete({ id: req.params.id });
        res
          .status(constants.HTTP_STATUS_OK)
          .json({ result: { id: req.params.id, status: "deleted" } });
      } catch (err) {
        handleApiErrors(err, req, res, next);
      }
    }
  );

  /* Update one */
  router.patch(
    "/:id",
    celebrate({
      body: ShoppingCentreType
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const repository = getRepository(ShoppingCentre);
        await repository.findOneOrFail({ id: req.params.id });
        const result = await repository.update(req.params.id, req.body);
        res.status(constants.HTTP_STATUS_OK).json({ result });
      } catch (err) {
        handleApiErrors(err, req, res, next);
      }
    }
  );
  return router;
}
