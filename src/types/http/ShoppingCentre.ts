import { Joi } from "celebrate";

export const ShoppingCentreType = Joi.object({
  name: Joi.string().required(),
  address: Joi.string()
    .min(5)
    .max(500)
    .required()
});
