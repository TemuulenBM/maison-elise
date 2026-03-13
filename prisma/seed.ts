import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../lib/generated/prisma";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // ─── Categories (parent + children) ───
  const bags = await prisma.category.create({
    data: {
      slug: "bags",
      name: "Bags",
      sortOrder: 0,
      children: {
        create: [
          { slug: "handbags", name: "Handbags", sortOrder: 0 },
          { slug: "crossbody", name: "Crossbody", sortOrder: 1 },
          { slug: "shoulder-bags", name: "Shoulder bags", sortOrder: 2 },
          { slug: "tote-bags", name: "Tote bags", sortOrder: 3 },
          { slug: "mini-bags", name: "Mini bags", sortOrder: 4 },
          { slug: "pouch", name: "Pouch", sortOrder: 5 },
        ],
      },
    },
    include: { children: true },
  });

  await prisma.category.create({
    data: {
      slug: "jewellery",
      name: "Jewellery",
      sortOrder: 1,
      children: {
        create: [
          { slug: "necklaces", name: "Necklaces", sortOrder: 0 },
          { slug: "earrings", name: "Earrings", sortOrder: 1 },
          { slug: "bracelets", name: "Bracelets", sortOrder: 2 },
          { slug: "rings", name: "Rings", sortOrder: 3 },
        ],
      },
    },
  });

  await prisma.category.create({
    data: {
      slug: "accessories",
      name: "Accessories",
      sortOrder: 2,
      children: {
        create: [
          { slug: "wallets", name: "Wallets", sortOrder: 0 },
          { slug: "card-holders", name: "Card holders", sortOrder: 1 },
          { slug: "keyrings", name: "Keyrings", sortOrder: 2 },
          { slug: "belts", name: "Belts", sortOrder: 3 },
          {
            slug: "small-leather-goods",
            name: "Small leather goods",
            sortOrder: 4,
          },
        ],
      },
    },
  });

  // ─── Collection ───
  const spring2026 = await prisma.collection.create({
    data: {
      slug: "spring-2026",
      name: "Spring 2026",
      description:
        "The Spring 2026 collection celebrates the art of understated luxury.",
    },
  });

  // Handbags category-г олох
  const handbags = bags.children.find((c) => c.slug === "handbags")!;

  // ─── Products + Variants + Images ───

  // Product 1: Cyme Mini — Camel
  await prisma.product.create({
    data: {
      slug: "cyme-mini-camel",
      name: "Cyme Mini",
      edition: "Edition Textured Camel",
      description:
        "The Cyme Mini embodies understated elegance with its sculpted silhouette and refined details. Crafted from premium textured leather, this versatile tote transitions effortlessly from day to evening.",
      details:
        "Dimensions: 28 x 22 x 12 cm. Adjustable and removable shoulder strap. Interior zip pocket and two slip pockets. Gold-tone hardware.",
      materials:
        "100% Italian calf leather. Cotton canvas lining. Gold-plated brass hardware.",
      materialStory:
        "Sourced from the finest tanneries in Tuscany, our textured calf leather develops a rich patina over time, making each piece uniquely yours.",
      basePrice: 55000, // $550
      status: "ACTIVE",
      categoryId: handbags.id,
      collectionId: spring2026.id,
      variants: {
        create: [
          {
            sku: "ME-CM-CAMEL",
            attributes: { color: "Camel", colorHex: "#C4A77D" },
            stockQuantity: 15,
          },
          {
            sku: "ME-CM-BLACK",
            attributes: { color: "Black", colorHex: "#1A1A1A" },
            stockQuantity: 20,
          },
          {
            sku: "ME-CM-TAUPE",
            attributes: { color: "Taupe", colorHex: "#9B9085" },
            stockQuantity: 12,
          },
          {
            sku: "ME-CM-BURGUNDY",
            attributes: { color: "Burgundy", colorHex: "#722F37" },
            stockQuantity: 8,
          },
        ],
      },
      images: {
        create: [
          {
            url: "/images/product-camel.jpg",
            altText: "Cyme Mini in Camel",
            sortOrder: 0,
            isPrimary: true,
          },
        ],
      },
    },
  });

  // Product 2: Cyme — Black
  await prisma.product.create({
    data: {
      slug: "cyme-black",
      name: "Cyme",
      edition: "Edition Textured Black",
      description:
        "A statement of modern sophistication, the Cyme tote features architectural lines and exceptional craftsmanship. The spacious interior accommodates all essentials with elegant ease.",
      details:
        "Dimensions: 35 x 28 x 15 cm. Double top handles. Interior zip pocket and two slip pockets. Gold-tone hardware.",
      materials:
        "100% Italian calf leather. Cotton canvas lining. Gold-plated brass hardware.",
      materialStory:
        "Our signature black leather undergoes a multi-step finishing process, resulting in a depth of colour that is both timeless and modern.",
      basePrice: 62000, // $620
      status: "ACTIVE",
      categoryId: handbags.id,
      collectionId: spring2026.id,
      variants: {
        create: [
          {
            sku: "ME-C-BLACK",
            attributes: { color: "Black", colorHex: "#1A1A1A" },
            stockQuantity: 25,
          },
          {
            sku: "ME-C-CAMEL",
            attributes: { color: "Camel", colorHex: "#C4A77D" },
            stockQuantity: 10,
          },
          {
            sku: "ME-C-BROWN",
            attributes: { color: "Brown", colorHex: "#5D4037" },
            stockQuantity: 14,
          },
        ],
      },
      images: {
        create: [
          {
            url: "/images/product-cyme.jpg",
            altText: "Cyme in Black",
            sortOrder: 0,
            isPrimary: true,
          },
        ],
      },
    },
  });

  // Product 3: Cyme Mini — Taupe
  await prisma.product.create({
    data: {
      slug: "cyme-mini-taupe",
      name: "Cyme Mini",
      edition: "Edition Textured Taupe",
      description:
        "Soft yet structured, the Cyme Mini in taupe offers a contemporary neutral that complements any wardrobe. The meticulous stitching and hardware reflect our commitment to excellence.",
      details:
        "Dimensions: 28 x 22 x 12 cm. Adjustable and removable shoulder strap. Interior zip pocket and two slip pockets. Gold-tone hardware.",
      materials:
        "100% Italian calf leather. Cotton canvas lining. Gold-plated brass hardware.",
      basePrice: 55000,
      status: "ACTIVE",
      categoryId: handbags.id,
      collectionId: spring2026.id,
      variants: {
        create: [
          {
            sku: "ME-CM-TAUPE-2",
            attributes: { color: "Taupe", colorHex: "#9B9085" },
            stockQuantity: 10,
          },
          {
            sku: "ME-CM-BLACK-2",
            attributes: { color: "Black", colorHex: "#1A1A1A" },
            stockQuantity: 18,
          },
          {
            sku: "ME-CM-CAMEL-2",
            attributes: { color: "Camel", colorHex: "#C4A77D" },
            stockQuantity: 12,
          },
        ],
      },
      images: {
        create: [
          {
            url: "/images/product-taupe.jpg",
            altText: "Cyme Mini in Taupe",
            sortOrder: 0,
            isPrimary: true,
          },
        ],
      },
    },
  });

  // Product 4: Cyme Mini — Burgundy
  await prisma.product.create({
    data: {
      slug: "cyme-mini-burgundy",
      name: "Cyme Mini",
      edition: "Edition Textured Burgundy",
      description:
        "Rich and refined, the burgundy Cyme Mini adds a touch of luxury to every occasion. The deep, wine-inspired hue is achieved through our exclusive tanning process.",
      details:
        "Dimensions: 28 x 22 x 12 cm. Adjustable and removable shoulder strap. Interior zip pocket and two slip pockets. Gold-tone hardware.",
      materials:
        "100% Italian calf leather. Cotton canvas lining. Gold-plated brass hardware.",
      basePrice: 55000,
      status: "ACTIVE",
      categoryId: handbags.id,
      collectionId: spring2026.id,
      variants: {
        create: [
          {
            sku: "ME-CM-BURG",
            attributes: { color: "Burgundy", colorHex: "#722F37" },
            stockQuantity: 6,
          },
          {
            sku: "ME-CM-BLACK-3",
            attributes: { color: "Black", colorHex: "#1A1A1A" },
            stockQuantity: 15,
          },
          {
            sku: "ME-CM-BROWN-2",
            attributes: { color: "Brown", colorHex: "#5D4037" },
            stockQuantity: 9,
          },
        ],
      },
      images: {
        create: [
          {
            url: "/images/product-burgundy.jpg",
            altText: "Cyme Mini in Burgundy",
            sortOrder: 0,
            isPrimary: true,
          },
        ],
      },
    },
  });

  // Product 5: Cyme — Brown
  await prisma.product.create({
    data: {
      slug: "cyme-brown",
      name: "Cyme",
      edition: "Edition Textured Brown",
      description:
        "The classic brown Cyme represents timeless elegance. Its generous proportions and thoughtful organization make it the perfect companion for the modern woman.",
      details:
        "Dimensions: 35 x 28 x 15 cm. Double top handles. Interior zip pocket and two slip pockets. Gold-tone hardware.",
      materials:
        "100% Italian calf leather. Cotton canvas lining. Gold-plated brass hardware.",
      basePrice: 62000,
      status: "ACTIVE",
      categoryId: handbags.id,
      collectionId: spring2026.id,
      variants: {
        create: [
          {
            sku: "ME-C-BROWN-2",
            attributes: { color: "Brown", colorHex: "#5D4037" },
            stockQuantity: 11,
          },
          {
            sku: "ME-C-BLACK-2",
            attributes: { color: "Black", colorHex: "#1A1A1A" },
            stockQuantity: 22,
          },
          {
            sku: "ME-C-CAMEL-2",
            attributes: { color: "Camel", colorHex: "#C4A77D" },
            stockQuantity: 13,
          },
        ],
      },
      images: {
        create: [
          {
            url: "/images/product-brown.jpg",
            altText: "Cyme in Brown",
            sortOrder: 0,
            isPrimary: true,
          },
        ],
      },
    },
  });

  // Product 6: Cyme Mini — Root
  await prisma.product.create({
    data: {
      slug: "cyme-mini-root",
      name: "Cyme Mini",
      edition: "Edition Textured Root",
      description:
        "Rooted in tradition yet distinctly modern, this Cyme Mini features an earthy tone that evokes natural beauty and artisanal craftsmanship.",
      details:
        "Dimensions: 28 x 22 x 12 cm. Adjustable and removable shoulder strap. Interior zip pocket and two slip pockets. Gold-tone hardware.",
      materials:
        "100% Italian calf leather. Cotton canvas lining. Gold-plated brass hardware.",
      basePrice: 55000,
      status: "ACTIVE",
      categoryId: handbags.id,
      collectionId: spring2026.id,
      variants: {
        create: [
          {
            sku: "ME-CM-ROOT",
            attributes: { color: "Root", colorHex: "#5D4037" },
            stockQuantity: 7,
          },
          {
            sku: "ME-CM-TAUPE-3",
            attributes: { color: "Taupe", colorHex: "#9B9085" },
            stockQuantity: 10,
          },
          {
            sku: "ME-CM-BLACK-4",
            attributes: { color: "Black", colorHex: "#1A1A1A" },
            stockQuantity: 16,
          },
        ],
      },
      images: {
        create: [
          {
            url: "/images/product-brown.jpg",
            altText: "Cyme Mini in Root",
            sortOrder: 0,
            isPrimary: true,
          },
        ],
      },
    },
  });

  console.log("✅ Seed completed!");
  console.log("   6 products, 19 variants, 3 category trees, 1 collection");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
