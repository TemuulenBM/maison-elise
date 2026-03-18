import "dotenv/config";
import fs from "fs";
import path from "path";
import { prisma } from "../lib/prisma";

const HF_TOKEN = process.env.HF_TOKEN!;
const MODEL = "black-forest-labs/FLUX.1-schnell";
const OUTPUT_DIR = path.join(process.cwd(), "public", "images", "products");

// Base prompt per product slug — color will be injected per variant
const BASE_PROMPTS: Record<string, string> = {
  // Handbags
  "cyme-mini-camel":
    "luxury minimalist structured leather handbag, {color} leather, polished gold hardware, deep charcoal dark background, dramatic studio lighting, editorial product photography",
  "cyme-black":
    "luxury structured leather handbag, {color} leather, refined silhouette, gold clasp, deep charcoal dark background, dramatic studio lighting, high-end fashion editorial",
  "cyme-mini-taupe":
    "luxury compact structured handbag, {color} leather, clean lines, minimalist design, deep charcoal dark background, soft dramatic light, editorial product photography",
  "cyme-mini-burgundy":
    "luxury structured mini handbag, {color} leather, elegant silhouette, gold hardware, deep charcoal dark background, dramatic studio lighting, fashion editorial",
  "cyme-brown":
    "luxury leather handbag, {color} leather, structured silhouette, polished hardware, deep charcoal dark background, dramatic studio lighting, product photography",
  "cyme-mini-root":
    "luxury structured mini handbag, {color} leather, artisan craftsmanship, deep charcoal dark background, dramatic editorial lighting",

  // Crossbody
  "solene-crossbody":
    "luxury slim crossbody bag, {color} pebbled leather, long adjustable strap, minimalist gold clasp, deep charcoal dark background, editorial fashion photography",
  "vivienne-mini-crossbody":
    "luxury mini crossbody bag, {color} leather, structured flap, delicate chain strap, deep charcoal dark background, soft dramatic light, high fashion editorial",

  // Shoulder
  "eclat-shoulder":
    "luxury shoulder bag, {color} leather, elegant half-moon silhouette, tortoiseshell handle, deep charcoal dark background, editorial product photography",

  // Tote
  "lumiere-tote":
    "luxury large tote bag, {color} leather, clean architectural shape, minimal stitching, deep charcoal dark background, dramatic studio light, fashion editorial",

  // Mini
  "petite-miroir":
    "luxury tiny evening clutch, {color} satin with gold mirror clasp, delicate chain strap, deep charcoal dark background, high-end fashion editorial photography",

  // Jewellery — Necklaces
  "arene-choker":
    "luxury {color} chain choker necklace, close-up on dark marble surface, dramatic side lighting, editorial jewelry photography",

  // Jewellery — Earrings
  "celeste-drop-earrings":
    "luxury {color} drop earrings with pearl accent, pair displayed on dark marble, dramatic lighting, editorial jewelry photography",

  // Jewellery — Bracelets
  "riviere-bracelet":
    "luxury delicate {color} chain bracelet, close-up on dark marble, dramatic side light, editorial jewelry photography",

  // Jewellery — Rings
  "andante-ring":
    "luxury slim {color} stacking ring, close-up on dark marble surface, dramatic studio lighting, minimalist editorial jewelry photography",

  // Accessories — Wallets
  "merci-wallet":
    "luxury zip-around wallet, {color} smooth leather, open showing card slots, deep charcoal dark background, editorial accessories photography",

  // Accessories — Card Holders
  "felix-card-holder":
    "luxury slim card holder, {color} leather, fanned out showing slots, deep charcoal dark background, editorial product photography",

  // Accessories — Belts
  "ceinture-belt":
    "luxury leather belt, {color} leather with polished gold pin buckle, coiled on dark marble surface, editorial accessories photography",
};

async function generateImage(slug: string, prompt: string): Promise<Buffer> {
  const res = await fetch(
    `https://router.huggingface.co/hf-inference/models/${MODEL}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          num_inference_steps: 4,
          width: 800,
          height: 800,
        },
      }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`HF API error for ${slug}: ${res.status} ${err}`);
  }

  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

async function main() {
  if (!HF_TOKEN) {
    throw new Error("HF_TOKEN is not set in environment");
  }

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  // Get all products with their variants
  const products = await prisma.product.findMany({
    select: {
      id: true,
      slug: true,
      name: true,
      variants: {
        select: { id: true, sku: true, attributes: true },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  console.log(`Found ${products.length} products. Generating per-variant images...\n`);

  let success = 0;
  let skipped = 0;
  let errors = 0;

  for (const product of products) {
    const basePrompt = BASE_PROMPTS[product.slug];
    if (!basePrompt) {
      console.log(`  Skipping ${product.slug} — no prompt defined`);
      skipped++;
      continue;
    }

    for (const variant of product.variants) {
      const attrs = variant.attributes as { color?: string; colorHex?: string };
      const colorName = attrs.color ?? "neutral";
      const colorSlug = colorName.toLowerCase().replace(/\s+/g, "-");
      const prompt = basePrompt.replace("{color}", colorName.toLowerCase());

      const fileName = `${product.slug}-${colorSlug}.jpg`;
      const filePath = path.join(OUTPUT_DIR, fileName);
      const publicUrl = `/images/products/${fileName}`;

      const fileExists = fs.existsSync(filePath);
      console.log(`  ${fileExists ? "Linking" : "Generating"}: ${fileName} (${colorName})...`);

      try {
        if (!fileExists) {
          const imageBuffer = await generateImage(fileName, prompt);
          fs.writeFileSync(filePath, imageBuffer);
        }

        // Upsert variant image in DB
        const existing = await prisma.productImage.findFirst({
          where: { productId: product.id, variantId: variant.id },
        });

        if (existing) {
          await prisma.productImage.update({
            where: { id: existing.id },
            data: { url: publicUrl, altText: `${product.name} — ${colorName}` },
          });
        } else {
          await prisma.productImage.create({
            data: {
              productId: product.id,
              variantId: variant.id,
              url: publicUrl,
              altText: `${product.name} — ${colorName}`,
              isPrimary: false,
              sortOrder: 1,
            },
          });
        }

        // Set first variant's image as the product's primary image too
        const isFirstVariant = product.variants.indexOf(variant) === 0;
        if (isFirstVariant) {
          const primaryExisting = await prisma.productImage.findFirst({
            where: { productId: product.id, isPrimary: true, variantId: null },
          });
          if (primaryExisting) {
            await prisma.productImage.update({
              where: { id: primaryExisting.id },
              data: { url: publicUrl, altText: `${product.name} — ${colorName}` },
            });
          } else {
            await prisma.productImage.create({
              data: {
                productId: product.id,
                variantId: null,
                url: publicUrl,
                altText: product.name,
                isPrimary: true,
                sortOrder: 0,
              },
            });
          }
        }

        console.log(`  ✓ Saved & DB updated: ${publicUrl}`);
        success++;

        // Delay to respect rate limits (only when actually calling the API)
        if (!fileExists) await new Promise((r) => setTimeout(r, 300));
      } catch (err) {
        console.error(`  ERROR for ${fileName}:`, err);
        errors++;
      }
    }
  }

  console.log(`\nDone. ${success} generated, ${skipped} skipped, ${errors} errors.`);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (prisma as any).$disconnect();
}

main().catch((e) => {
  console.error(e);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (prisma as any).$disconnect();
  process.exit(1);
});
