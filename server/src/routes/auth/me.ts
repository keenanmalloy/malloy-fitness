import { Router } from "express";
import { retrieveMeQuery } from "queries/retrieveAccountQuery";

const router = Router();

// Retrieve active user by session token
router.get("/", async (req, res) => {
  await retrieveMeQuery(req, res);
});

export default (parentRouter: Router) => {
  parentRouter.use("/me", router);
};
