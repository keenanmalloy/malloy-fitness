import { Router } from "express";

import google from "./google";

const router = Router();

google(router);

export default (parentRouter: Router) => {
  parentRouter.use("/providers", router);
};
