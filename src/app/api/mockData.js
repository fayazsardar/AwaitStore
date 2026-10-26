// Dummy catalogue used when the app runs without a backend (see mockBaseQuery.js).

const image = (label, color) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300"><rect width="300" height="300" rx="24" fill="${color}"/><text x="150" y="160" font-family="sans-serif" font-size="26" font-weight="bold" fill="#fff" text-anchor="middle">${label}</text></svg>`
  )}`;

export const categories = [
  { _id: "cat-protein", name: "Protein", thumbnail: image("Protein", "#26457f") },
  { _id: "cat-vitamins", name: "Vitamins", thumbnail: image("Vitamins", "#d97706") },
  { _id: "cat-preworkout", name: "Pre-Workout", thumbnail: image("Pre-Workout", "#b91c1c") },
  { _id: "cat-omega", name: "Omega & Fish Oil", thumbnail: image("Omega", "#0e7490") },
  { _id: "cat-gainers", name: "Mass Gainers", thumbnail: image("Gainers", "#4d7c0f") },
];

const product = (id, name, categoryId, color, description, variants) => ({
  _id: id,
  name,
  categoryId,
  description,
  howtoUse: "Mix one serving with 200–250 ml of water or milk.",
  countryInfo: "India",
  manufactureInfo: "AwaitStore Demo Labs",
  images: [image(name.split(" ")[0], color)],
  defaultVariantId: variants[0]._id,
  variants: variants.map((v) => ({
    ...v,
    images: [image(`${v.weight}${v.weightType}`, color)],
  })),
});

export const products = [
  product("p-whey", "Whey Protein Isolate", "cat-protein", "#26457f",
    "Fast-absorbing whey isolate with 27 g protein per serving.", [
      { _id: "v-whey-1kg-choc", flavor: "Chocolate", weight: 1, weightType: "kg", price: 2499, mrp: 3199, stock: 25 },
      { _id: "v-whey-2kg-choc", flavor: "Chocolate", weight: 2, weightType: "kg", price: 4599, mrp: 5999, stock: 12 },
      { _id: "v-whey-1kg-van", flavor: "Vanilla", weight: 1, weightType: "kg", price: 2499, mrp: 3199, stock: 18 },
    ]),
  product("p-plant", "Plant Protein Blend", "cat-protein", "#15803d",
    "Pea and brown rice protein, vegan and dairy free.", [
      { _id: "v-plant-1kg", flavor: "Coffee", weight: 1, weightType: "kg", price: 1899, mrp: 2299, stock: 30 },
    ]),
  product("p-multi", "Daily Multivitamin", "cat-vitamins", "#d97706",
    "25 essential vitamins and minerals in one tablet.", [
      { _id: "v-multi-60", flavor: null, weight: 60, weightType: "tabs", price: 499, mrp: 699, stock: 50 },
      { _id: "v-multi-120", flavor: null, weight: 120, weightType: "tabs", price: 899, mrp: 1299, stock: 40 },
    ]),
  product("p-vitd", "Vitamin D3 + K2", "cat-vitamins", "#ca8a04",
    "Supports bone health and immunity.", [
      { _id: "v-vitd-60", flavor: null, weight: 60, weightType: "caps", price: 399, mrp: 549, stock: 60 },
    ]),
  product("p-pre", "Ignite Pre-Workout", "cat-preworkout", "#b91c1c",
    "Caffeine, beta-alanine and citrulline for energy and pump.", [
      { _id: "v-pre-300-fp", flavor: "Fruit Punch", weight: 300, weightType: "g", price: 1499, mrp: 1999, stock: 20 },
      { _id: "v-pre-300-bl", flavor: "Blue Lemonade", weight: 300, weightType: "g", price: 1499, mrp: 1999, stock: 15 },
    ]),
  product("p-fish", "Omega-3 Fish Oil", "cat-omega", "#0e7490",
    "1000 mg fish oil with 300 mg EPA/DHA per softgel.", [
      { _id: "v-fish-90", flavor: null, weight: 90, weightType: "caps", price: 699, mrp: 999, stock: 45 },
    ]),
  product("p-gainer", "Super Mass Gainer", "cat-gainers", "#4d7c0f",
    "High-calorie gainer with complex carbs and 50 g protein.", [
      { _id: "v-gainer-3kg", flavor: "Chocolate", weight: 3, weightType: "kg", price: 2999, mrp: 3999, stock: 10 },
    ]),
];

// Shape returned by list endpoints (home, category) and read by ProductCard.
export const toListItem = (p) => {
  const v = p.variants[0];
  return {
    _id: p._id,
    name: p.name,
    category: categories.find((c) => c._id === p.categoryId),
    defaultPrice: v.price,
    defaultMrp: v.mrp,
    defaultThumbnail: p.images[0],
    flavor: v.flavor,
    weight: v.weight,
    weightType: v.weightType,
  };
};

export const findVariant = (variantId) => {
  for (const p of products) {
    const v = p.variants.find((x) => x._id === variantId);
    if (v) return { product: p, variant: v };
  }
  return null;
};
