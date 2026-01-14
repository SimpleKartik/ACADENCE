const nodemailer = require('nodemailer');

/**
 * Create email transporter
 * Supports Gmail, Outlook, and custom SMTP servers
 */
const createTransporter = () => {
  // Use environment variables for email configuration
  const emailConfig = {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  };

  // If no SMTP credentials, return null (email sending disabled)
  if (!emailConfig.auth.user || !emailConfig.auth.pass) {
    console.warn('Email service not configured. Set SMTP_USER and SMTP_PASS in .env');
    return null;
  }

  return nodemailer.createTransport(emailConfig);
};

/**
 * Generate HTML email template for notifications
 */
const generateEmailTemplate = (title, message, senderName) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
      <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 20px 0; text-align: center; background-color: #2563eb;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">ACADENCE</h1>
          </td>
        </tr>
        <tr>
          <td style="padding: 40px 20px; background-color: #ffffff;">
            <table role="presentation" style="width: 100%; max-width: 600px; margin: 0 auto;">
              <tr>
                <td>
                  <h2 style="color: #1e293b; margin: 0 0 20px 0; font-size: 20px;">${title}</h2>
                  <div style="color: #475569; line-height: 1.6; font-size: 14px;">
                    ${message.replace(/\n/g, '<br>')}
                  </div>
                  <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                    <p style="color: #64748b; font-size: 12px; margin: 0;">
                      <strong>From:</strong> ${senderName}<br>
                      <strong>Platform:</strong> Acadence Campus Management System
                    </p>
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding: 20px; text-align: center; background-color: #f1f5f9;">
            <p style="color: #64748b; font-size: 12px; margin: 0;">
              This is an automated notification from Acadence. Please do not reply to this email.
            </p>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};

/**
 * Send email notification
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.title - Notification title
 * @param {string} options.message - Notification message
 * @param {string} options.senderName - Sender's name
 * @returns {Promise<Object>} Email send result
 */
const sendEmail = async ({ to, subject, title, message, senderName }) => {
  try {
    const transporter = createTransporter();

    if (!transporter) {
      console.log('Email service not configured. Skipping email send.');
      return { success: false, message: 'Email service not configured' };
    }

    const htmlContent = generateEmailTemplate(title, message, senderName);

    const mailOptions = {
      from: `"Acadence" <${process.env.SMTP_USER}>`,
      to,
      subject: subject || title,
      html: htmlContent,
      text: message, // Plain text fallback
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log('Email sent successfully:', info.messageId);
    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Send bulk email notifications (non-blocking)
 * @param {Array} recipients - Array of recipient email addresses
 * @param {Object} notificationData - Notification data
 */
const sendBulkEmails = async (recipients, notificationData) => {
  if (!recipients || recipients.length === 0) {
    return;
  }

  // Send emails in parallel (non-blocking)
  const emailPromises = recipients.map((email) =>
    sendEmail({
      to: email,
      subject: `[Important] ${notificationData.title}`,
      title: notificationData.title,
      message: notificationData.message,
      senderName: notificationData.senderName,
    })
  );

  // Don't await - let it run in background
  Promise.all(emailPromises)
    .then((results) => {
      const successCount = results.filter((r) => r.success).length;
      console.log(`Bulk email sent: ${successCount}/${recipients.length} successful`);
    })
    .catch((error) => {
      console.error('Error in bulk email sending:', error);
    });
};

module.exports = {
  sendEmail,
  sendBulkEmails,
};
