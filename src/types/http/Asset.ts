import { Joi } from "celebrate";

export const AssetType = Joi.object({
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
