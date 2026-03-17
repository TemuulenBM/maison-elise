type OrderItem = {
  name: string
  edition?: string | null
  color?: string
  quantity: number
  priceAtPurchase: number
}

type OrderConfirmationData = {
  orderId: string
  customerName?: string
  customerEmail: string
  items: OrderItem[]
  totalAmount: number
  shippingAddress: {
    fullName?: string
    line1?: string
    line2?: string
    city?: string
    state?: string
    postalCode?: string
    country?: string
  }
  giftPackaging?: boolean
  giftNote?: string | null
}

export function orderConfirmationHtml(data: OrderConfirmationData): string {
  const { orderId, customerName, items, totalAmount, shippingAddress, giftPackaging, giftNote } =
    data

  const itemRows = items
    .map(
      (item) => `
    <tr>
      <td style="padding: 12px 0; border-bottom: 1px solid #2A2A28; font-size: 13px; color: #E8E4DC;">
        ${item.name}${item.edition ? ` · ${item.edition}` : ""}
        ${item.color ? `<br><span style="font-size:11px;color:#8A8880;text-transform:uppercase;letter-spacing:0.1em;">${item.color}</span>` : ""}
        ${item.quantity > 1 ? `<br><span style="font-size:11px;color:#8A8880;">Qty: ${item.quantity}</span>` : ""}
      </td>
      <td style="padding: 12px 0; border-bottom: 1px solid #2A2A28; font-size: 13px; color: #E8E4DC; text-align: right;">
        $${((item.priceAtPurchase * item.quantity) / 100).toLocaleString()}
      </td>
    </tr>`
    )
    .join("")

  const addrLine = [
    shippingAddress.line1,
    shippingAddress.line2,
    [shippingAddress.city, shippingAddress.state, shippingAddress.postalCode]
      .filter(Boolean)
      .join(", "),
    shippingAddress.country,
  ]
    .filter(Boolean)
    .join("<br>")

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation — Maison Élise</title>
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
                Order Confirmed
              </h1>
              <p style="margin:0;font-size:13px;color:#8A8880;">
                Thank you${customerName ? `, ${customerName.split(" ")[0]}` : ""}. Your order has been received.
              </p>
            </td>
          </tr>

          <!-- Order ID -->
          <tr>
            <td style="padding:16px 24px;background:#181818;border:1px solid #2A2A28;text-align:center;margin-bottom:32px;">
              <p style="margin:0 0 4px;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#8A8880;">Order Reference</p>
              <p style="margin:0;font-size:13px;color:#C9A96E;font-family:monospace;">${orderId}</p>
            </td>
          </tr>

          <!-- Spacer -->
          <tr><td style="height:32px;"></td></tr>

          <!-- Items -->
          <tr>
            <td>
              <p style="margin:0 0 16px;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#8A8880;">
                Items
              </p>
              <table width="100%" cellpadding="0" cellspacing="0">
                ${itemRows}
                <tr>
                  <td style="padding:16px 0 0;font-size:10px;letter-spacing:0.15em;text-transform:uppercase;color:#8A8880;">
                    Total
                  </td>
                  <td style="padding:16px 0 0;font-size:18px;color:#E8E4DC;text-align:right;font-family:Georgia,serif;font-weight:300;">
                    $${(totalAmount / 100).toLocaleString()}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Spacer -->
          <tr><td style="height:32px;border-bottom:1px solid #2A2A28;"></td></tr>
          <tr><td style="height:32px;"></td></tr>

          <!-- Shipping Address -->
          <tr>
            <td>
              <p style="margin:0 0 12px;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#8A8880;">
                Shipping To
              </p>
              <p style="margin:0;font-size:13px;color:#E8E4DC;line-height:1.7;">
                ${shippingAddress.fullName ? `${shippingAddress.fullName}<br>` : ""}
                ${addrLine}
              </p>
            </td>
          </tr>

          ${
            giftPackaging
              ? `<tr><td style="height:24px;"></td></tr>
          <tr>
            <td style="padding:16px 24px;border:1px solid #C9A96E22;background:#181818;">
              <p style="margin:0 0 4px;font-size:10px;letter-spacing:0.15em;text-transform:uppercase;color:#C9A96E;">
                Gift Packaging
              </p>
              ${giftNote ? `<p style="margin:8px 0 0;font-size:13px;color:#E8E4DC;font-style:italic;">"${giftNote}"</p>` : ""}
            </td>
          </tr>`
              : ""
          }

          <!-- Spacer -->
          <tr><td style="height:48px;border-bottom:1px solid #2A2A28;"></td></tr>
          <tr><td style="height:48px;"></td></tr>

          <!-- Footer -->
          <tr>
            <td style="text-align:center;">
              <p style="margin:0 0 8px;font-size:10px;letter-spacing:0.15em;text-transform:uppercase;color:#C9A96E;">
                Maison Élise
              </p>
              <p style="margin:0;font-size:11px;color:#8A8880;line-height:1.6;">
                Questions? Contact our concierge team.<br>
                We will be in touch with shipping details soon.
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

export function orderConfirmationText(data: OrderConfirmationData): string {
  const { orderId, customerName, items, totalAmount } = data
  const greeting = customerName ? `Dear ${customerName.split(" ")[0]},` : "Dear Customer,"

  const itemLines = items
    .map(
      (i) =>
        `- ${i.name}${i.edition ? ` · ${i.edition}` : ""}${i.quantity > 1 ? ` ×${i.quantity}` : ""}: $${((i.priceAtPurchase * i.quantity) / 100).toLocaleString()}`
    )
    .join("\n")

  return `MAISON ÉLISE — ORDER CONFIRMED

${greeting}

Your order has been received and is being prepared with care.

Order Reference: ${orderId}

ITEMS:
${itemLines}

Total: $${(totalAmount / 100).toLocaleString()}

We will be in touch with shipping details soon.

Maison Élise Concierge`
}
