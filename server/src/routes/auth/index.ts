import { Router } from "express";
import me from "./me";
import providers from "./providers";

const router = Router();
providers(router);
me(router)

export default (parentRouter: Router) => {
  parentRouter.use("/auth", router);
};
