import { SITE_IMAGES } from "@/lib/site-images";
import type { Product, Category } from '@/types';

export const products: Product[] = [
  {
    id: '1',
    name: 'Cyme Mini',
    edition: 'Edition Textured Camel',
    price: 550,
    image: SITE_IMAGES.productCamel,
    category: 'handbags',
    description: 'The Cyme Mini embodies understated elegance with its sculpted silhouette and refined details. Crafted from premium textured leather, this versatile tote transitions effortlessly from day to evening.',
    details: 'Dimensions: 28 x 22 x 12 cm. Adjustable and removable shoulder strap. Interior zip pocket and two slip pockets. Gold-tone hardware.',
    materials: '100% Italian calf leather. Cotton canvas lining. Gold-plated brass hardware.',
    colors: [
      { name: 'Camel', hex: '#C4A77D', image: SITE_IMAGES.productCamel },
      { name: 'Black', hex: '#1A1A1A', image: SITE_IMAGES.productCyme },
      { name: 'Taupe', hex: '#9B9085', image: SITE_IMAGES.productTaupe },
      { name: 'Burgundy', hex: '#722F37', image: SITE_IMAGES.productBurgundy },
    ],
  },
  {
    id: '2',
    name: 'Cyme',
    edition: 'Edition Textured Black',
    price: 620,
    image: SITE_IMAGES.productCyme,
    category: 'handbags',
    description: 'A statement of modern sophistication, the Cyme tote features architectural lines and exceptional craftsmanship. The spacious interior accommodates all essentials with elegant ease.',
    details: 'Dimensions: 35 x 28 x 15 cm. Double top handles. Interior zip pocket and two slip pockets. Gold-tone hardware.',
    materials: '100% Italian calf leather. Cotton canvas lining. Gold-plated brass hardware.',
    colors: [
      { name: 'Black', hex: '#1A1A1A', image: SITE_IMAGES.productCyme },
      { name: 'Camel', hex: '#C4A77D', image: SITE_IMAGES.productCamel },
      { name: 'Brown', hex: '#5D4037', image: SITE_IMAGES.productBrown },
    ],
  },
  {
    id: '3',
    name: 'Cyme Mini',
    edition: 'Edition Textured Taupe',
    price: 550,
    image: SITE_IMAGES.productTaupe,
    category: 'handbags',
    description: 'Soft yet structured, the Cyme Mini in taupe offers a contemporary neutral that complements any wardrobe. The meticulous stitching and hardware reflect our commitment to excellence.',
    details: 'Dimensions: 28 x 22 x 12 cm. Adjustable and removable shoulder strap. Interior zip pocket and two slip pockets. Gold-tone hardware.',
    materials: '100% Italian calf leather. Cotton canvas lining. Gold-plated brass hardware.',
    colors: [
      { name: 'Taupe', hex: '#9B9085', image: SITE_IMAGES.productTaupe },
      { name: 'Black', hex: '#1A1A1A', image: SITE_IMAGES.productCyme },
      { name: 'Camel', hex: '#C4A77D', image: SITE_IMAGES.productCamel },
    ],
  },
  {
    id: '4',
    name: 'Cyme Mini',
    edition: 'Edition Textured Burgundy',
    price: 550,
    image: SITE_IMAGES.productBurgundy,
    category: 'handbags',
    description: 'Rich and refined, the burgundy Cyme Mini adds a touch of luxury to every occasion. The deep, wine-inspired hue is achieved through our exclusive tanning process.',
    details: 'Dimensions: 28 x 22 x 12 cm. Adjustable and removable shoulder strap. Interior zip pocket and two slip pockets. Gold-tone hardware.',
    materials: '100% Italian calf leather. Cotton canvas lining. Gold-plated brass hardware.',
    colors: [
      { name: 'Burgundy', hex: '#722F37', image: SITE_IMAGES.productBurgundy },
      { name: 'Black', hex: '#1A1A1A', image: SITE_IMAGES.productCyme },
      { name: 'Brown', hex: '#5D4037', image: SITE_IMAGES.productBrown },
    ],
  },
  {
    id: '5',
    name: 'Cyme',
    edition: 'Edition Textured Brown',
    price: 620,
    image: SITE_IMAGES.productBrown,
    category: 'handbags',
    description: 'The classic brown Cyme represents timeless elegance. Its generous proportions and thoughtful organization make it the perfect companion for the modern woman.',
    details: 'Dimensions: 35 x 28 x 15 cm. Double top handles. Interior zip pocket and two slip pockets. Gold-tone hardware.',
    materials: '100% Italian calf leather. Cotton canvas lining. Gold-plated brass hardware.',
    colors: [
      { name: 'Brown', hex: '#5D4037', image: SITE_IMAGES.productBrown },
      { name: 'Black', hex: '#1A1A1A', image: SITE_IMAGES.productCyme },
      { name: 'Camel', hex: '#C4A77D', image: SITE_IMAGES.productCamel },
    ],
  },
  {
    id: '6',
    name: 'Cyme Mini',
    edition: 'Edition Textured Root',
    price: 550,
    image: SITE_IMAGES.productBrown,
    category: 'handbags',
    description: 'Rooted in tradition yet distinctly modern, this Cyme Mini features an earthy tone that evokes natural beauty and artisanal craftsmanship.',
    details: 'Dimensions: 28 x 22 x 12 cm. Adjustable and removable shoulder strap. Interior zip pocket and two slip pockets. Gold-tone hardware.',
    materials: '100% Italian calf leather. Cotton canvas lining. Gold-plated brass hardware.',
    colors: [
      { name: 'Root', hex: '#5D4037', image: SITE_IMAGES.productBrown },
      { name: 'Taupe', hex: '#9B9085', image: SITE_IMAGES.productTaupe },
      { name: 'Black', hex: '#1A1A1A', image: SITE_IMAGES.productCyme },
    ],
  },
];

export const categories: Category[] = [
  {
    name: 'Bestsellers',
    subcategories: ['View all', 'New in', 'Numero Neuf', 'Numero Dix', 'Cyme', 'Neva'],
  },
  {
    name: 'Bags',
    subcategories: ['Handbags', 'Crossbody', 'Shoulder bags', 'Tote bags', 'Mini bags', 'Pouch'],
  },
  {
    name: 'Jewellery',
    subcategories: ['Necklaces', 'Earrings', 'Bracelets', 'Rings'],
  },
  {
    name: 'Accessories',
    subcategories: ['Wallets', 'Card holders', 'Keyrings', 'Belts', 'Small leather goods'],
  },
];
