require("dotenv").config();
const express = require("express");
const app = express();

const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const paymentRoutes = require("./routes/Payments");
const courseRoutes = require("./routes/Course");
const contactUsRoute = require("./routes/Contact");
const testEmailRoute = require("./routes/TestEmail");
const reviewRoutes = require("./features/reviews/review.routes");
const searchRoutes = require("./features/search/search.routes");
const notificationRoutes = require("./features/notifications/notification.routes");
const database = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { validateMailConfiguration } = require("./utils/mailSender");
const {
	cloudinaryConnect,
	validateCloudinaryConfiguration,
} = require("./config/cloudinary");
const { validateRazorpayConfiguration } = require("./config/razorpay");
const fileUpload = require("express-fileupload");
const PORT = process.env.PORT || 4000;
const DEFAULT_CORS_ORIGINS = ["http://localhost:3000"];

const getAllowedOrigins = () => {
	const parsedOrigins = (process.env.CORS_ORIGIN || "")
		.split(",")
		.map((origin) => origin.trim().replace(/\/+$/, ""))
		.filter(Boolean);

	return parsedOrigins.length ? parsedOrigins : DEFAULT_CORS_ORIGINS;
};

const allowedOrigins = getAllowedOrigins();
const corsOptions = {
	origin: (origin, callback) => {
		if (!origin) {
			return callback(null, true);
		}

		const normalizedOrigin = origin.replace(/\/+$/, "");
		if (allowedOrigins.includes(normalizedOrigin)) {
			return callback(null, true);
		}

		return callback(new Error("Not allowed by CORS"));
	},
	credentials: true,
};

validateMailConfiguration();
validateCloudinaryConfiguration();
validateRazorpayConfiguration();

//database connect
database.connect()
	.then(() => {
		app.listen(PORT, () => {
			console.log(`App is running at ${PORT}`)
		})
	})
	.catch(() => {
		process.exit(1)
	});
//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

app.use(
	fileUpload({
		useTempFiles:true,
		tempFileDir:"/tmp",
	})
)
//cloudinary connection
cloudinaryConnect();

//routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/reach", contactUsRoute);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/search", searchRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/test-email", testEmailRoute);

//def route

app.get("/", (req, res) => {
	return res.json({
		success:true,
		message:'Your server is up and running....'
	});
});


