import { Router } from "express";
import Joi from "joi";
import { data } from "../../../test/data";

const router = Router();

const createExerciseSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  description: Joi.string().max(250),
  category: Joi.string().required(),
  primary: Joi.string().required(),
  secondary: Joi.string(),
  image: Joi.string(),
  video: Joi.string(),
  movement: Joi.string().valid("isolation", "compound").required(),
});

// Retrieve all exercises
router.get("/", (req, res) => {
  return res.json({
    message: "Exercises fetched successfully",
    status: "success",
    exercises: data,
  });
});

// Create new exercise
router.post("/", (req, res) => {
  const data = req.body;

  const { error, value, warning } = createExerciseSchema.validate(data);
  const exercise_id = Math.ceil(Math.random() * 9999999);

  if (error) {
    return res.status(422).json({
      status: "error",
      message: "Invalid request data",
      exercise: data,
    });
  } else {
    return res.json({
      status: "success",
      message: "User created successfully",
      exercise: Object.assign(
        { exercise_id, createdAt: Date.now(), updatedAt: Date.now() },
        value
      ),
    });
  }
});

// Retrieve exercise by id
router.get("/:id", (req, res) => {
  const exercise = data.filter(
    (data) => data.exerciseId === parseInt((req.params as any).id)
  )[0];

  if (!exercise) {
    return res.json({
      status: "error",
      message: "Exercise does not exist",
      exercise,
    });
  }

  return res.json({
    status: "success",
    message: "Exercise fetched successfully",
    exercise,
  });
});

export default (parentRouter: Router) => {
  parentRouter.use("/exercises", router);
};
