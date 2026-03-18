// GROQ queries for Sanity CMS editorial/lookbook content

export const ALL_LOOKBOOKS_QUERY = `*[_type == "lookbook"] | order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  description,
  publishedAt,
  season,
  "mainImageUrl": mainImage.asset->url
}`;

export const LOOKBOOK_BY_SLUG_QUERY = `*[_type == "lookbook" && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
  description,
  publishedAt,
  season,
  "mainImageUrl": mainImage.asset->url
}`;
