export const buildNewsletterHtml = ({ subject, content, unsubscribeUrl = '', siteUrl = 'https://blog.jakochia.co.ke' }) => {
  const year = new Date().getFullYear();

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <!-- Google Font: Inter – modern, clean, impressive -->
  <link href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,400;14..32,600;14..32,700&display=swap" rel="stylesheet">
  <style>
    /* Reset & base */
    body, table, td, p, a, div, h1, h2, h3 {
      margin: 0;
      padding: 0;
      border: 0;
      font-family: 'Inter', 'Segoe UI', 'Helvetica Neue', system-ui, -apple-system, Arial, sans-serif;
      line-height: 1.6;
    }
    body {
      background-color: #F8FAFC;  /* Stark Off-White */
      color: #334155;             /* Charcoal Gray */
      padding: 20px 10px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #F8FAFC;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 8px 30px rgba(30, 27, 75, 0.08);
    }
    /* Header – gradient Primary → Secondary, Accent border */
    .header {
      background: linear-gradient(135deg, #2563EB 0%, #1E1B4B 100%);
      padding: 36px 20px 28px;
      text-align: center;
      border-bottom: 4px solid #EA580C;
    }
    .header h1 {
      font-size: 30px;
      font-weight: 700;
      color: #F8FAFC;
      letter-spacing: -0.5px;
    }
    .header .brand {
      color: #EA580C;
      font-weight: 300;
    }
    .header .tagline {
      color: #F8FAFC;
      font-size: 17px;
      margin-top: 6px;
      opacity: 0.85;
      font-weight: 400;
      letter-spacing: 0.3px;
    }
    /* Content */
    .content {
      padding: 36px 28px;
      background-color: #F8FAFC;
      color: #334155;
    }
    .content h2 {
      color: #1E1B4B;
      font-size: 24px;
      margin-bottom: 16px;
      font-weight: 700;
      letter-spacing: -0.3px;
    }
    .content p {
      color: #334155;
      margin-bottom: 16px;
      font-size: 16px;
      line-height: 1.7;
    }
    .content a {
      color: #2563EB;
      text-decoration: underline;
      font-weight: 600;
    }
    .content a:hover {
      color: #EA580C;
    }
    .content img {
      max-width: 100%;
      height: auto;
      border-radius: 8px;
      margin: 18px 0;
      border: 1px solid #E2E8F0;
    }
    .content blockquote {
      border-left: 4px solid #EA580C;
      padding-left: 18px;
      margin: 18px 0;
      color: #334155;
      font-style: italic;
      background: #F1F5F9;
      padding: 12px 18px;
      border-radius: 0 8px 8px 0;
    }
    .content ul, .content ol {
      margin: 16px 0;
      padding-left: 24px;
      color: #334155;
    }
    .content li {
      margin-bottom: 6px;
    }
    .content hr {
      border: none;
      border-top: 1px solid #E2E8F0;
      margin: 28px 0;
    }
    /* Buttons */
    .btn {
      display: inline-block;
      background: #2563EB;
      color: #F8FAFC !important;
      padding: 14px 32px;
      border-radius: 50px;
      text-decoration: none !important;
      font-weight: 600;
      font-size: 16px;
      margin: 8px 0;
      transition: background 0.2s;
      letter-spacing: 0.3px;
    }
    .btn:hover {
      background: #1E1B4B;
    }
    .btn-accent {
      background: #EA580C;
    }
    .btn-accent:hover {
      background: #1E1B4B;
    }
    /* Footer */
    .footer {
      background-color: #F8FAFC;
      padding: 24px 20px;
      text-align: center;
      border-top: 1px solid #E2E8F0;
      font-size: 14px;
      color: #64748B;
    }
    .footer a {
      color: #2563EB;
      text-decoration: none;
      font-weight: 500;
    }
    .footer a:hover {
      color: #EA580C;
      text-decoration: underline;
    }
    .footer .social {
      margin: 14px 0 10px;
    }
    .footer .social a {
      display: inline-block;
      margin: 0 10px;
      color: #2563EB;
      text-decoration: none;
      font-weight: 600;
      font-size: 15px;
    }
    .footer .social a:hover {
      color: #EA580C;
    }
    .footer .copyright {
      color: #64748B;
      font-size: 13px;
      margin-bottom: 4px;
    }
    .footer .unsubscribe {
      font-size: 13px;
      color: #94A3B8;
      margin-top: 12px;
    }
    .footer .unsubscribe a {
      color: #94A3B8;
      text-decoration: underline;
    }
    .footer .unsubscribe a:hover {
      color: #EA580C;
    }
    @media only screen and (max-width: 600px) {
      .container {
        border-radius: 0;
      }
      .header h1 {
        font-size: 26px;
      }
      .content {
        padding: 24px 18px;
      }
    }
  </style>
</head>
<body>

  <div class="container">

    <!-- Header -->
    <div class="header">
      <h1>JAKOCHIA <span class="brand">Blog</span></h1>
      <p class="tagline">Code. Build. Learn. Share.</p>
    </div>

    <!-- Content (injected) -->
    <div class="content">
      ${content}
    </div>

    <!-- Footer -->
    <div class="footer">
      <div class="social">
        <a href="https://github.com/jakochia" target="_blank">GitHub</a>
        <a href="https://www.linkedin.com/in/newton-ombuya-776566356/" target="_blank">LinkedIn</a>
        <a href="${siteUrl}" target="_blank">Blog</a>
      </div>
      <p class="copyright">
        &copy; ${year} <strong>Newton Asha (Jakochia)</strong>. All rights reserved.
      </p>
      <p style="font-size:13px; color:#94A3B8; margin-bottom:6px;">
        You are receiving this because you subscribed to the Jakochia Blog newsletter.
      </p>
      ${unsubscribeUrl ? `
        <p class="unsubscribe">
          <a href="${unsubscribeUrl}">Unsubscribe</a> &bull;
          <a href="${siteUrl}/privacy">Privacy</a>
        </p>
      ` : ''}
    </div>

  </div>

</body>
</html>
  `;
};