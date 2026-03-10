const nodemailer = require("nodemailer");

const getMissingMailEnv = () => {
	const required = ["MAIL_HOST", "MAIL_PORT", "MAIL_USER", "MAIL_PASS"];
	return required.filter((key) => !process.env[key]);
};

const validateMailConfiguration = () => {
	const missing = getMissingMailEnv();
	if (missing.length > 0) {
		console.warn(
			"[mailSender][startup] Missing env vars:",
			missing,
			"- email delivery will fail until configured."
		);
	}
};

const createTransporter = () =>
	nodemailer.createTransport({
		host: process.env.MAIL_HOST || "smtp.gmail.com",
		port: Number(process.env.MAIL_PORT || 587),
		secure: false,
		auth: {
			user: process.env.MAIL_USER,
			pass: process.env.MAIL_PASS,
		},
	});

const mailSender = async (email, title, body) => {
	const missing = getMissingMailEnv();
	if (missing.length > 0) {
		throw new Error(`Missing mail configuration: ${missing.join(", ")}`);
	}

	try {
		const transporter = createTransporter();
		const info = await transporter.sendMail({
			from: process.env.MAIL_USER,
			to: email,
			subject: title,
			html: body,
		});
		return info;
	} catch (error) {
		console.error("Email send failed:", error.message);
		throw error;
	}
};

module.exports = mailSender;
module.exports.validateMailConfiguration = validateMailConfiguration;
