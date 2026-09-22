import { SOURCE_CHECKED_DATE } from "../config.ts";

export const AMAZON_SELLER_GUIDANCE_URL = "https://m.media-amazon.com/images/G/28/AS/AGS/SU/CN_GS_Listing_Optimization_1.1_General_Guidance_EN.pdf";
export const AMAZON_SELLER_FORUM_URL = "https://sellercentral.amazon.com/seller-forums/discussions/t/ab884127-f9b4-4053-8096-4991e1d60d1f";

export const amazonMainImageRules = [
  {
    id: "readable",
    description: "The selected file can be decoded as an image.",
    sourceUrl: AMAZON_SELLER_GUIDANCE_URL,
    sourceCheckedDate: SOURCE_CHECKED_DATE,
    kind: "hard",
  },
  {
    id: "dimensions",
    description: "Main-image dimensions should meet the minimum upload size and are clearer at 1000 px or more.",
    sourceUrl: AMAZON_SELLER_GUIDANCE_URL,
    sourceCheckedDate: SOURCE_CHECKED_DATE,
    kind: "hard",
    minimumPixels: 500,
    recommendedPixels: 1000,
  },
  {
    id: "longest-side",
    description: "The longest side should be large enough for product-image viewing and zoom.",
    sourceUrl: AMAZON_SELLER_GUIDANCE_URL,
    sourceCheckedDate: SOURCE_CHECKED_DATE,
    kind: "recommendation",
    minimumPixels: 500,
    recommendedPixels: 1000,
  },
  {
    id: "file-type",
    description: "The image uses a commonly accepted Amazon product-image format.",
    sourceUrl: AMAZON_SELLER_GUIDANCE_URL,
    sourceCheckedDate: SOURCE_CHECKED_DATE,
    kind: "hard",
    allowedMimeTypes: ["image/jpeg", "image/png", "image/tiff", "image/gif"],
  },
  {
    id: "file-size",
    description: "The file stays below a practical 10 MB preflight recommendation.",
    sourceUrl: AMAZON_SELLER_GUIDANCE_URL,
    sourceCheckedDate: SOURCE_CHECKED_DATE,
    kind: "recommendation",
    recommendedBytes: 10_000_000,
  },
  {
    id: "transparency",
    description: "Main images should present the product on a white background rather than transparent pixels.",
    sourceUrl: AMAZON_SELLER_GUIDANCE_URL,
    sourceCheckedDate: SOURCE_CHECKED_DATE,
    kind: "hard",
  },
  {
    id: "aspect-ratio",
    description: "Very wide or very tall files deserve a crop/framing review before upload.",
    sourceUrl: AMAZON_SELLER_GUIDANCE_URL,
    sourceCheckedDate: SOURCE_CHECKED_DATE,
    kind: "recommendation",
    minimumRatio: 0.5,
    maximumRatio: 2,
  },
  {
    id: "white-background",
    description: "Estimate whether the visible background is close to white.",
    sourceUrl: AMAZON_SELLER_GUIDANCE_URL,
    sourceCheckedDate: SOURCE_CHECKED_DATE,
    kind: "estimate",
  },
  {
    id: "subject-framing",
    description: "Estimate whether the product occupies a useful portion of the frame.",
    sourceUrl: AMAZON_SELLER_FORUM_URL,
    sourceCheckedDate: SOURCE_CHECKED_DATE,
    kind: "estimate",
  },
  {
    id: "edge-contamination",
    description: "Estimate whether the outer frame contains background contamination.",
    sourceUrl: AMAZON_SELLER_GUIDANCE_URL,
    sourceCheckedDate: SOURCE_CHECKED_DATE,
    kind: "estimate",
  },
  {
    id: "possible-border",
    description: "Estimate whether a visible border may be present.",
    sourceUrl: AMAZON_SELLER_GUIDANCE_URL,
    sourceCheckedDate: SOURCE_CHECKED_DATE,
    kind: "estimate",
  },
];

export const ruleById = (id) => amazonMainImageRules.find((rule) => rule.id === id);
