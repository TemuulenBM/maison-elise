import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../lib/generated/prisma";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const IMG = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=800`;

async function main() {
  console.log("🌱 Seeding database...");

  // ─── Categories ───
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

  const jewellery = await prisma.category.create({
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
    include: { children: true },
  });

  const accessories = await prisma.category.create({
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
    include: { children: true },
  });

  // ─── Category lookups ───
  const handbags = bags.children.find((c) => c.slug === "handbags")!;
  const crossbody = bags.children.find((c) => c.slug === "crossbody")!;
  const shoulderBags = bags.children.find((c) => c.slug === "shoulder-bags")!;
  const toteBags = bags.children.find((c) => c.slug === "tote-bags")!;
  const miniBags = bags.children.find((c) => c.slug === "mini-bags")!;

  const necklaces = jewellery.children.find((c) => c.slug === "necklaces")!;
  const earrings = jewellery.children.find((c) => c.slug === "earrings")!;
  const bracelets = jewellery.children.find((c) => c.slug === "bracelets")!;
  const rings = jewellery.children.find((c) => c.slug === "rings")!;

  const wallets = accessories.children.find((c) => c.slug === "wallets")!;
  const cardHolders = accessories.children.find(
    (c) => c.slug === "card-holders"
  )!;
  const belts = accessories.children.find((c) => c.slug === "belts")!;

  // ─── Collections ───
  const spring2026 = await prisma.collection.create({
    data: {
      slug: "spring-2026",
      name: "Spring 2026",
      description:
        "The Spring 2026 collection celebrates the art of understated luxury.",
    },
  });

  const fall2025 = await prisma.collection.create({
    data: {
      slug: "fall-winter-2025",
      name: "Fall/Winter 2025",
      description:
        "The Fall/Winter 2025 collection explores refined contrasts — rich textures, precious metals, and supple leathers composed with architectural precision.",
    },
  });

  // ─── Handbags (6) ───

  await prisma.product.create({
    data: {
      slug: "cyme-mini-camel",
      name: "Cyme Mini",
      edition: "Edition Textured Camel",
      description:
        "The Cyme Mini embodies understated elegance with its sculpted silhouette and refined details. Crafted from premium textured leather, this versatile tote transitions effortlessly from day to evening.",
      details:
        "Dimensions: 28 × 22 × 12 cm. Adjustable and removable shoulder strap. Interior zip pocket and two slip pockets. Gold-tone hardware.",
      materials:
        "100% Italian calf leather. Cotton canvas lining. Gold-plated brass hardware.",
      materialStory:
        "Sourced from the finest tanneries in Tuscany, our textured calf leather develops a rich patina over time, making each piece uniquely yours.",
      basePrice: 55000,
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
            url: IMG(6650001),
            altText: "Cyme Mini in Camel",
            sortOrder: 0,
            isPrimary: true,
          },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      slug: "cyme-black",
      name: "Cyme",
      edition: "Edition Textured Black",
      description:
        "A statement of modern sophistication, the Cyme tote features architectural lines and exceptional craftsmanship. The spacious interior accommodates all essentials with elegant ease.",
      details:
        "Dimensions: 35 × 28 × 15 cm. Double top handles. Interior zip pocket and two slip pockets. Gold-tone hardware.",
      materials:
        "100% Italian calf leather. Cotton canvas lining. Gold-plated brass hardware.",
      materialStory:
        "Our signature black leather undergoes a multi-step finishing process, resulting in a depth of colour that is both timeless and modern.",
      basePrice: 62000,
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
            url: IMG(1374910),
            altText: "Cyme in Black",
            sortOrder: 0,
            isPrimary: true,
          },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      slug: "cyme-mini-taupe",
      name: "Cyme Mini",
      edition: "Edition Textured Taupe",
      description:
        "Soft yet structured, the Cyme Mini in taupe offers a contemporary neutral that complements any wardrobe. The meticulous stitching and hardware reflect our commitment to excellence.",
      details:
        "Dimensions: 28 × 22 × 12 cm. Adjustable and removable shoulder strap. Interior zip pocket and two slip pockets. Gold-tone hardware.",
      materials:
        "100% Italian calf leather. Cotton canvas lining. Gold-plated brass hardware.",
      basePrice: 55000,
      status: "ACTIVE",
      categoryId: handbags.id,
      collectionId: spring2026.id,
      variants: {
        create: [
          {
            sku: "ME-CMT-TAUPE",
            attributes: { color: "Taupe", colorHex: "#9B9085" },
            stockQuantity: 10,
          },
          {
            sku: "ME-CMT-BLACK",
            attributes: { color: "Black", colorHex: "#1A1A1A" },
            stockQuantity: 18,
          },
          {
            sku: "ME-CMT-CAMEL",
            attributes: { color: "Camel", colorHex: "#C4A77D" },
            stockQuantity: 12,
          },
        ],
      },
      images: {
        create: [
          {
            url: IMG(6650001),
            altText: "Cyme Mini in Taupe",
            sortOrder: 0,
            isPrimary: true,
          },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      slug: "cyme-mini-burgundy",
      name: "Cyme Mini",
      edition: "Edition Textured Burgundy",
      description:
        "Rich and refined, the burgundy Cyme Mini adds a touch of drama to every occasion. The deep, wine-inspired hue is achieved through our exclusive tanning process.",
      details:
        "Dimensions: 28 × 22 × 12 cm. Adjustable and removable shoulder strap. Interior zip pocket and two slip pockets. Gold-tone hardware.",
      materials:
        "100% Italian calf leather. Cotton canvas lining. Gold-plated brass hardware.",
      basePrice: 55000,
      status: "ACTIVE",
      categoryId: handbags.id,
      collectionId: spring2026.id,
      variants: {
        create: [
          {
            sku: "ME-CMB-BURGUNDY",
            attributes: { color: "Burgundy", colorHex: "#722F37" },
            stockQuantity: 6,
          },
          {
            sku: "ME-CMB-BLACK",
            attributes: { color: "Black", colorHex: "#1A1A1A" },
            stockQuantity: 15,
          },
          {
            sku: "ME-CMB-BROWN",
            attributes: { color: "Brown", colorHex: "#5D4037" },
            stockQuantity: 9,
          },
        ],
      },
      images: {
        create: [
          {
            url: IMG(6650001),
            altText: "Cyme Mini in Burgundy",
            sortOrder: 0,
            isPrimary: true,
          },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      slug: "cyme-brown",
      name: "Cyme",
      edition: "Edition Textured Brown",
      description:
        "The classic brown Cyme represents timeless elegance. Its generous proportions and thoughtful organization make it the perfect companion for the modern woman.",
      details:
        "Dimensions: 35 × 28 × 15 cm. Double top handles. Interior zip pocket and two slip pockets. Gold-tone hardware.",
      materials:
        "100% Italian calf leather. Cotton canvas lining. Gold-plated brass hardware.",
      basePrice: 62000,
      status: "ACTIVE",
      categoryId: handbags.id,
      collectionId: spring2026.id,
      variants: {
        create: [
          {
            sku: "ME-CBR-BROWN",
            attributes: { color: "Brown", colorHex: "#5D4037" },
            stockQuantity: 11,
          },
          {
            sku: "ME-CBR-BLACK",
            attributes: { color: "Black", colorHex: "#1A1A1A" },
            stockQuantity: 22,
          },
          {
            sku: "ME-CBR-CAMEL",
            attributes: { color: "Camel", colorHex: "#C4A77D" },
            stockQuantity: 13,
          },
        ],
      },
      images: {
        create: [
          {
            url: IMG(1374910),
            altText: "Cyme in Brown",
            sortOrder: 0,
            isPrimary: true,
          },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      slug: "cyme-mini-root",
      name: "Cyme Mini",
      edition: "Edition Textured Root",
      description:
        "Rooted in tradition yet distinctly modern, this Cyme Mini features an earthy tone that evokes natural beauty and artisanal craftsmanship.",
      details:
        "Dimensions: 28 × 22 × 12 cm. Adjustable and removable shoulder strap. Interior zip pocket and two slip pockets. Gold-tone hardware.",
      materials:
        "100% Italian calf leather. Cotton canvas lining. Gold-plated brass hardware.",
      basePrice: 55000,
      status: "ACTIVE",
      categoryId: handbags.id,
      collectionId: spring2026.id,
      variants: {
        create: [
          {
            sku: "ME-CMR-ROOT",
            attributes: { color: "Root", colorHex: "#5D4037" },
            stockQuantity: 7,
          },
          {
            sku: "ME-CMR-TAUPE",
            attributes: { color: "Taupe", colorHex: "#9B9085" },
            stockQuantity: 10,
          },
          {
            sku: "ME-CMR-BLACK",
            attributes: { color: "Black", colorHex: "#1A1A1A" },
            stockQuantity: 16,
          },
        ],
      },
      images: {
        create: [
          {
            url: IMG(6650001),
            altText: "Cyme Mini in Root",
            sortOrder: 0,
            isPrimary: true,
          },
        ],
      },
    },
  });

  // ─── Crossbody bags (2) ───

  await prisma.product.create({
    data: {
      slug: "solene-crossbody",
      name: "Solène",
      edition: "Crossbody",
      description:
        "The Solène Crossbody is a study in refined minimalism. Its compact silhouette conceals a surprisingly spacious interior, while the adjustable chain-and-leather strap adds a touch of Parisian flair.",
      details:
        "Dimensions: 22 × 16 × 8 cm. Adjustable chain strap, 55–110 cm drop. One exterior slip pocket. Magnetic closure. Gold-tone hardware.",
      materials:
        "Smooth calfskin leather exterior. Suede lining. 18k gold-plated chain and brass hardware.",
      materialStory:
        "The Solène is crafted in our Florentine atelier using leather from a single-source tannery, selected for its exceptional grain consistency and durability.",
      basePrice: 48000,
      status: "ACTIVE",
      categoryId: crossbody.id,
      collectionId: spring2026.id,
      variants: {
        create: [
          {
            sku: "ME-SOL-NOIR",
            attributes: { color: "Noir", colorHex: "#1A1A1A" },
            stockQuantity: 18,
          },
          {
            sku: "ME-SOL-COGNAC",
            attributes: { color: "Cognac", colorHex: "#9E4B1A" },
            stockQuantity: 12,
          },
          {
            sku: "ME-SOL-SAND",
            attributes: { color: "Sand", colorHex: "#D4B896" },
            stockQuantity: 10,
          },
        ],
      },
      images: {
        create: [
          {
            url: IMG(167703),
            altText: "Solène Crossbody",
            sortOrder: 0,
            isPrimary: true,
          },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      slug: "vivienne-mini-crossbody",
      name: "Vivienne Mini",
      edition: "Crossbody",
      description:
        "Effortlessly chic, the Vivienne Mini pairs a structured body with a delicate wrist strap — as ideal for the theatre as for a morning at the market.",
      details:
        "Dimensions: 18 × 13 × 6 cm. Detachable wrist strap and shoulder strap. Snap closure. Gold-tone hardware.",
      materials:
        "Quilted lambskin leather. Silk-blend lining. Gold-plated brass hardware.",
      materialStory:
        "Our lambskin undergoes a proprietary quilting process that creates a subtle diamond motif — a signature detail of the Vivienne line.",
      basePrice: 42000,
      status: "ACTIVE",
      categoryId: crossbody.id,
      collectionId: spring2026.id,
      variants: {
        create: [
          {
            sku: "ME-VIV-BLUSH",
            attributes: { color: "Blush", colorHex: "#E8B4A0" },
            stockQuantity: 9,
          },
          {
            sku: "ME-VIV-CAMEL",
            attributes: { color: "Camel", colorHex: "#C4A77D" },
            stockQuantity: 14,
          },
          {
            sku: "ME-VIV-MIDNIGHT",
            attributes: { color: "Midnight", colorHex: "#1C2B4A" },
            stockQuantity: 11,
          },
        ],
      },
      images: {
        create: [
          {
            url: IMG(978665),
            altText: "Vivienne Mini Crossbody",
            sortOrder: 0,
            isPrimary: true,
          },
        ],
      },
    },
  });

  // ─── Shoulder bag (1) ───

  await prisma.product.create({
    data: {
      slug: "eclat-shoulder",
      name: "Éclat",
      edition: "Shoulder Bag",
      description:
        "The Éclat Shoulder Bag is defined by its generous structure and sumptuous leather — a modern silhouette that carries the weight of the day with effortless grace.",
      details:
        "Dimensions: 32 × 24 × 10 cm. Fixed shoulder straps, 45 cm drop. Double interior compartments. Zip and slip pockets. Polished gold-tone hardware.",
      materials:
        "Full-grain calfskin leather. Cotton canvas lining. Solid brass hardware with gold plating.",
      materialStory:
        "Full-grain leather is the highest quality cut from the hide. The Éclat uses a premium French tannage that preserves the leather's natural texture while imparting exceptional softness.",
      basePrice: 52000,
      status: "ACTIVE",
      categoryId: shoulderBags.id,
      collectionId: spring2026.id,
      variants: {
        create: [
          {
            sku: "ME-ECL-IVORY",
            attributes: { color: "Ivory", colorHex: "#F5F0E8" },
            stockQuantity: 8,
          },
          {
            sku: "ME-ECL-TAUPE",
            attributes: { color: "Taupe", colorHex: "#9B9085" },
            stockQuantity: 13,
          },
          {
            sku: "ME-ECL-NOIR",
            attributes: { color: "Noir", colorHex: "#1A1A1A" },
            stockQuantity: 20,
          },
        ],
      },
      images: {
        create: [
          {
            url: IMG(1204464),
            altText: "Éclat Shoulder Bag",
            sortOrder: 0,
            isPrimary: true,
          },
        ],
      },
    },
  });

  // ─── Tote bag (1) ───

  await prisma.product.create({
    data: {
      slug: "lumiere-tote",
      name: "Lumière",
      edition: "Tote",
      description:
        "The Lumière Tote is a masterwork of understated luxury — its open silhouette and supple leather evolve beautifully with wear, bearing the marks of a life well-lived.",
      details:
        "Dimensions: 42 × 32 × 18 cm. Double handles, 28 cm drop. Interior zip pocket and four slip pockets. Signature Maison Élise dust bag included.",
      materials:
        "Vegetable-tanned calfskin leather. Cotton and linen lining. Hand-stitched rolled handles.",
      materialStory:
        "Vegetable tanning is a centuries-old process using natural oak bark extracts. Unlike chrome tanning, it produces leather that deepens in colour and softness with every use — a living material.",
      basePrice: 68000,
      status: "ACTIVE",
      categoryId: toteBags.id,
      collectionId: spring2026.id,
      variants: {
        create: [
          {
            sku: "ME-LUM-NATURAL",
            attributes: { color: "Natural", colorHex: "#D4B896" },
            stockQuantity: 10,
          },
          {
            sku: "ME-LUM-NOIR",
            attributes: { color: "Noir", colorHex: "#1A1A1A" },
            stockQuantity: 15,
          },
          {
            sku: "ME-LUM-STONE",
            attributes: { color: "Stone", colorHex: "#8A8680" },
            stockQuantity: 8,
          },
        ],
      },
      images: {
        create: [
          {
            url: IMG(1936848),
            altText: "Lumière Tote",
            sortOrder: 0,
            isPrimary: true,
          },
        ],
      },
    },
  });

  // ─── Mini bag (1) ───

  await prisma.product.create({
    data: {
      slug: "petite-miroir",
      name: "Petite Miroir",
      edition: "Mini Bag",
      description:
        "The Petite Miroir is a jewel-box of a bag — small enough to hold your evening essentials, exquisite enough to demand attention. Finished with a polished top-handle and an ornamental mirror clip.",
      details:
        "Dimensions: 16 × 12 × 5 cm. Removable chain strap, 120 cm drop. Magnetic closure. Interior mirror panel. Gold-tone hardware.",
      materials:
        "Patent calfskin leather. Satin lining. 18k gold-plated hardware with engraved ME monogram.",
      materialStory:
        "Patent leather is coated with a high-gloss lacquer that catches and reflects light — an ideal canvas for the Petite Miroir's sculptural form.",
      basePrice: 38000,
      status: "ACTIVE",
      categoryId: miniBags.id,
      collectionId: fall2025.id,
      variants: {
        create: [
          {
            sku: "ME-PM-BLUSH",
            attributes: { color: "Blush", colorHex: "#E8B4A0" },
            stockQuantity: 7,
          },
          {
            sku: "ME-PM-IVORY",
            attributes: { color: "Ivory", colorHex: "#F5F0E8" },
            stockQuantity: 10,
          },
          {
            sku: "ME-PM-OR",
            attributes: { color: "Or", colorHex: "#C9A96E" },
            stockQuantity: 5,
          },
        ],
      },
      images: {
        create: [
          {
            url: IMG(15320823),
            altText: "Petite Miroir Mini Bag",
            sortOrder: 0,
            isPrimary: true,
          },
        ],
      },
    },
  });

  // ─── Jewellery (4) ───

  await prisma.product.create({
    data: {
      slug: "arene-choker",
      name: "Arène",
      edition: "Choker Necklace",
      description:
        "The Arène Choker is a declaration of presence. Its close-fit silhouette and interlocking oval links — each hand-polished to a mirror finish — circle the neck with architectural authority.",
      details:
        "Chain length: 36 cm with 4 cm extension. Width: 8 mm. Lobster-claw clasp. Each link hand-polished.",
      materials:
        "18k gold vermeil over sterling silver. Nickel-free. Tarnish-resistant finish.",
      materialStory:
        "Gold vermeil involves a thick layer of 18k gold bonded to sterling silver — offering the warmth of solid gold jewellery with superior durability compared to standard gold-plating.",
      basePrice: 28000,
      status: "ACTIVE",
      categoryId: necklaces.id,
      collectionId: fall2025.id,
      variants: {
        create: [
          {
            sku: "ME-ARC-GOLD",
            attributes: { color: "Gold", colorHex: "#C9A96E" },
            stockQuantity: 20,
          },
          {
            sku: "ME-ARC-SILVER",
            attributes: { color: "Silver", colorHex: "#C0C0C0" },
            stockQuantity: 15,
          },
        ],
      },
      images: {
        create: [
          {
            url: IMG(10581731),
            altText: "Arène Choker Necklace",
            sortOrder: 0,
            isPrimary: true,
          },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      slug: "celeste-drop-earrings",
      name: "Céleste",
      edition: "Drop Earrings",
      description:
        "The Céleste Drop Earrings balance simplicity and movement — a fluid teardrop silhouette that catches the light with every turn of the head, from boardroom to candlelit dinner.",
      details:
        "Length: 4.5 cm. Width: 1.2 cm. Post and butterfly clasp. Suitable for pierced ears.",
      materials:
        "18k gold vermeil over sterling silver. Freshwater pearl option. Nickel-free.",
      materialStory:
        "Our freshwater pearls are sourced from sustainable aquaculture farms and individually graded for lustre and uniformity — no two pairs are identical.",
      basePrice: 19500,
      status: "ACTIVE",
      categoryId: earrings.id,
      collectionId: fall2025.id,
      variants: {
        create: [
          {
            sku: "ME-CEL-GOLD",
            attributes: { color: "Gold", colorHex: "#C9A96E" },
            stockQuantity: 25,
          },
          {
            sku: "ME-CEL-PEARL",
            attributes: { color: "Pearl", colorHex: "#F0EAD6" },
            stockQuantity: 18,
          },
        ],
      },
      images: {
        create: [
          {
            url: IMG(12144990),
            altText: "Céleste Drop Earrings",
            sortOrder: 0,
            isPrimary: true,
          },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      slug: "riviere-bracelet",
      name: "Rivière",
      edition: "Chain Bracelet",
      description:
        "Inspired by 19th-century rivière necklaces, the Rivière Chain Bracelet translates that heritage into a modern wrist adornment — each link individually shaped and polished by hand.",
      details:
        "Length: 18 cm. Width: 5 mm. Adjustable lobster clasp with 3 cm extension. Weight: 12g.",
      materials:
        "18k gold vermeil over sterling silver. Nickel-free. Tarnish-resistant finish.",
      materialStory:
        "Each Rivière bracelet passes through the hands of three craftspeople: a metalsmith who forms the links, a polisher who creates the mirror finish, and a quality expert who inspects every joint.",
      basePrice: 24500,
      status: "ACTIVE",
      categoryId: bracelets.id,
      collectionId: fall2025.id,
      variants: {
        create: [
          {
            sku: "ME-RIV-GOLD",
            attributes: { color: "Gold", colorHex: "#C9A96E" },
            stockQuantity: 22,
          },
          {
            sku: "ME-RIV-SILVER",
            attributes: { color: "Silver", colorHex: "#C0C0C0" },
            stockQuantity: 16,
          },
        ],
      },
      images: {
        create: [
          {
            url: IMG(20858959),
            altText: "Rivière Chain Bracelet",
            sortOrder: 0,
            isPrimary: true,
          },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      slug: "andante-ring",
      name: "Andante",
      edition: "Stacking Ring",
      description:
        "The Andante Stacking Ring is designed for layering — its low-profile band and refined finish reads equally well alone or stacked with companions. A quiet jewel for the considered dresser.",
      details:
        "Width: 2 mm. Available in sizes EU 48–60. Weight: 3g. Sold individually.",
      materials:
        "18k gold vermeil over sterling silver. Rose gold option in 18k rose gold vermeil. Nickel-free.",
      materialStory:
        "The Andante's slender band is formed from a single piece of silver wire, shaped on a mandrel and finished with a satin-matte surface — a contemporary contrast to our mirror-polished pieces.",
      basePrice: 16500,
      status: "ACTIVE",
      categoryId: rings.id,
      collectionId: fall2025.id,
      variants: {
        create: [
          {
            sku: "ME-AND-GOLD",
            attributes: { color: "Gold", colorHex: "#C9A96E" },
            stockQuantity: 30,
          },
          {
            sku: "ME-AND-ROSEGOLD",
            attributes: { color: "Rose Gold", colorHex: "#B76E79" },
            stockQuantity: 24,
          },
        ],
      },
      images: {
        create: [
          {
            url: IMG(1616096),
            altText: "Andante Stacking Ring",
            sortOrder: 0,
            isPrimary: true,
          },
        ],
      },
    },
  });

  // ─── Accessories (3) ───

  await prisma.product.create({
    data: {
      slug: "merci-wallet",
      name: "Merci",
      edition: "Zip Wallet",
      description:
        "The Merci Zip Wallet elevates a daily essential into an object of desire. Twelve card slots, a zipped coin compartment, and a full-length bill pocket — all within a silhouette of deceptive slimness.",
      details:
        "Dimensions: 19 × 9.5 × 2 cm. 12 card slots. 1 zipped coin compartment. 2 full-length bill pockets. Exterior zip closure.",
      materials:
        "Smooth calfskin leather. Cotton canvas lining. Gold-plated brass zipper.",
      materialStory:
        "The Merci is cut from a single hide selected for its even grain and suppleness — ensuring the wallet lies flat from day one and breaks in beautifully over time.",
      basePrice: 29500,
      status: "ACTIVE",
      categoryId: wallets.id,
      collectionId: fall2025.id,
      variants: {
        create: [
          {
            sku: "ME-MRC-NOIR",
            attributes: { color: "Noir", colorHex: "#1A1A1A" },
            stockQuantity: 20,
          },
          {
            sku: "ME-MRC-COGNAC",
            attributes: { color: "Cognac", colorHex: "#9E4B1A" },
            stockQuantity: 15,
          },
          {
            sku: "ME-MRC-IVORY",
            attributes: { color: "Ivory", colorHex: "#F5F0E8" },
            stockQuantity: 12,
          },
        ],
      },
      images: {
        create: [
          {
            url: IMG(7927429),
            altText: "Merci Zip Wallet",
            sortOrder: 0,
            isPrimary: true,
          },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      slug: "felix-card-holder",
      name: "Félix",
      edition: "Card Holder",
      description:
        "Minimal by design, maximum in intention — the Félix Card Holder is an exercise in restraint. Four card slots and a central pocket for notes, wrapped in the finest calfskin.",
      details:
        "Dimensions: 10.5 × 7.5 × 0.6 cm. 4 card slots. 1 central flat pocket. Debossed Maison Élise logo.",
      materials:
        "Smooth calfskin leather. No lining. Debossed Maison Élise logo.",
      materialStory:
        "At just 0.6 cm, the Félix requires leather of exceptional tightness and resilience — we use the same hide as our small leather goods line, selected for its ability to hold structure at minimal thickness.",
      basePrice: 14500,
      status: "ACTIVE",
      categoryId: cardHolders.id,
      collectionId: fall2025.id,
      variants: {
        create: [
          {
            sku: "ME-FLX-TAN",
            attributes: { color: "Tan", colorHex: "#C4A77D" },
            stockQuantity: 25,
          },
          {
            sku: "ME-FLX-NOIR",
            attributes: { color: "Noir", colorHex: "#1A1A1A" },
            stockQuantity: 30,
          },
          {
            sku: "ME-FLX-BURGUNDY",
            attributes: { color: "Burgundy", colorHex: "#722F37" },
            stockQuantity: 18,
          },
        ],
      },
      images: {
        create: [
          {
            url: IMG(28028264),
            altText: "Félix Card Holder",
            sortOrder: 0,
            isPrimary: true,
          },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      slug: "ceinture-belt",
      name: "Ceinture",
      edition: "Leather Belt",
      description:
        "The Ceinture Belt is cut from a single piece of full-grain leather — no joins, no compromises. A rectangular gold-plated buckle completes a silhouette that works as effortlessly with tailoring as with denim.",
      details:
        "Width: 3 cm. Available in sizes XS–XL. Buckle: solid brass, 18k gold-plated. Five adjustment holes.",
      materials:
        "Full-grain calfskin leather. Solid brass buckle with 18k gold plating.",
      materialStory:
        "A single-piece belt demands a hide of exceptional length and consistency. Our Ceinture is cut from the dorsal strap — the highest quality section of the hide, prized for its uniformity of grain.",
      basePrice: 22500,
      status: "ACTIVE",
      categoryId: belts.id,
      collectionId: fall2025.id,
      variants: {
        create: [
          {
            sku: "ME-CEI-NOIR",
            attributes: { color: "Noir", colorHex: "#1A1A1A" },
            stockQuantity: 20,
          },
          {
            sku: "ME-CEI-COGNAC",
            attributes: { color: "Cognac", colorHex: "#9E4B1A" },
            stockQuantity: 15,
          },
        ],
      },
      images: {
        create: [
          {
            url: IMG(4452642),
            altText: "Ceinture Leather Belt",
            sortOrder: 0,
            isPrimary: true,
          },
        ],
      },
    },
  });

  console.log("✅ Seed completed!");
  console.log(
    "   18 products | 46 variants | 3 category trees | 2 collections"
  );
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
