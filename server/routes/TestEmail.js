const express = require("express");
const router = express.Router();

const mailSender = require("../utils/mailSender");

router.get("/", async (req, res) => {
	try {
		const to = (req.query.to || process.env.MAIL_TEST_TO || process.env.MAIL_USER || "").trim();
		if (!to) {
			return res.status(400).json({
				success: false,
				message: "Provide ?to=email or set MAIL_TEST_TO in environment variables.",
			});
		}

		const result = await mailSender(
			to,
			"StudyNotion SMTP Test Email",
			`
        <div style="font-family:Arial,sans-serif;line-height:1.6;">
          <h2>StudyNotion SMTP Configuration Test</h2>
          <p>This is a test email sent from <strong>/api/v1/test-email</strong>.</p>
          <p>Timestamp: ${new Date().toISOString()}</p>
        </div>
      `
		);

		return res.status(200).json({
			success: true,
			message: "Test email sent successfully",
			messageId: result.messageId,
			accepted: result.accepted,
			rejected: result.rejected,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Test email failed",
			error: error.message,
		});
	}
});

module.exports = router;
