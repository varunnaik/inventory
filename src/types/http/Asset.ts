import { Joi } from "celebrate";
import { join } from "path";

export const AssetType = Joi.object({
  name: Joi.string()
    .min(5)
    .max(500)
    .required(),
  shoppingcentre: Joi.string()
    .uuid()
    .required(),
  dimensions: Joi.object({
    width: Joi.number()
      .positive()
      .required(),
    height: Joi.number()
      .positive()
      .required()
  }).required(),
  location: Joi.object({
    floor: Joi.string()
      .min(1)
      .max(10)
      .required(),
    area: Joi.string()
      .min(5)
      .max(500)
      .required()
  }).required(),
  status: Joi.string()
    .valid(["active", "offline"])
    .required()
});

export const AssetStatusType = Joi.object({
  status: Joi.string()
    .valid(["active", "offline"])
    .required()
});
