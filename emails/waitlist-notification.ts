type WaitlistNotificationData = {
  name?: string | null
  email: string
  productName: string
  productSlug: string
}

export function waitlistNotificationHtml(data: WaitlistNotificationData): string {
  const { name, productName, productSlug } = data
  const productUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://maison-elise.com"}/product/${productSlug}`

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Waitlist Confirmed — Maison Élise</title>
</head>
<body style="margin:0;padding:0;background:#0F0F0F;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0F0F0F;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="580" cellpadding="0" cellspacing="0" style="max-width:580px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="padding-bottom:40px;text-align:center;border-bottom:1px solid #2A2A28;">
              <p style="margin:0;font-size:10px;letter-spacing:0.3em;text-transform:uppercase;color:#C9A96E;">
                Maison Élise
              </p>
            </td>
          </tr>

          <!-- Title -->
          <tr>
            <td style="padding:40px 0 32px;text-align:center;">
              <h1 style="margin:0 0 12px;font-size:28px;font-weight:300;color:#E8E4DC;letter-spacing:0.04em;font-family:Georgia,serif;">
                You&rsquo;re on the List
              </h1>
              <p style="margin:0;font-size:13px;color:#8A8880;line-height:1.6;">
                ${name ? `Dear ${name},<br>` : ""}We&rsquo;ve added you to the waitlist for<br>
                <strong style="color:#E8E4DC;">${productName}</strong>
              </p>
            </td>
          </tr>

          <!-- Message -->
          <tr>
            <td style="padding:24px;background:#181818;border:1px solid #2A2A28;text-align:center;">
              <p style="margin:0;font-size:13px;color:#8A8880;line-height:1.7;">
                You will be among the first to know when this piece becomes available.
                Our concierge team will reach out personally with exclusive access.
              </p>
            </td>
          </tr>

          <!-- Spacer -->
          <tr><td style="height:32px;"></td></tr>

          <!-- CTA -->
          <tr>
            <td style="text-align:center;">
              <a href="${productUrl}"
                style="display:inline-block;padding:14px 32px;background:#C9A96E;color:#0F0F0F;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;text-decoration:none;font-weight:500;">
                View Product
              </a>
            </td>
          </tr>

          <!-- Spacer -->
          <tr><td style="height:48px;border-bottom:1px solid #2A2A28;"></td></tr>
          <tr><td style="height:48px;"></td></tr>

          <!-- Footer -->
          <tr>
            <td style="text-align:center;">
              <p style="margin:0 0 8px;font-size:10px;letter-spacing:0.15em;text-transform:uppercase;color:#C9A96E;">
                Maison Élise
              </p>
              <p style="margin:0;font-size:11px;color:#8A8880;">
                You&rsquo;re receiving this because you joined our waitlist.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

export function waitlistNotificationText(data: WaitlistNotificationData): string {
  const { name, productName } = data
  return `MAISON ÉLISE — WAITLIST CONFIRMED

${name ? `Dear ${name},` : "Dear Customer,"}

You have been added to the waitlist for: ${productName}

You will be among the first to know when this piece becomes available. Our concierge team will reach out personally with exclusive access.

Maison Élise`
}
