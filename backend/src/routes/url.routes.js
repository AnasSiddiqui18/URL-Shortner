import { Router } from "express";
import {
  generateShortUrl,
  visitViaShortUrl,
} from "../controllers/url.controller.js";

const router = Router();

router.route("/").post(generateShortUrl);
router.route("/:shortUrl").get(visitViaShortUrl); // shortly.ut/23s3s

export default router;
