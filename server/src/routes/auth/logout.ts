import { removeTokenCookie } from "cookies";
import { Router } from "express";

const router = Router();

// Logout user
router.post("/", async (req, res) => {
  removeTokenCookie(res);
  res.redirect("/login");
});

export default (parentRouter: Router) => {
  parentRouter.use("/logout", router);
};
