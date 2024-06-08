import { nanoid } from "nanoid";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Url } from "../models/url.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateShortUrl = asyncHandler(async (req, res) => {
  const { originalUrl } = req.body;

  console.log("original url", originalUrl);

  if (!originalUrl) {
    throw new ApiError(400, "url is required");
  }

  let UrlWithProtocol = originalUrl;

  if (
    !originalUrl.startsWith("http://") &&
    !originalUrl.startsWith("https://")
  ) {
    UrlWithProtocol = `https://${originalUrl}`;
  }

  console.log("processed url", UrlWithProtocol);

  const nanoId = nanoid(4);
  if (!nanoId) {
    throw new ApiError(400, "issue while generating unique ID");
  }
  const storeUrlInDB = await Url.create({
    originalUrl: UrlWithProtocol,
    shortCode: nanoId,
  });
  if (!storeUrlInDB) {
    throw new ApiError(400, "error while creating the document in DB");
  }

  const baseUrl = `https://22a.vercel.app/${nanoId}`;

  return res
    .status(200)
    .json(new ApiResponse(200, baseUrl, "short url generated successfully"));
});

const visitViaShortUrl = asyncHandler(async (req, res) => {
  console.log("function triggers");

  const { shortUrl } = req.params;

  console.log("short url", shortUrl);

  const queryDB = await Url.find({ shortCode: shortUrl });

  console.log("DB result", queryDB);

  console.log("original url", queryDB[0].originalUrl);

  res.redirect(queryDB[0].originalUrl);
});

export { generateShortUrl, visitViaShortUrl };
