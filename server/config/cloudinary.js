const cloudinary = require("cloudinary").v2; //! Cloudinary is being required

const getMissingCloudinaryEnv = () => {
	const required = ["CLOUD_NAME", "API_KEY", "API_SECRET"];
	return required.filter((key) => !process.env[key]);
};

exports.validateCloudinaryConfiguration = () => {
	const missing = getMissingCloudinaryEnv();
	if (missing.length > 0) {
		console.warn(
			"[cloudinary][startup] Missing env vars:",
			missing,
			"- media uploads may fail."
		);
	}
};

exports.cloudinaryConnect = () => {
	try {
		const missing = getMissingCloudinaryEnv();
		if (missing.length > 0) {
			return;
		}

		cloudinary.config({
			//!    ########   Configuring the Cloudinary to Upload MEDIA ########
			cloud_name: process.env.CLOUD_NAME,
			api_key: process.env.API_KEY,
			api_secret: process.env.API_SECRET,
		});
	} catch (error) {
		console.error("Cloudinary configuration failed", error);
	}
};
