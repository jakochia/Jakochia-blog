import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { buildNewsletterHtml } from './emailTemplate.js';
dotenv.config();

const user = process.env.EMAIL_USER || '';
const pass = process.env.EMAIL_PASS || '';

if (!user || !pass) {
  console.warn('⚠️ Email credentials are missing. Email will not work.');
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user, pass },
});

transporter.verify((error, success) => {
  if (error) {
    console.error('Email service error:', error.message);
  } else {
    console.log('✅ Email service ready');
  }
});

/**
 * Send email with the Jakochia template
 */
export const sendEmail = async ({ to, subject, htmlContent, plainText, unsubscribeUrl = '' }) => {
  if (!user || !pass) {
    throw new Error('Email credentials not configured');
  }

  // Build the full HTML with template
  const html = buildNewsletterHtml({
    subject,
    content: htmlContent,
    unsubscribeUrl,
    siteUrl: 'https://jakochia.com', // replace with your actual domain
  });

  // Plain text fallback
  const text = plainText || htmlContent.replace(/<[^>]*>/g, '');

  try {
    const mailOptions = {
      from: `"Jakochia Blog" <${user}>`,
      to,
      subject,
      html,
      text,
    };
    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email send error:', error);
    throw new Error('Failed to send email: ' + error.message);
  }
};

/**
 * Send newsletter to multiple recipients (batch)
 */
export const sendNewsletter = async ({ recipients, subject, htmlContent, plainText = '', unsubscribeUrl = '' }) => {
  const results = [];
  const batchSize = 10;

  for (let i = 0; i < recipients.length; i += batchSize) {
    const batch = recipients.slice(i, i + batchSize);
    const batchPromises = batch.map(async (email) => {
      try {
        const result = await sendEmail({
          to: email,
          subject,
          htmlContent,
          plainText,
          unsubscribeUrl,
        });
        return { email, success: true, messageId: result.messageId };
      } catch (error) {
        return { email, success: false, error: error.message };
      }
    });
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
    if (i + batchSize < recipients.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  return results;
};