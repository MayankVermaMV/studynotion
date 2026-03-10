const mongoose = require("mongoose");
require("dotenv").config();

exports.connect = async () => {
	if (!process.env.MONGODB_URL) {
		console.error("DB Connection Failed: MONGODB_URL is missing in environment variables");
		process.exit(1);
	}

	try {
		await mongoose.connect(process.env.MONGODB_URL);
		console.log("DB Connected Successfully");
	} catch (error) {
		console.error("DB Connection Failed", error.message);
		process.exit(1);
	}
};
