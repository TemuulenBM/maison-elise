import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { resend, FROM_EMAIL } from "@/lib/resend";

const conciergeSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  phone: z.string().max(30).optional(),
  service: z.string().max(100).optional(),
  message: z.string().min(10).max(2000),
});

const CONCIERGE_EMAIL = process.env.CONCIERGE_EMAIL ?? "concierge@maison-elise.com";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = conciergeSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { name, email, phone, service, message } = parsed.data;

  await resend.emails.send({
    from: FROM_EMAIL,
    to: CONCIERGE_EMAIL,
    replyTo: email,
    subject: `Concierge Request${service ? ` — ${service}` : ""} from ${name}`,
    html: `
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ""}
      ${service ? `<p><strong>Service:</strong> ${service}</p>` : ""}
      <hr>
      <p>${message.replace(/\n/g, "<br>")}</p>
    `,
    text: `Name: ${name}\nEmail: ${email}${phone ? `\nPhone: ${phone}` : ""}${service ? `\nService: ${service}` : ""}\n\n${message}`,
  });

  return NextResponse.json({ success: true });
}
