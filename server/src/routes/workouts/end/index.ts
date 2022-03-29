import { Router } from "express";
import { authenticate } from "middlewares/authenticate";
import { authorize } from "middlewares/authorize";
import { endWorkoutMutation } from "queries/endWorkoutMutation";

const router = Router();

// End workout
router.patch("/:workoutId/end", authenticate, authorize, async (req, res) => {
  await endWorkoutMutation(res, req.params.workoutId);
});

export default (parentRouter: Router) => {
  parentRouter.use("/", router);
};
