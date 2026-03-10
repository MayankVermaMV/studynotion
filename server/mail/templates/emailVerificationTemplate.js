const otpTemplate = (otp) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>StudyNotion OTP Verification</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background: #f5f7fb;
      font-family: Arial, sans-serif;
      color: #1f2937;
    }
    .wrapper {
      max-width: 620px;
      margin: 24px auto;
      background: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      overflow: hidden;
    }
    .header {
      background: #111827;
      color: #ffffff;
      padding: 18px 24px;
      font-size: 20px;
      font-weight: 700;
    }
    .content {
      padding: 24px;
      line-height: 1.6;
    }
    .otp-box {
      margin: 18px 0;
      padding: 14px 18px;
      background: #fff7cc;
      border: 1px dashed #eab308;
      border-radius: 8px;
      text-align: center;
      font-size: 30px;
      font-weight: 700;
      letter-spacing: 6px;
      color: #111827;
    }
    .muted {
      color: #6b7280;
      font-size: 14px;
    }
    .footer {
      border-top: 1px solid #e5e7eb;
      padding: 14px 24px 22px;
      color: #6b7280;
      font-size: 13px;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">StudyNotion</div>
    <div class="content">
      <p>Hello,</p>
      <p>Use the following OTP code to continue your verification on <strong>StudyNotion</strong>:</p>
      <div class="otp-box">${otp}</div>
      <p><strong>Expiry:</strong> This OTP will expire in 5 minutes.</p>
      <p class="muted">If you did not request this OTP, you can safely ignore this email.</p>
    </div>
    <div class="footer">
      This is an automated email from StudyNotion. Please do not reply.
    </div>
  </div>
</body>
</html>
`;

module.exports = otpTemplate;
