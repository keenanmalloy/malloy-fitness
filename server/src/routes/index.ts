import { Router } from "express";
const router = Router();

router.get("/health", (req, res) => res.send("OK"));

// all other routes should throw 404 not found
router.use("*", (req, res) => {
  return res.status(404).send();
});

export default router;
