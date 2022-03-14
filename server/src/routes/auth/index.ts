import { Router } from "express";
import providers from "./providers";

const router = Router();
providers(router);

export default (parentRouter: Router) => {
  parentRouter.use("/auth", router);
};
