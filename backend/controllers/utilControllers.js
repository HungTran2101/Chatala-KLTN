const asyncHandler = require("express-async-handler");
const cloudinary = require("../utils/cloudinary");

const UPLOAD_PRESET = "chatala_preset";

const signedKey = asyncHandler(async (req, res, next) => {
  const { public_id } = req.body;
  const timestamp = new Date().getTime();
  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp: timestamp,
      upload_preset: UPLOAD_PRESET,
      public_id,
    },
    process.env.CLOUDINARY_API_SECRET
  );

  res.status(200).json({
    signature: signature,
    timestamp: timestamp,
  });
});

module.exports = { signedKey };
