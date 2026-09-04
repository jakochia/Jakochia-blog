/**
 * Build a beautiful HTML email template for Jakochia Blog newsletters
 */
export const buildNewsletterHtml = ({ subject, content, unsubscribeUrl = '', siteUrl = 'https://jakochia.com' }) => {
  const year = new Date().getFullYear();

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>
    /* Reset styles */
    body, table, td, p, a, div, h1, h2, h3 {
      margin: 0;
      padding: 0;
      border: 0;
      font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
    }
    body {
      background-color: #0a0a0f;
      color: #e2e8f0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #111827;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 20px 60px rgba(0,0,0,0.5);
    }
    .header {
      background: linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%);
      padding: 30px 20px;
      text-align: center;
      border-bottom: 3px solid #3b82f6;
    }
    .header h1 {
      font-size: 28px;
      font-weight: 700;
      color: #ffffff;
      letter-spacing: 1px;
    }
    .header .brand {
      color: #60a5fa;
      font-weight: 300;
    }
    .content {
      padding: 30px 25px;
      background-color: #111827;
    }
    .content h2 {
      color: #60a5fa;
      font-size: 22px;
      margin-bottom: 16px;
      font-weight: 600;
    }
    .content p {
      color: #e2e8f0;
      margin-bottom: 16px;
      font-size: 16px;
    }
    .content a {
      color: #3b82f6;
      text-decoration: underline;
      font-weight: 500;
    }
    .content img {
      max-width: 100%;
      height: auto;
      border-radius: 8px;
      margin: 16px 0;
      border: 1px solid #1e293b;
    }
    .content blockquote {
      border-left: 4px solid #3b82f6;
      padding-left: 16px;
      margin: 16px 0;
      color: #94a3b8;
      font-style: italic;
    }
    .content ul, .content ol {
      margin: 16px 0;
      padding-left: 24px;
      color: #e2e8f0;
    }
    .content li {
      margin-bottom: 6px;
    }
    .content hr {
      border: none;
      border-top: 1px solid #1e293b;
      margin: 24px 0;
    }
    .footer {
      background-color: #0f172a;
      padding: 20px;
      text-align: center;
      border-top: 1px solid #1e293b;
      font-size: 14px;
      color: #64748b;
    }
    .footer a {
      color: #60a5fa;
      text-decoration: none;
    }
    .footer .social {
      margin: 12px 0;
    }
    .footer .social a {
      display: inline-block;
      margin: 0 8px;
      color: #94a3b8;
      text-decoration: none;
      font-weight: 500;
      font-size: 16px;
    }
    .footer .social a:hover {
      color: #60a5fa;
    }
    .btn {
      display: inline-block;
      background: #3b82f6;
      color: #ffffff !important;
      padding: 12px 28px;
      border-radius: 50px;
      text-decoration: none !important;
      font-weight: 600;
      font-size: 16px;
      margin: 8px 0;
      transition: background 0.2s;
    }
    .btn:hover {
      background: #2563eb;
    }
    .unsubscribe {
      font-size: 13px;
      color: #475569;
      margin-top: 16px;
    }
    .unsubscribe a {
      color: #64748b;
      text-decoration: underline;
    }
    @media only screen and (max-width: 600px) {
      .container {
        border-radius: 0;
      }
      .header h1 {
        font-size: 24px;
      }
      .content {
        padding: 20px 16px;
      }
    }
  </style>
</head>
<body style="background-color:#0a0a0f; padding:20px 10px;">

  <div class="container">

    <!-- Header -->
    <div class="header">
      <h1>JAKOCHIA <span class="brand">Blog</span></h1>
      <p style="color:#94a3b8; font-size:16px; margin-top:8px;">Code. Build. Learn. Share.</p>
    </div>

    <!-- Content -->
    <div class="content">
      ${content}
    </div>

    <!-- Footer -->
    <div class="footer">
      <div class="social">
        <a href="https://github.com/jakochia" target="_blank">GitHub</a>
        <a href="#" target="_blank">LinkedIn</a>
        <a href="${siteUrl}" target="_blank">Blog</a>
      </div>
      <p style="margin-bottom:8px;">
        &copy; ${year} <strong>Newton Asha (Jakochia)</strong>. All rights reserved.
      </p>
      <p style="font-size:13px; color:#475569;">
        You are receiving this because you subscribed to the Jakochia Blog newsletter.
      </p>
      ${unsubscribeUrl ? `<p class="unsubscribe">
        <a href="${unsubscribeUrl}">Unsubscribe</a> &bull;
        <a href="${siteUrl}/privacy">Privacy</a>
      </p>` : ''}
    </div>

  </div>

</body>
</html>
  `;
};