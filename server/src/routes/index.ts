import { Router } from "express";
import auth from "./auth";
import exercises from "./exercises";
import muscleGroups from "./muscle-groups";
import storage from "./storage";
import workouts from "./workouts";

const router = Router();

exercises(router);
muscleGroups(router);
workouts(router);
auth(router);
storage(router);

router.get("/health", (req, res) => res.send("OK"));

// all other routes should throw 404 not found
router.use("*", (req, res) => {
  return res.status(404).send();
});

export default router;
