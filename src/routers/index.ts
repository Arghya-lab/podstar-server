import { Router } from "express";
import authRoute from "./auth.routes";
import podcastRoute from "./podcast.routes";
import userRoute from "./user.routes";

const router = Router();

router.use("/auth", authRoute);
router.use("/podcast", podcastRoute);
router.use("/user", userRoute);

export default router;
