import { Router } from "express";
import { authenticate } from "middlewares/authenticate";
import { uploadFile } from "./upload";

const router = Router();

// Upload video / image file
router.get("/upload", authenticate, async (req, res) => {
  await uploadFile(req, res);
});

export default (parentRouter: Router) => {
  parentRouter.use("/storage", router);
};
