import { Router } from "express";
import { authenticate } from "middlewares/authenticate";
import { authorize } from "middlewares/authorize";
import { startWorkoutMutation } from "queries/startWorkoutMutation";

const router = Router();

// Start workout
router.patch("/:workoutId/start", authenticate, authorize, async (req, res) => {
  await startWorkoutMutation(res, req.params.workoutId);
});

export default (parentRouter: Router) => {
  parentRouter.use("/", router);
};
