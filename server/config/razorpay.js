require("dotenv").config();
const Razorpay = require("razorpay");

let instance;

exports.validateRazorpayConfiguration = () => {
    const missing = [];
    if (!process.env.RAZORPAY_KEY) missing.push("RAZORPAY_KEY");
    if (!process.env.RAZORPAY_SECRET) missing.push("RAZORPAY_SECRET");

    if (missing.length > 0) {
        console.warn(
            "[razorpay][startup] Missing env vars:",
            missing,
            "- payment APIs will fail until configured."
        );
    }
};

exports.getRazorpayInstance = () => {
    if (instance) {
        return instance;
    }

    if (!process.env.RAZORPAY_KEY || !process.env.RAZORPAY_SECRET) {
        throw new Error("Missing Razorpay credentials. Set RAZORPAY_KEY and RAZORPAY_SECRET.");
    }

    instance = new Razorpay({
        key_id: process.env.RAZORPAY_KEY,
        key_secret: process.env.RAZORPAY_SECRET,
    });

    return instance;
};
