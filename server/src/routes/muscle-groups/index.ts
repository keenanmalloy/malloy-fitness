import { Router } from "express";
import { retrieveMuscleGroupQuery } from "queries/retrieveMuscleGroupQuery";
import { retrieveMuscleGroupsQuery } from "queries/retrieveMuscleGroupsQuery";

const router = Router();

// Retrieve all muscle groups
router.get("/", async (req, res) => {
  await retrieveMuscleGroupsQuery(res);
});

// Retrieve muscle group
router.get("/:id", async (req, res) => {
  await retrieveMuscleGroupQuery(res, req.params.id);
});

export default (parentRouter: Router) => {
  parentRouter.use("/muscle-groups", router);
};
