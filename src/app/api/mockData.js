// Dummy catalogue used when the app runs without a backend (see mockBaseQuery.js).
// Loaded on demand, so it is not part of the first JavaScript download.

const FONT = "Arial, Helvetica, sans-serif";

const svg = (body) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">${body}</svg>`
  )}`;

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");

const label = (x, y, w, color, short, sub, nameSize) => `
  <rect x="${x}" y="${y}" width="${w}" height="118" rx="10" fill="#fff"/>
  <text x="200" y="${y + 26}" font-family="${FONT}" font-size="12" font-weight="700" letter-spacing="3" fill="${color}" text-anchor="middle">AWAITSTORE</text>
  <text x="200" y="${y + 64}" font-family="${FONT}" font-size="${nameSize}" font-weight="800" fill="#111827" text-anchor="middle">${esc(short)}</text>
  <text x="200" y="${y + 94}" font-family="${FONT}" font-size="13" fill="#4b5563" text-anchor="middle">${esc(sub)}</text>`;

// Product packs drawn as tubs (powders) or bottles (capsules/tablets)
const tub = ({ color, dark }, short, sub) =>
  svg(`
  <ellipse cx="200" cy="356" rx="112" ry="12" fill="#000" opacity=".08"/>
  <rect x="104" y="68" width="192" height="46" rx="10" fill="${dark}"/>
  <path d="M94 112h212l-10 232a12 12 0 0 1-12 11H116a12 12 0 0 1-12-11z" fill="${color}"/>
  <rect x="118" y="128" width="12" height="206" rx="6" fill="#fff" opacity=".18"/>
  ${label(116, 176, 168, color, short, sub, 30)}`);

const bottle = ({ color, dark }, short, sub) =>
  svg(`
  <ellipse cx="200" cy="360" rx="86" ry="10" fill="#000" opacity=".08"/>
  <rect x="158" y="52" width="84" height="42" rx="8" fill="${dark}"/>
  <rect x="170" y="92" width="60" height="18" fill="${dark}" opacity=".85"/>
  <rect x="118" y="108" width="164" height="248" rx="38" fill="${color}"/>
  <rect x="134" y="128" width="12" height="208" rx="6" fill="#fff" opacity=".18"/>
  ${label(130, 180, 140, color, short, sub, 24)}`);

const factsCard = ({ color }, title, rows) =>
  svg(`
  <rect x="60" y="40" width="280" height="320" rx="18" fill="#fff" stroke="#e5e7eb" stroke-width="2"/>
  <rect x="60" y="40" width="280" height="64" rx="18" fill="${color}"/>
  <rect x="60" y="86" width="280" height="18" fill="${color}"/>
  <text x="200" y="80" font-family="${FONT}" font-size="20" font-weight="800" fill="#fff" text-anchor="middle">${esc(title)}</text>
  ${rows
    .map(
      ([k, v], i) => `
  <text x="84" y="${146 + i * 44}" font-family="${FONT}" font-size="16" fill="#374151">${esc(k)}</text>
  <text x="316" y="${146 + i * 44}" font-family="${FONT}" font-size="16" font-weight="700" fill="#111827" text-anchor="end">${esc(v)}</text>
  <line x1="84" x2="316" y1="${160 + i * 44}" y2="${160 + i * 44}" stroke="#f3f4f6" stroke-width="2"/>`
    )
    .join("")}`);

const PALETTE = {
  navy: { color: "#26457f", dark: "#172a4d", tint: "#eef3fb" },
  green: { color: "#15803d", dark: "#0f5a2b", tint: "#ecfdf3" },
  slate: { color: "#475569", dark: "#1e293b", tint: "#f1f5f9" },
  amber: { color: "#d97706", dark: "#92400e", tint: "#fffbeb" },
  yellow: { color: "#ca8a04", dark: "#854d0e", tint: "#fefce8" },
  pink: { color: "#db2777", dark: "#9d174d", tint: "#fdf2f8" },
  red: { color: "#dc2626", dark: "#7f1d1d", tint: "#fef2f2" },
  charcoal: { color: "#374151", dark: "#111827", tint: "#f3f4f6" },
  teal: { color: "#0e7490", dark: "#164e63", tint: "#ecfeff" },
  emerald: { color: "#047857", dark: "#064e3b", tint: "#ecfdf5" },
  olive: { color: "#4d7c0f", dark: "#365314", tint: "#f7fee7" },
  violet: { color: "#7c3aed", dark: "#4c1d95", tint: "#f5f3ff" },
};

export const categories = [
  { _id: "cat-protein", name: "Protein", thumbnail: tub(PALETTE.navy, "WHEY", "Protein"), tint: PALETTE.navy.tint },
  { _id: "cat-vitamins", name: "Vitamins", thumbnail: bottle(PALETTE.amber, "MULTI", "Vitamins"), tint: PALETTE.amber.tint },
  { _id: "cat-preworkout", name: "Pre-Workout", thumbnail: tub(PALETTE.red, "IGNITE", "Energy"), tint: PALETTE.red.tint },
  { _id: "cat-omega", name: "Omega & Fish Oil", thumbnail: bottle(PALETTE.teal, "OMEGA-3", "Heart"), tint: PALETTE.teal.tint },
  { _id: "cat-gainers", name: "Mass Gainers", thumbnail: tub(PALETTE.olive, "MASS", "Gainer"), tint: PALETTE.olive.tint },
];

const product = ({ id, name, short, categoryId, pack, palette, rating, reviews, tag, description, facts, variants }) => {
  const draw = pack === "tub" ? tub : bottle;
  const fullVariants = variants.map((v) => ({
    ...v,
    images: [draw(palette, short, [`${v.weight} ${v.weightType}`, v.flavor].filter(Boolean).join(" · "))],
  }));
  return {
    _id: id,
    name,
    categoryId,
    description,
    howtoUse:
      pack === "tub"
        ? "Mix one scoop with 200–250 ml of water or milk. Best taken after training or between meals."
        : "Take one serving daily with a meal, or as advised by your healthcare professional.",
    countryInfo: "India",
    manufactureInfo: "AwaitStore Demo Labs",
    rating,
    reviews,
    tag,
    images: [fullVariants[0].images[0], factsCard(palette, "Per serving", facts)],
    defaultVariantId: fullVariants[0]._id,
    variants: fullVariants,
  };
};

export const products = [
  product({
    id: "p-whey", name: "Whey Protein Isolate", short: "WHEY ISO", categoryId: "cat-protein", pack: "tub", palette: PALETTE.navy,
    rating: 4.6, reviews: 2841, tag: "Bestseller",
    description: "Fast-absorbing whey isolate with 27 g protein per serving, low in fat and sugar, for lean muscle and quick recovery.",
    facts: [["Protein", "27 g"], ["BCAA", "6.1 g"], ["Carbs", "1.8 g"], ["Sugar", "0.5 g"], ["Calories", "116"]],
    variants: [
      { _id: "v-whey-1kg-choc", flavor: "Chocolate", weight: 1, weightType: "kg", price: 2499, mrp: 3199, stock: 25 },
      { _id: "v-whey-2kg-choc", flavor: "Chocolate", weight: 2, weightType: "kg", price: 4599, mrp: 5999, stock: 12 },
      { _id: "v-whey-1kg-van", flavor: "Vanilla", weight: 1, weightType: "kg", price: 2499, mrp: 3199, stock: 18 },
    ],
  }),
  product({
    id: "p-plant", name: "Plant Protein Blend", short: "PLANT", categoryId: "cat-protein", pack: "tub", palette: PALETTE.green,
    rating: 4.4, reviews: 612, tag: "Vegan",
    description: "Pea and brown rice protein with a complete amino acid profile. Vegan, dairy free and easy to digest.",
    facts: [["Protein", "24 g"], ["Fibre", "2 g"], ["Carbs", "3 g"], ["Sugar", "0 g"], ["Calories", "120"]],
    variants: [
      { _id: "v-plant-1kg", flavor: "Coffee", weight: 1, weightType: "kg", price: 1899, mrp: 2299, stock: 30 },
      { _id: "v-plant-1kg-choc", flavor: "Chocolate", weight: 1, weightType: "kg", price: 1899, mrp: 2299, stock: 22 },
    ],
  }),
  product({
    id: "p-rawwhey", name: "Raw Whey Concentrate", short: "RAW WHEY", categoryId: "cat-protein", pack: "tub", palette: PALETTE.slate,
    rating: 4.3, reviews: 1290, tag: null,
    description: "Unflavoured whey concentrate with no added sugar or fillers. Mix into shakes, oats or smoothies.",
    facts: [["Protein", "24 g"], ["BCAA", "5.2 g"], ["Carbs", "2.4 g"], ["Fat", "1.6 g"], ["Calories", "122"]],
    variants: [
      { _id: "v-raw-1kg", flavor: "Unflavoured", weight: 1, weightType: "kg", price: 1599, mrp: 1999, stock: 40 },
      { _id: "v-raw-2kg", flavor: "Unflavoured", weight: 2, weightType: "kg", price: 2999, mrp: 3799, stock: 20 },
    ],
  }),
  product({
    id: "p-multi", name: "Daily Multivitamin", short: "MULTI", categoryId: "cat-vitamins", pack: "bottle", palette: PALETTE.amber,
    rating: 4.5, reviews: 3320, tag: "Bestseller",
    description: "25 essential vitamins and minerals in one tablet to support energy, immunity and everyday health.",
    facts: [["Vitamin C", "80 mg"], ["Vitamin D", "10 µg"], ["Zinc", "10 mg"], ["B12", "2.5 µg"], ["Iron", "8 mg"]],
    variants: [
      { _id: "v-multi-60", flavor: null, weight: 60, weightType: "tabs", price: 499, mrp: 699, stock: 50 },
      { _id: "v-multi-120", flavor: null, weight: 120, weightType: "tabs", price: 899, mrp: 1299, stock: 40 },
    ],
  }),
  product({
    id: "p-vitd", name: "Vitamin D3 + K2", short: "D3 + K2", categoryId: "cat-vitamins", pack: "bottle", palette: PALETTE.yellow,
    rating: 4.7, reviews: 948, tag: null,
    description: "Vitamin D3 with K2 (MK-7) to support bone strength, calcium absorption and immunity.",
    facts: [["Vitamin D3", "2000 IU"], ["Vitamin K2", "100 µg"], ["Servings", "60"], ["Form", "Softgel"], ["Vegetarian", "No"]],
    variants: [{ _id: "v-vitd-60", flavor: null, weight: 60, weightType: "caps", price: 399, mrp: 549, stock: 60 }],
  }),
  product({
    id: "p-biotin", name: "Biotin Hair & Skin", short: "BIOTIN", categoryId: "cat-vitamins", pack: "bottle", palette: PALETTE.pink,
    rating: 4.2, reviews: 534, tag: "New",
    description: "High-strength biotin with zinc and vitamin E for healthy hair, skin and nails.",
    facts: [["Biotin", "10,000 µg"], ["Zinc", "5 mg"], ["Vitamin E", "10 mg"], ["Servings", "60"], ["Vegetarian", "Yes"]],
    variants: [{ _id: "v-biotin-60", flavor: null, weight: 60, weightType: "tabs", price: 349, mrp: 499, stock: 35 }],
  }),
  product({
    id: "p-pre", name: "Ignite Pre-Workout", short: "IGNITE", categoryId: "cat-preworkout", pack: "tub", palette: PALETTE.red,
    rating: 4.4, reviews: 1104, tag: "Bestseller",
    description: "Caffeine, beta-alanine and citrulline for energy, focus and a stronger pump in every session.",
    facts: [["Caffeine", "200 mg"], ["Citrulline", "6 g"], ["Beta-alanine", "3.2 g"], ["Sugar", "0 g"], ["Servings", "30"]],
    variants: [
      { _id: "v-pre-300-fp", flavor: "Fruit Punch", weight: 300, weightType: "g", price: 1499, mrp: 1999, stock: 20 },
      { _id: "v-pre-300-bl", flavor: "Blue Lemonade", weight: 300, weightType: "g", price: 1499, mrp: 1999, stock: 15 },
    ],
  }),
  product({
    id: "p-creatine", name: "Creatine Monohydrate", short: "CREATINE", categoryId: "cat-preworkout", pack: "tub", palette: PALETTE.charcoal,
    rating: 4.8, reviews: 4210, tag: "Top rated",
    description: "Micronised creatine monohydrate, 3 g per serving, for strength, power and faster recovery.",
    facts: [["Creatine", "3 g"], ["Servings", "83"], ["Flavour", "None"], ["Sugar", "0 g"], ["Calories", "0"]],
    variants: [
      { _id: "v-creatine-250", flavor: "Unflavoured", weight: 250, weightType: "g", price: 799, mrp: 1199, stock: 80 },
      { _id: "v-creatine-500", flavor: "Unflavoured", weight: 500, weightType: "g", price: 1399, mrp: 1999, stock: 45 },
    ],
  }),
  product({
    id: "p-fish", name: "Omega-3 Fish Oil", short: "OMEGA-3", categoryId: "cat-omega", pack: "bottle", palette: PALETTE.teal,
    rating: 4.5, reviews: 1876, tag: null,
    description: "1000 mg fish oil with 300 mg EPA/DHA per softgel for heart, brain and joint health.",
    facts: [["Fish oil", "1000 mg"], ["EPA", "180 mg"], ["DHA", "120 mg"], ["Servings", "90"], ["Form", "Softgel"]],
    variants: [
      { _id: "v-fish-90", flavor: null, weight: 90, weightType: "caps", price: 699, mrp: 999, stock: 45 },
      { _id: "v-fish-180", flavor: null, weight: 180, weightType: "caps", price: 1249, mrp: 1799, stock: 25 },
    ],
  }),
  product({
    id: "p-flax", name: "Flaxseed Omega (Vegan)", short: "FLAX", categoryId: "cat-omega", pack: "bottle", palette: PALETTE.emerald,
    rating: 4.1, reviews: 287, tag: "Vegan",
    description: "Cold-pressed flaxseed oil, a plant source of omega-3 ALA, in vegetarian capsules.",
    facts: [["Flaxseed oil", "1000 mg"], ["ALA", "500 mg"], ["Servings", "60"], ["Form", "Veg capsule"], ["Vegan", "Yes"]],
    variants: [{ _id: "v-flax-60", flavor: null, weight: 60, weightType: "caps", price: 449, mrp: 599, stock: 30 }],
  }),
  product({
    id: "p-gainer", name: "Super Mass Gainer", short: "MASS", categoryId: "cat-gainers", pack: "tub", palette: PALETTE.olive,
    rating: 4.3, reviews: 1532, tag: null,
    description: "High-calorie gainer with complex carbs and 50 g protein per serving to help you bulk up.",
    facts: [["Calories", "1250"], ["Protein", "50 g"], ["Carbs", "252 g"], ["Fat", "4 g"], ["Servings", "10"]],
    variants: [
      { _id: "v-gainer-3kg", flavor: "Chocolate", weight: 3, weightType: "kg", price: 2999, mrp: 3999, stock: 10 },
      { _id: "v-gainer-1kg", flavor: "Chocolate", weight: 1, weightType: "kg", price: 1199, mrp: 1499, stock: 28 },
    ],
  }),
  product({
    id: "p-lean", name: "Lean Gainer", short: "LEAN", categoryId: "cat-gainers", pack: "tub", palette: PALETTE.violet,
    rating: 4.2, reviews: 403, tag: "New",
    description: "Balanced gainer with a 2:1 carb to protein ratio for clean, steady weight gain.",
    facts: [["Calories", "640"], ["Protein", "32 g"], ["Carbs", "118 g"], ["Sugar", "6 g"], ["Servings", "20"]],
    variants: [{ _id: "v-lean-2kg", flavor: "Vanilla", weight: 2, weightType: "kg", price: 2199, mrp: 2799, stock: 18 }],
  }),
];

// Shape returned by list endpoints (home, category, search) and read by ProductCard.
export const toListItem = (p) => {
  const v = p.variants[0];
  return {
    _id: p._id,
    name: p.name,
    category: categories.find((c) => c._id === p.categoryId),
    defaultPrice: v.price,
    defaultMrp: v.mrp,
    defaultThumbnail: v.images[0],
    defaultVariant: v,
    flavor: v.flavor,
    weight: v.weight,
    weightType: v.weightType,
    rating: p.rating,
    reviews: p.reviews,
    tag: p.tag,
  };
};

export const findVariant = (variantId) => {
  for (const p of products) {
    const v = p.variants.find((x) => x._id === variantId);
    if (v) return { product: p, variant: v };
  }
  return null;
};
