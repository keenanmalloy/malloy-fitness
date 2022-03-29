import { Router } from "express";
import logout from "./logout";
import me from "./me";
import providers from "./providers";

const router = Router();

providers(router);
me(router);
logout(router);

export default (parentRouter: Router) => {
  parentRouter.use("/auth", router);
};
