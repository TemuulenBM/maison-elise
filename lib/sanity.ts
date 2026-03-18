import { createClient } from "next-sanity";
import { createImageUrlBuilder } from "@sanity/image-url";

// NEXT_PUBLIC_SANITY_PROJECT_ID тохируулагдаагүй үед build алдааг урьдчилан тойрч гарах
export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "placeholder",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-01-01",
  useCdn: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ? true : false,
});

const builder = createImageUrlBuilder(sanityClient);

// builder.image() accepts SanityImageSource — use inferred parameter type
export function urlFor(source: Parameters<typeof builder.image>[0]) {
  return builder.image(source);
}
