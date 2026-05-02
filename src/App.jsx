import React, { useEffect, useMemo, useState } from "react";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const AISLES = [
  "Fruit & Veg",
  "Meat & Fish",
  "Chilled / Dairy",
  "Bakery",
  "Cupboard",
  "Sauces",
  "Herbs & Spices",
  "Drinks",
  "Frozen",
  "Household",
  "Dry Goods",
  "Snacks",
  "Other",
];

const AISLE_ICON = {
  "Fruit & Veg": "🥕",
  "Meat & Fish": "🥩",
  "Chilled / Dairy": "🥛",
  Bakery: "🥖",
  Cupboard: "🥫",
  Sauces: "🌍",
  "Herbs & Spices": "🧂",
  Drinks: "🧃",
  Frozen: "🧊",
  Household: "🧻",
  "Dry Goods": "🍝",
  Snacks: "🍪",
  Other: "🛒",
};

// Cloud sync setup: paste these from Supabase before publishing.
// Keep the anon key public; never put a service-role key in the app.
const SUPABASE_URL = "https://qtnyhklxhlragwdxykof.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_MpeRc4UGQygAIwafPDuG6g_S7nhGyBQ";
const SUPABASE_READY = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

let supabaseClientCache = null;
async function getSupabaseClient() {
  if (!SUPABASE_READY) return null;
  if (supabaseClientCache) return supabaseClientCache;
  const { createClient } = await import("@supabase/supabase-js");
  supabaseClientCache = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  return supabaseClientCache;
}

const SEED_MEALS = [
  {
    name: "Air Fryer Baked Feta Pasta",
    type: "Thursday",
    methods: [
      "Cook pasta until al dente, then drain and reserve a little pasta water.",
      "Add feta, cherry tomatoes and sun-dried tomatoes to an air fryer-safe dish.",
      "Air fry until tomatoes soften and feta is hot and creamy.",
      "Stir the feta and tomatoes into a sauce, loosening with pasta water if needed.",
      "Mix through pasta and serve with fresh basil."
    ],
    ingredients: [
      { name: "Feta cheese", qty: "1 block", aisle: "Chilled / Dairy" },
      { name: "Cherry tomatoes", qty: "1 pack", aisle: "Fruit & Veg" },
      { name: "Pasta", qty: "As needed", aisle: "Dry Goods" },
      { name: "Sun-dried tomatoes", qty: "70g", aisle: "Cupboard" },
      { name: "Fresh basil", qty: "To serve", aisle: "Fruit & Veg" },
    ],
  },
  {
    name: "Air Fryer Crispy Beijing Beef",
    type: "Tuesday",
    methods: [
      "Toss beef strips in cornflour until coated.",
      "Spray beef with oil and air fry at 200°C for 10–14 minutes until crispy.",
      "While beef cooks, soften onion and sugar snap peas in a pan.",
      "Mix sauce ingredients together.",
      "Add cooked beef to the pan with veg, pour in sauce, and toss until coated and thickened.",
      "Serve with noodles and chilli if wanted."
    ],
    ingredients: [
      { name: "Beef strips", qty: "500g", aisle: "Meat & Fish" },
      { name: "Onion", qty: "1", aisle: "Fruit & Veg" },
      { name: "Sugar snap peas", qty: "Handful", aisle: "Fruit & Veg" },
      { name: "Cornflour", qty: "2 tbsp", aisle: "Cupboard" },
      { name: "Noodles", qty: "600g", aisle: "Cupboard" },
      { name: "Hoisin sauce", qty: "3 tbsp", aisle: "Sauces" },
      { name: "Sesame oil", qty: "1 tbsp", aisle: "Sauces" },
      { name: "Garlic", qty: "4 cloves", aisle: "Fruit & Veg" },
      { name: "Rice vinegar", qty: "1 tbsp", aisle: "Sauces" },
    ],
  },
  {
    name: "Air Fryer Pesto & Pepperoni Chicken",
    type: "Saturday",
    methods: [
      "Preheat the air fryer.",
      "Spread pesto over the chicken breasts.",
      "Add pepperoni slices on top.",
      "Top with mozzarella.",
      "Air fry for about 17 minutes, or until the chicken is cooked through."
    ],
    ingredients: [
      { name: "Chicken breast", qty: "2", aisle: "Meat & Fish" },
      { name: "Green pesto", qty: "2 tbsp", aisle: "Sauces" },
      { name: "Pepperoni slices", qty: "8 slices", aisle: "Meat & Fish" },
      { name: "Mozzarella", qty: "100g", aisle: "Chilled / Dairy" },
    ],
  },
  {
    name: "Airfryer Chorizo & Mozzarella Cod",
    type: "Saturday",
    methods: [],
    ingredients: [
      { name: "Cod fillets", qty: "4", aisle: "Meat & Fish" },
      { name: "Cream cheese", qty: "4 tbsp", aisle: "Chilled / Dairy" },
      { name: "Chorizo", qty: "80g", aisle: "Meat & Fish" },
      { name: "Mozzarella", qty: "100g", aisle: "Chilled / Dairy" },
      { name: "Potatoes", qty: "800g", aisle: "Fruit & Veg" },
      { name: "Peas", qty: "200g", aisle: "Frozen" },
      { name: "Broccoli", qty: "1 head", aisle: "Fruit & Veg" },
    ],
  },
  {
    name: "Beef Meatballs in Onion Gravy",
    type: "Saturday",
    methods: [
      "Brown the meatballs in a pan for a few minutes.",
      "Transfer meatballs to the slow cooker.",
      "Fry onions in the same pan, then add to the slow cooker.",
      "Add remaining gravy ingredients and stir.",
      "Cook on high for 4 hours or low for 7–8 hours.",
      "Serve with mash and greens."
    ],
    ingredients: [
      { name: "Beef meatballs", qty: "500g", aisle: "Meat & Fish" },
      { name: "Onion", qty: "2", aisle: "Fruit & Veg" },
      { name: "Broccoli", qty: "", aisle: "Fruit & Veg" },
      { name: "Mash", qty: "", aisle: "Fruit & Veg" },
    ],
  },
  {
    name: "Beef, Lentil & Bean Chilli",
    type: "Thursday",
    methods: [],
    ingredients: [
      { name: "Beef mince", qty: "1kg", aisle: "Meat & Fish" },
      { name: "Green lentils", qty: "1 tin", aisle: "Cupboard" },
      { name: "Carrots", qty: "2", aisle: "Fruit & Veg" },
      { name: "Celery", qty: "2 sticks", aisle: "Fruit & Veg" },
      { name: "Onion", qty: "1", aisle: "Fruit & Veg" },
      { name: "Mushrooms", qty: "150g", aisle: "Fruit & Veg" },
      { name: "Mixed beans / kidney beans", qty: "1 tin", aisle: "Cupboard" },
      { name: "Chopped tomatoes", qty: "4 tins", aisle: "Cupboard" },
      { name: "Tomato puree", qty: "2 tbsp", aisle: "Sauces" },
      { name: "Soy sauce", qty: "1 tbsp", aisle: "Sauces" },
      { name: "Marmite", qty: "1 tbsp", aisle: "Cupboard" },
      { name: "Rice / Wraps", qty: "As needed", aisle: "Cupboard" },
    ],
  },
  {
    name: "Beef, Lentil & Veg Lasagne",
    type: "Thursday",
    methods: [],
    ingredients: [
      { name: "Beef mince", qty: "1 kg", aisle: "Meat & Fish" },
      { name: "Onions", qty: "2", aisle: "Fruit & Veg" },
      { name: "Carrots", qty: "2", aisle: "Fruit & Veg" },
      { name: "Celery sticks", qty: "2", aisle: "Fruit & Veg" },
      { name: "Mushrooms", qty: "150g", aisle: "Fruit & Veg" },
      { name: "Garlic cloves", qty: "4", aisle: "Fruit & Veg" },
      { name: "Green lentils", qty: "1 tin", aisle: "Cupboard" },
      { name: "Chopped tomatoes", qty: "4 tins", aisle: "Cupboard" },
      { name: "Passata", qty: "500g", aisle: "Cupboard" },
      { name: "Tomato puree", qty: "2 tbsp", aisle: "Sauces" },
      { name: "Worcestershire sauce", qty: "1 tbsp", aisle: "Sauces" },
      { name: "Lasagne sheets", qty: "As needed", aisle: "Cupboard" },
      { name: "White sauce", qty: "2 jars", aisle: "Sauces" },
      { name: "Cheese", qty: "200g", aisle: "Chilled / Dairy" },
    ],
  },
  {
    name: "Burgers",
    type: "Friday",
    methods: [],
    ingredients: [
      { name: "Bean/Beef Burgers", qty: "", aisle: "Frozen" },
      { name: "Bread rolls", qty: "1 pack", aisle: "Bakery" },
      { name: "Chips", qty: "", aisle: "Frozen" },
      { name: "Baked beans/Peas", qty: "", aisle: "Cupboard" },
    ],
  },
  {
    name: "Cheese toastie & beans",
    type: "Tuesday",
    methods: [],
    ingredients: [
      { name: "Cheese", qty: "", aisle: "Chilled / Dairy" },
      { name: "Beans", qty: "", aisle: "Cupboard" },
      { name: "Bread", qty: "", aisle: "Bakery" },
    ],
  },
  {
    name: "Gnocchi with Sausages",
    type: "Wednesday",
    methods: [],
    ingredients: [
      { name: "Sausages", qty: "12", aisle: "Meat & Fish" },
      { name: "Red onion", qty: "2", aisle: "Fruit & Veg" },
      { name: "Cherry tomatoes", qty: "500g", aisle: "Fruit & Veg" },
      { name: "Garlic cloves", qty: "4", aisle: "Fruit & Veg" },
      { name: "Gnocchi", qty: "500g", aisle: "Chilled / Dairy" },
      { name: "Green pesto", qty: "2 tbsp", aisle: "Sauces" },
    ],
  },
  {
    name: "Chicken Fajita Rice",
    type: "Monday",
    methods: [
      "Heat olive oil in a large frying pan over medium-high heat.",
      "Add chicken and fry until starting to brown.",
      "Add mushrooms, pepper, onion and seasoning. Cook for 5–10 minutes until soft and chicken is cooked.",
      "Add beans, rice and stock. Stir until rice is coated and heated through.",
      "Sprinkle cheese on top, cover and cook on low until melted."
    ],
    ingredients: [
      { name: "Chicken breast", qty: "2", aisle: "Meat & Fish" },
      { name: "Onion", qty: "1", aisle: "Fruit & Veg" },
      { name: "Peppers", qty: "2", aisle: "Fruit & Veg" },
      { name: "Fajita seasoning", qty: "1 sachet", aisle: "Sauces" },
      { name: "Rice", qty: "250g", aisle: "Cupboard" },
      { name: "Sweetcorn", qty: "1 tin", aisle: "Cupboard" },
      { name: "Cheese", qty: "100g", aisle: "Chilled / Dairy" },
    ],
  },
  {
    name: "Chicken flat breads",
    type: "Monday",
    methods: [],
    ingredients: [
      { name: "Chicken thighs / breasts", qty: "500g", aisle: "Meat & Fish" },
      { name: "Flatbreads", qty: "4", aisle: "Bakery" },
      { name: "Lettuce", qty: "1", aisle: "Fruit & Veg" },
      { name: "Tomatoes", qty: "4", aisle: "Fruit & Veg" },
      { name: "Yoghurt / Tzatziki", qty: "1 pot", aisle: "Chilled / Dairy" },
    ],
  },
  {
    name: "Chicken Katsu Curry",
    type: "Monday",
    methods: [],
    ingredients: [
      { name: "Chicken breasts", qty: "4", aisle: "Meat & Fish" },
      { name: "Breadcrumbs", qty: "100g", aisle: "Cupboard" },
      { name: "Egg", qty: "1", aisle: "Chilled / Dairy" },
      { name: "Flour", qty: "50g", aisle: "Cupboard" },
      { name: "Katsu curry sauce", qty: "1 jar", aisle: "Sauces" },
      { name: "Rice", qty: "250g", aisle: "Cupboard" },
      { name: "Peas", qty: "200g", aisle: "Frozen" },
      { name: "Carrots", qty: "2", aisle: "Fruit & Veg" },
    ],
  },
  {
    name: "Chicken Korma",
    type: "Monday",
    methods: [
      "Crush garlic, grate ginger, chop sweet potatoes and chicken.",
      "Dissolve stock cube in 400ml hot water.",
      "Heat oil in a large pan, add onions, garlic and ginger, and cook for 5 minutes.",
      "Stir in turmeric and curry powder, then cook for 1 minute.",
      "Add chicken, sweet potato and frozen veg. Stir to coat, then add stock.",
      "Bring to the boil, cover and simmer for 15 minutes.",
      "Remove lid and cook for 5–10 minutes until chicken is cooked through.",
      "Stir in yoghurt and mango chutney, then serve with rice and naan."
    ],
    ingredients: [
      { name: "Chicken breasts", qty: "4", aisle: "Meat & Fish" },
      { name: "Korma sauce", qty: "1 jar", aisle: "Sauces" },
      { name: "Rice", qty: "250g", aisle: "Cupboard" },
      { name: "Naan bread", qty: "1 pack", aisle: "Bakery" },
      { name: "Mango chutney", qty: "1 jar", aisle: "Sauces" },
    ],
  },
  {
    name: "Chicken Roast dinner",
    type: "Saturday",
    methods: [],
    ingredients: [
      { name: "Whole chicken", qty: "1", aisle: "Meat & Fish" },
      { name: "Potatoes", qty: "1kg", aisle: "Fruit & Veg" },
      { name: "Carrots", qty: "500g", aisle: "Fruit & Veg" },
      { name: "Broccoli", qty: "1 head", aisle: "Fruit & Veg" },
      { name: "Gravy", qty: "1 tub", aisle: "Cupboard" },
    ],
  },
  {
    name: "Chicken Tikka Masala",
    type: "Monday",
    methods: [],
    ingredients: [
      { name: "Chicken breasts", qty: "4", aisle: "Meat & Fish" },
      { name: "Tikka masala sauce", qty: "1 jar", aisle: "Sauces" },
      { name: "Rice", qty: "250g", aisle: "Cupboard" },
      { name: "Naan bread", qty: "1 pack", aisle: "Bakery" },
      { name: "Mango chutney", qty: "1 jar", aisle: "Sauces" },
      { name: "Onion bhaji", qty: "1 pack", aisle: "Chilled / Dairy" },
      { name: "Coriander", qty: "1 bunch", aisle: "Fruit & Veg" },
      { name: "Yoghurt", qty: "1 pot", aisle: "Chilled / Dairy" },
      { name: "Poppadoms", qty: "1 pack", aisle: "Cupboard" },
    ],
  },
  {
    name: "Chicken, Chorizo & Prawn Paella",
    type: "Monday",
    methods: [
      "Stir saffron into stock and set aside.",
      "Heat oil in a large pan and fry chorizo for about 3 minutes until crisp. Remove and set aside.",
      "Fry chicken for 7–8 minutes until golden, then remove and set aside.",
      "Fry onion and garlic for 4–5 minutes until softened.",
      "Add pepper and paprika and fry for 1–2 minutes.",
      "Stir in rice, then add saffron stock and boiling water.",
      "Return chicken, add tomatoes, cover and cook for 10 minutes, stirring once or twice.",
      "Add peas, prawns and chorizo. Cover and cook 5–10 minutes until rice is cooked and liquid absorbed.",
      "Rest for 5 minutes, then serve with parsley and lemon."
    ],
    ingredients: [
      { name: "Chicken thighs", qty: "4", aisle: "Meat & Fish" },
      { name: "Chorizo", qty: "150g", aisle: "Meat & Fish" },
      { name: "Prawns", qty: "200g", aisle: "Meat & Fish" },
      { name: "Paella rice", qty: "300g", aisle: "Cupboard" },
      { name: "Peppers", qty: "2", aisle: "Fruit & Veg" },
      { name: "Onion", qty: "1", aisle: "Fruit & Veg" },
      { name: "Garlic", qty: "3 cloves", aisle: "Fruit & Veg" },
      { name: "Chicken stock", qty: "1 litre", aisle: "Cupboard" },
      { name: "Peas", qty: "200g", aisle: "Frozen" },
      { name: "Smoked paprika", qty: "1 tsp", aisle: "Herbs & Spices" },
      { name: "Lemon", qty: "1", aisle: "Fruit & Veg" },
    ],
  },
  {
    name: "Chipolata Gnocchi Traybake",
    type: "Wednesday",
    methods: [
      "Preheat oven or air fryer to 180°C.",
      "Put gnocchi, tomatoes, onions, chipolatas, pesto and oil into a large bowl and mix well.",
      "Tip everything into a baking tray or air fryer-safe dish.",
      "Cook in oven for 25–30 minutes, or air fryer for about 20 minutes.",
      "Mix halfway through and cook until chipolatas are cooked through."
    ],
    ingredients: [
      { name: "Pork chipolatas", qty: "12", aisle: "Meat & Fish" },
      { name: "Gnocchi", qty: "500g", aisle: "Chilled / Dairy" },
      { name: "Cherry tomatoes", qty: "500g", aisle: "Fruit & Veg" },
      { name: "Red onion", qty: "2", aisle: "Fruit & Veg" },
      { name: "Pesto", qty: "2 tbsp", aisle: "Sauces" },
      { name: "Mozzarella", qty: "100g", aisle: "Chilled / Dairy" },
    ],
  },
  {
    name: "Chorizo & Halloumi Tacos",
    type: "Tuesday",
    methods: [],
    ingredients: [
      { name: "Chorizo", qty: "150g", aisle: "Meat & Fish" },
      { name: "Halloumi", qty: "1 block", aisle: "Chilled / Dairy" },
      { name: "Taco shells / wraps", qty: "1 pack", aisle: "Bakery" },
      { name: "Lettuce", qty: "1", aisle: "Fruit & Veg" },
      { name: "Tomatoes", qty: "4", aisle: "Fruit & Veg" },
      { name: "Sour cream", qty: "1 tub", aisle: "Chilled / Dairy" },
      { name: "Salsa", qty: "1 jar", aisle: "Sauces" },
    ],
  },
  {
    name: "Creamy Chicken Alfredo",
    type: "Thursday",
    methods: [],
    ingredients: [
      { name: "Chicken breast", qty: "2", aisle: "Meat & Fish" },
      { name: "Pasta", qty: "300g", aisle: "Dry Goods" },
      { name: "Cream", qty: "200ml", aisle: "Chilled / Dairy" },
      { name: "Parmesan", qty: "50g", aisle: "Chilled / Dairy" },
      { name: "Garlic", qty: "3 cloves", aisle: "Fruit & Veg" },
      { name: "Broccoli", qty: "1 head", aisle: "Fruit & Veg" },
      { name: "Mushrooms", qty: "150g", aisle: "Fruit & Veg" },
    ],
  },
  {
    name: "Creamy Mustard Sausage & Leek Casserole",
    type: "Wednesday",
    methods: [
      "Brown sausages in a pan if you want extra colour.",
      "Add sausages, sliced leeks and sauce ingredients to the slow cooker or casserole dish.",
      "Cook until sausages are cooked through and leeks are soft.",
      "Stir through crème fraîche near the end.",
      "Serve with rice, mash or potatoes."
    ],
    ingredients: [
      { name: "Pork sausages", qty: "12", aisle: "Meat & Fish" },
      { name: "Leeks", qty: "3", aisle: "Fruit & Veg" },
      { name: "Crème fraîche", qty: "2 tbsp", aisle: "Chilled / Dairy" },
      { name: "Rice", qty: "", aisle: "Cupboard" },
    ],
  },
  {
    name: "Creamy Pesto Halloumi Pasta",
    type: "Thursday",
    methods: [
      "Cook pasta until al dente, reserving a little pasta water.",
      "Fry halloumi until golden, then set aside.",
      "Cook garlic, tomatoes and spinach until softened.",
      "Stir in cream cheese, pesto and a splash of pasta water to make a sauce.",
      "Toss pasta through the sauce and top with halloumi and parmesan."
    ],
    ingredients: [
      { name: "Pasta", qty: "300g", aisle: "Dry Goods" },
      { name: "Halloumi", qty: "1 block", aisle: "Chilled / Dairy" },
      { name: "Cream cheese", qty: "150g", aisle: "Chilled / Dairy" },
      { name: "Green pesto", qty: "3 tbsp", aisle: "Sauces" },
      { name: "Cherry tomatoes", qty: "250g", aisle: "Fruit & Veg" },
      { name: "Spinach", qty: "100g", aisle: "Fruit & Veg" },
      { name: "Garlic", qty: "2 cloves", aisle: "Fruit & Veg" },
      { name: "Parmesan", qty: "50g", aisle: "Chilled / Dairy" },
    ],
  },
  {
    name: "Egg Rolls",
    type: "Tuesday",
    methods: [],
    ingredients: [
      { name: "Eggs", qty: "4", aisle: "Chilled / Dairy" },
      { name: "Wraps", qty: "1 pack", aisle: "Bakery" },
      { name: "Cheese", qty: "100g", aisle: "Chilled / Dairy" },
      { name: "Ham", qty: "1 pack", aisle: "Meat & Fish" },
      { name: "Spinach", qty: "100g", aisle: "Fruit & Veg" },
    ],
  },
  {
    name: "Enchiladas",
    type: "Monday",
    methods: [],
    ingredients: [
      { name: "Chicken breast", qty: "2", aisle: "Meat & Fish" },
      { name: "Wraps", qty: "1 pack", aisle: "Bakery" },
      { name: "Enchilada sauce", qty: "1 jar", aisle: "Sauces" },
      { name: "Cheese", qty: "200g", aisle: "Chilled / Dairy" },
      { name: "Peppers", qty: "2", aisle: "Fruit & Veg" },
      { name: "Onion", qty: "1", aisle: "Fruit & Veg" },
      { name: "Sweetcorn", qty: "1 tin", aisle: "Cupboard" },
      { name: "Sour cream", qty: "1 tub", aisle: "Chilled / Dairy" },
      { name: "Rice", qty: "250g", aisle: "Cupboard" },
    ],
  },
  {
    name: "Halloumi Fajita Traybake",
    type: "Tuesday",
    methods: [
      "Preheat oven to 180°C.",
      "Slice halloumi, peppers and onions into strips and place in a large baking tray.",
      "Add fajita seasoning and olive oil, then mix well to coat.",
      "Roast for 25–30 minutes, turning halfway, until veg softens and halloumi is golden.",
      "Warm tortilla wraps.",
      "Serve traybake in wraps with guacamole if wanted."
    ],
    ingredients: [
      { name: "Halloumi", qty: "2 blocks", aisle: "Chilled / Dairy" },
      { name: "Peppers", qty: "3", aisle: "Fruit & Veg" },
      { name: "Red onion", qty: "2", aisle: "Fruit & Veg" },
      { name: "Courgette", qty: "1", aisle: "Fruit & Veg" },
      { name: "Fajita seasoning", qty: "1 sachet", aisle: "Sauces" },
      { name: "Wraps", qty: "1 pack", aisle: "Bakery" },
      { name: "Sour cream", qty: "1 tub", aisle: "Chilled / Dairy" },
      { name: "Salsa", qty: "1 jar", aisle: "Sauces" },
      { name: "Avocado", qty: "1", aisle: "Fruit & Veg" },
      { name: "Lime", qty: "1", aisle: "Fruit & Veg" },
    ],
  },
  {
    name: "Falafel Sandwich",
    type: "Tuesday",
    methods: [],
    ingredients: [
      { name: "Falafel", qty: "1 pack", aisle: "Chilled / Dairy" },
      { name: "Pitta bread", qty: "1 pack", aisle: "Bakery" },
      { name: "Hummus", qty: "1 tub", aisle: "Chilled / Dairy" },
      { name: "Lettuce", qty: "1", aisle: "Fruit & Veg" },
      { name: "Tomatoes", qty: "4", aisle: "Fruit & Veg" },
    ],
  },
  {
    name: "Fish fingers",
    type: "Friday",
    methods: [],
    ingredients: [
      { name: "Fish fingers", qty: "1 pack", aisle: "Frozen" },
      { name: "Chips", qty: "1 bag", aisle: "Frozen" },
      { name: "Peas", qty: "1 bag", aisle: "Frozen" },
      { name: "Bread", qty: "1 loaf", aisle: "Bakery" },
    ],
  },
  {
    name: "Fishcake",
    type: "Friday",
    methods: [],
    ingredients: [
      { name: "Fishcakes", qty: "1 pack", aisle: "Chilled / Dairy" },
      { name: "Chips", qty: "1 bag", aisle: "Frozen" },
      { name: "Salad", qty: "1 bag", aisle: "Fruit & Veg" },
    ],
  },
  {
    name: "Garlic & Chilli Prawn Linguine",
    type: "Tuesday",
    methods: [
      "Cook linguine until al dente, reserving a little pasta water.",
      "Heat olive oil in a pan and gently cook garlic and chilli.",
      "Add cherry tomatoes and cook until softened.",
      "Add prawns and cook until piping hot.",
      "Toss through linguine, adding pasta water if needed.",
      "Finish with lemon, parsley and parmesan."
    ],
    ingredients: [
      { name: "Prawns", qty: "300g", aisle: "Meat & Fish" },
      { name: "Linguine", qty: "300g", aisle: "Dry Goods" },
      { name: "Garlic", qty: "4 cloves", aisle: "Fruit & Veg" },
      { name: "Red chilli", qty: "1", aisle: "Fruit & Veg" },
      { name: "Cherry tomatoes", qty: "250g", aisle: "Fruit & Veg" },
      { name: "Parsley", qty: "1 bunch", aisle: "Fruit & Veg" },
      { name: "Lemon", qty: "1", aisle: "Fruit & Veg" },
      { name: "Olive oil", qty: "2 tbsp", aisle: "Sauces" },
      { name: "Parmesan", qty: "50g", aisle: "Chilled / Dairy" },
    ],
  },
  {
    name: "Hidden Veg Sauce",
    type: "Thursday",
    methods: [
      "Roughly chop all vegetables.",
      "Add veg, chopped tomatoes, tomato purée, herbs, stock cube and olive oil to the slow cooker.",
      "Stir everything together.",
      "Cook on low for 6–8 hours or high for 3–4 hours until soft.",
      "Blend until smooth with a stick blender.",
      "Adjust seasoning and add balsamic vinegar if wanted.",
      "Cool and portion for pasta sauce."
    ],
    ingredients: [
      { name: "Carrots", qty: "3", aisle: "Fruit & Veg" },
      { name: "Courgette", qty: "1", aisle: "Fruit & Veg" },
      { name: "Onion", qty: "1", aisle: "Fruit & Veg" },
      { name: "Peppers", qty: "2", aisle: "Fruit & Veg" },
      { name: "Mushrooms", qty: "150g", aisle: "Fruit & Veg" },
      { name: "Garlic", qty: "4 cloves", aisle: "Fruit & Veg" },
      { name: "Chopped tomatoes", qty: "2 tins", aisle: "Cupboard" },
      { name: "Passata", qty: "500g", aisle: "Cupboard" },
      { name: "Tomato puree", qty: "2 tbsp", aisle: "Sauces" },
      { name: "Pasta", qty: "300g", aisle: "Dry Goods" },
      { name: "Cheese", qty: "100g", aisle: "Chilled / Dairy" },
    ],
  },
  {
    name: "Jacket potato",
    type: "Tuesday",
    methods: [],
    ingredients: [
      { name: "Jacket potatoes", qty: "4", aisle: "Fruit & Veg" },
      { name: "Toppings", qty: "As needed", aisle: "Other" },
    ],
  },
  {
    name: "Mushroom Soup Carbonara",
    type: "Thursday",
    methods: [
      "Cook pasta in salted water until al dente, then drain and reserve pasta water.",
      "Heat oil or butter in a pan and add garlic if using.",
      "Stir in mushroom soup and milk or water to make a smooth sauce.",
      "Simmer for 2–3 minutes.",
      "Stir in cheese and black pepper.",
      "Add pasta to the sauce and toss well, loosening with pasta water if needed.",
      "Serve with extra cheese or crispy onions."
    ],
    ingredients: [
      { name: "Pasta", qty: "300g", aisle: "Dry Goods" },
      { name: "Mushroom soup", qty: "1 tin", aisle: "Cupboard" },
      { name: "Bacon", qty: "200g", aisle: "Meat & Fish" },
      { name: "Mushrooms", qty: "250g", aisle: "Fruit & Veg" },
      { name: "Parmesan", qty: "50g", aisle: "Chilled / Dairy" },
    ],
  },
  {
    name: "Chicken Nuggets",
    type: "Friday",
    methods: [],
    ingredients: [
      { name: "Chicken nuggets", qty: "1 bag", aisle: "Frozen" },
      { name: "Chips", qty: "1 bag", aisle: "Frozen" },
    ],
  },
  {
    name: "Pizza",
    type: "Friday",
    methods: [],
    ingredients: [
      { name: "Pizza", qty: "2", aisle: "Chilled / Dairy" },
      { name: "Garlic bread", qty: "1", aisle: "Bakery" },
    ],
  },
  {
    name: "Pulled Chicken Burrito Bowl",
    type: "Monday",
    methods: [],
    ingredients: [
      { name: "Chicken breasts", qty: "4", aisle: "Meat & Fish" },
      { name: "Rice", qty: "250g", aisle: "Cupboard" },
      { name: "Black beans", qty: "1 tin", aisle: "Cupboard" },
      { name: "Sweetcorn", qty: "1 tin", aisle: "Cupboard" },
      { name: "Salsa", qty: "1 jar", aisle: "Sauces" },
      { name: "Cheese", qty: "100g", aisle: "Chilled / Dairy" },
    ],
  },
  {
    name: "Sausage egg chips beans",
    type: "Wednesday",
    methods: [],
    ingredients: [
      { name: "Sausages", qty: "8", aisle: "Meat & Fish" },
      { name: "Eggs", qty: "4", aisle: "Chilled / Dairy" },
      { name: "Chips", qty: "1 bag", aisle: "Frozen" },
      { name: "Beans", qty: "1 tin", aisle: "Cupboard" },
    ],
  },
  {
    name: "Sausage Risotto",
    type: "Wednesday",
    methods: [
      "Brown sausages, then slice or break into pieces.",
      "Soften onion and garlic in a pan.",
      "Stir in risotto rice and cook briefly.",
      "Add stock gradually, stirring until rice is tender.",
      "Add peas near the end.",
      "Stir through parmesan and serve."
    ],
    ingredients: [
      { name: "Sausages", qty: "8", aisle: "Meat & Fish" },
      { name: "Risotto rice", qty: "300g", aisle: "Cupboard" },
      { name: "Onion", qty: "1", aisle: "Fruit & Veg" },
      { name: "Garlic", qty: "3 cloves", aisle: "Fruit & Veg" },
      { name: "Chicken stock", qty: "1 litre", aisle: "Cupboard" },
      { name: "Parmesan", qty: "50g", aisle: "Chilled / Dairy" },
      { name: "Peas", qty: "200g", aisle: "Frozen" },
    ],
  },
  {
    name: "Slow Cooked Beef Brisket",
    type: "Saturday",
    methods: [
      "Add brisket, stock, garlic, Worcestershire sauce, gravy granules and herbs to the slow cooker.",
      "Cook for 6–8 hours until tender.",
      "Shred beef with forks.",
      "Serve with buns, chips or sides."
    ],
    ingredients: [
      { name: "Beef brisket", qty: "1kg", aisle: "Meat & Fish" },
      { name: "BBQ sauce", qty: "1 bottle", aisle: "Sauces" },
      { name: "Burger buns", qty: "1 pack", aisle: "Bakery" },
      { name: "Coleslaw", qty: "1 tub", aisle: "Chilled / Dairy" },
      { name: "Chips", qty: "1 bag", aisle: "Frozen" },
    ],
  },
  {
    name: "Slow Cooker Chicken Pot Pie",
    type: "Saturday",
    methods: [],
    ingredients: [
      { name: "Chicken thighs", qty: "800g", aisle: "Meat & Fish" },
      { name: "Leeks", qty: "2", aisle: "Fruit & Veg" },
      { name: "Carrots", qty: "3", aisle: "Fruit & Veg" },
      { name: "Peas", qty: "200g", aisle: "Frozen" },
      { name: "Cream", qty: "200ml", aisle: "Chilled / Dairy" },
      { name: "Chicken stock", qty: "500ml", aisle: "Cupboard" },
      { name: "Puff pastry", qty: "1 roll", aisle: "Chilled / Dairy" },
      { name: "Potatoes", qty: "1kg", aisle: "Fruit & Veg" },
      { name: "Gravy", qty: "1 tub", aisle: "Cupboard" },
      { name: "Mixed herbs", qty: "1 tsp", aisle: "Herbs & Spices" },
    ],
  },
  {
    name: "Slow Cooker Sausage & Bean Casserole",
    type: "Wednesday",
    methods: [
      "Pan-fry sausages until browned.",
      "Transfer sausages to the slow cooker with the other ingredients.",
      "Cook on high for 3–4 hours or low for 7–8 hours.",
      "Serve with creamy mash and parsley."
    ],
    ingredients: [
      { name: "Sausages", qty: "8", aisle: "Meat & Fish" },
      { name: "Baked beans", qty: "2 tins", aisle: "Cupboard" },
      { name: "Chopped tomatoes", qty: "1 tin", aisle: "Cupboard" },
      { name: "Onion", qty: "1", aisle: "Fruit & Veg" },
      { name: "Carrots", qty: "2", aisle: "Fruit & Veg" },
      { name: "Potatoes", qty: "800g", aisle: "Fruit & Veg" },
    ],
  },
  {
    name: "Soup",
    type: "Tuesday",
    methods: [],
    ingredients: [
      { name: "Soup", qty: "1 tin / carton", aisle: "Cupboard" },
      { name: "Bread", qty: "1 loaf", aisle: "Bakery" },
    ],
  },
  {
    name: "Sticky pork",
    type: "Tuesday",
    methods: [
      "Sear onion in oil for 2–3 minutes.",
      "Add pork mince and cook until lightly browned.",
      "Stir in hoisin, sweet chilli, soy, ginger, garlic, chilli and spring onions.",
      "Cook covered on low for 2–3 hours until sticky, or simmer on the hob for 10–15 minutes.",
      "Toss cucumber salad ingredients together.",
      "Serve rice topped with sticky pork and cucumber salad."
    ],
    ingredients: [
      { name: "Pork mince", qty: "500g", aisle: "Meat & Fish" },
      { name: "Noodles", qty: "300g", aisle: "Cupboard" },
      { name: "Soy sauce", qty: "3 tbsp", aisle: "Sauces" },
      { name: "Honey", qty: "2 tbsp", aisle: "Sauces" },
      { name: "Garlic", qty: "3 cloves", aisle: "Fruit & Veg" },
      { name: "Ginger", qty: "1 thumb", aisle: "Fruit & Veg" },
      { name: "Spring onions", qty: "1 bunch", aisle: "Fruit & Veg" },
      { name: "Broccoli", qty: "1 head", aisle: "Fruit & Veg" },
      { name: "Sesame oil", qty: "1 tbsp", aisle: "Sauces" },
      { name: "Chilli flakes", qty: "1 tsp", aisle: "Herbs & Spices" },
    ],
  },
  {
    name: "Stir fry",
    type: "Tuesday",
    methods: [],
    ingredients: [
      { name: "Stir fry veg", qty: "1 pack", aisle: "Fruit & Veg" },
      { name: "Noodles", qty: "300g", aisle: "Cupboard" },
      { name: "Stir fry sauce", qty: "1 sachet", aisle: "Sauces" },
      { name: "Chicken / prawns", qty: "500g", aisle: "Meat & Fish" },
    ],
  },
  {
    name: "Thai Red Chicken Curry Noodles",
    type: "Tuesday",
    methods: [
      "Add all ingredients except veg, noodles and garnish to the slow cooker.",
      "Cook on high for 3–4 hours or low for 6–7 hours.",
      "Add sugar snap peas for the final 20 minutes.",
      "Mix cornflour with water and stir in if you want a thicker sauce.",
      "Serve with noodles and garnish with coriander, chilli and lime."
    ],
    ingredients: [
      { name: "Chicken breast", qty: "2", aisle: "Meat & Fish" },
      { name: "Thai red curry paste", qty: "2 tbsp", aisle: "Sauces" },
      { name: "Coconut milk", qty: "1 tin", aisle: "Cupboard" },
      { name: "Noodles", qty: "300g", aisle: "Cupboard" },
      { name: "Peppers", qty: "2", aisle: "Fruit & Veg" },
      { name: "Sugar snap peas", qty: "1 pack", aisle: "Fruit & Veg" },
      { name: "Lime", qty: "1", aisle: "Fruit & Veg" },
      { name: "Coriander", qty: "1 bunch", aisle: "Fruit & Veg" },
    ],
  },
  {
    name: "Three Bean Tacos",
    type: "Thursday",
    methods: [
      "Warm mixed beans with taco seasoning and chopped tomatoes.",
      "Simmer until thickened.",
      "Warm taco shells or wraps.",
      "Fill with bean mixture, cheese, lettuce, tomatoes, sour cream and salsa.",
      "Serve straight away."
    ],
    ingredients: [
      { name: "Mixed beans", qty: "2 tins", aisle: "Cupboard" },
      { name: "Taco shells / wraps", qty: "1 pack", aisle: "Bakery" },
      { name: "Taco seasoning", qty: "1 sachet", aisle: "Sauces" },
      { name: "Chopped tomatoes", qty: "1 tin", aisle: "Cupboard" },
      { name: "Cheese", qty: "100g", aisle: "Chilled / Dairy" },
      { name: "Lettuce", qty: "1", aisle: "Fruit & Veg" },
      { name: "Tomatoes", qty: "4", aisle: "Fruit & Veg" },
      { name: "Sour cream", qty: "1 tub", aisle: "Chilled / Dairy" },
      { name: "Salsa", qty: "1 jar", aisle: "Sauces" },
    ],
  },
  {
    name: "Chicken strip wraps",
    type: "Friday",
    methods: [],
    ingredients: [
      { name: "Chicken strips", qty: "1 pack", aisle: "Frozen" },
      { name: "Wraps", qty: "1 pack", aisle: "Bakery" },
      { name: "Lettuce", qty: "1", aisle: "Fruit & Veg" },
      { name: "Tomatoes", qty: "4", aisle: "Fruit & Veg" },
      { name: "Mayo", qty: "1 bottle", aisle: "Sauces" },
    ],
  },
  {
    name: "Coconut Red Curry Cod",
    type: "Saturday",
    methods: [
      "Cook garlic and ginger briefly in a pan.",
      "Add Thai red curry paste and cook for 1 minute.",
      "Stir in coconut milk, soy sauce and fish sauce.",
      "Add peppers and sugar snap peas and simmer until nearly tender.",
      "Add cod and gently simmer until cooked through.",
      "Serve with rice, lime and coriander."
    ],
    ingredients: [
      { name: "Cod fillets", qty: "4", aisle: "Meat & Fish" },
      { name: "Thai red curry paste", qty: "2 tbsp", aisle: "Sauces" },
      { name: "Coconut milk", qty: "1 tin", aisle: "Cupboard" },
      { name: "Rice", qty: "250g", aisle: "Cupboard" },
      { name: "Peppers", qty: "2", aisle: "Fruit & Veg" },
      { name: "Sugar snap peas", qty: "1 pack", aisle: "Fruit & Veg" },
      { name: "Lime", qty: "1", aisle: "Fruit & Veg" },
      { name: "Coriander", qty: "1 bunch", aisle: "Fruit & Veg" },
      { name: "Garlic", qty: "3 cloves", aisle: "Fruit & Veg" },
      { name: "Ginger", qty: "1 thumb", aisle: "Fruit & Veg" },
      { name: "Fish sauce", qty: "1 tbsp", aisle: "Sauces" },
      { name: "Soy sauce", qty: "1 tbsp", aisle: "Sauces" },
    ],
  },
  {
    name: "Cheesy sausage and Chorizo gnocchi",
    type: "Wednesday",
    methods: [],
    ingredients: [
      { name: "Sausages", qty: "8", aisle: "Meat & Fish" },
      { name: "Chorizo", qty: "150g", aisle: "Meat & Fish" },
      { name: "Gnocchi", qty: "500g", aisle: "Chilled / Dairy" },
      { name: "Cream cheese", qty: "150g", aisle: "Chilled / Dairy" },
      { name: "Cheddar cheese", qty: "100g", aisle: "Chilled / Dairy" },
      { name: "Onion", qty: "1", aisle: "Fruit & Veg" },
      { name: "Garlic", qty: "3 cloves", aisle: "Fruit & Veg" },
      { name: "Peppers", qty: "2", aisle: "Fruit & Veg" },
      { name: "Tomato puree", qty: "2 tbsp", aisle: "Sauces" },
      { name: "Spinach", qty: "100g", aisle: "Fruit & Veg" },
      { name: "Parmesan", qty: "50g", aisle: "Chilled / Dairy" },
      { name: "Paprika", qty: "1 tsp", aisle: "Herbs & Spices" },
    ],
  },
  {
    name: "Tortellini pasta bake",
    type: "Thursday",
    methods: [],
    ingredients: [
      { name: "Tortellini", qty: "2 packs", aisle: "Chilled / Dairy" },
      { name: "Pasta sauce", qty: "1 jar", aisle: "Sauces" },
      { name: "Mozzarella", qty: "1 ball", aisle: "Chilled / Dairy" },
      { name: "Cheddar cheese", qty: "100g", aisle: "Chilled / Dairy" },
      { name: "Spinach", qty: "100g", aisle: "Fruit & Veg" },
      { name: "Garlic bread", qty: "1", aisle: "Bakery" },
      { name: "Salad", qty: "1 bag", aisle: "Fruit & Veg" },
    ],
  },
  {
    name: "Marry me chicken rice",
    type: "Monday",
    methods: [],
    ingredients: [
      { name: "Chicken breasts", qty: "4", aisle: "Meat & Fish" },
      { name: "Rice", qty: "250g", aisle: "Cupboard" },
      { name: "Sun-dried tomatoes", qty: "100g", aisle: "Cupboard" },
      { name: "Cream", qty: "200ml", aisle: "Chilled / Dairy" },
      { name: "Chicken stock", qty: "500ml", aisle: "Cupboard" },
      { name: "Parmesan", qty: "50g", aisle: "Chilled / Dairy" },
      { name: "Garlic", qty: "3 cloves", aisle: "Fruit & Veg" },
      { name: "Spinach", qty: "100g", aisle: "Fruit & Veg" },
      { name: "Paprika", qty: "1 tsp", aisle: "Herbs & Spices" },
      { name: "Mixed herbs", qty: "1 tsp", aisle: "Herbs & Spices" },
      { name: "Tomato puree", qty: "1 tbsp", aisle: "Sauces" },
    ],
  },
  {
    name: "Creamy leek and chicken potato gratin",
    type: "Saturday",
    methods: [],
    ingredients: [
      { name: "Chicken thighs", qty: "800g", aisle: "Meat & Fish" },
      { name: "Leeks", qty: "3", aisle: "Fruit & Veg" },
      { name: "Potatoes", qty: "1kg", aisle: "Fruit & Veg" },
      { name: "Cream", qty: "200ml", aisle: "Chilled / Dairy" },
      { name: "Chicken stock", qty: "500ml", aisle: "Cupboard" },
      { name: "Cheese", qty: "150g", aisle: "Chilled / Dairy" },
      { name: "Garlic", qty: "3 cloves", aisle: "Fruit & Veg" },
      { name: "Mustard", qty: "1 tbsp", aisle: "Sauces" },
      { name: "Broccoli", qty: "1 head", aisle: "Fruit & Veg" },
      { name: "Peas", qty: "200g", aisle: "Frozen" },
    ],
  },
  {
    name: "Hash brown cottage pie",
    type: "Saturday",
    methods: [],
    ingredients: [
      { name: "Beef mince", qty: "500g", aisle: "Meat & Fish" },
      { name: "Hash browns", qty: "1 bag", aisle: "Frozen" },
      { name: "Onion", qty: "1", aisle: "Fruit & Veg" },
      { name: "Carrots", qty: "2", aisle: "Fruit & Veg" },
      { name: "Peas", qty: "200g", aisle: "Frozen" },
      { name: "Gravy", qty: "1 tub", aisle: "Cupboard" },
      { name: "Worcestershire sauce", qty: "1 tbsp", aisle: "Sauces" },
      { name: "Tomato puree", qty: "1 tbsp", aisle: "Sauces" },
      { name: "Cheese", qty: "100g", aisle: "Chilled / Dairy" },
    ],
  },
  {
    name: "Halloumi salad",
    type: "Tuesday",
    methods: [],
    ingredients: [
      { name: "Halloumi", qty: "1 block", aisle: "Chilled / Dairy" },
      { name: "Salad", qty: "1 bag", aisle: "Fruit & Veg" },
      { name: "Tomatoes", qty: "4", aisle: "Fruit & Veg" },
      { name: "Cucumber", qty: "1", aisle: "Fruit & Veg" },
      { name: "Wraps", qty: "1 pack", aisle: "Bakery" },
    ],
  },
];

const INITIAL_PLANNER = {
  Mon: "",
  Tue: "",
  Wed: "Creamy Mustard Sausage & Leek Casserole",
  Thu: "",
  Fri: "Burgers",
  Sat: "Beef Meatballs in Onion Gravy",
  Sun: "LEFTOVERS",
};

const MEAL_CALORIES = {
  "Air Fryer Baked Feta Pasta": 650,
  "Air Fryer Crispy Beijing Beef": 720,
  "Air Fryer Pesto & Pepperoni Chicken": 620,
  "Airfryer Chorizo & Mozzarella Cod": 680,
  "Beef Meatballs in Onion Gravy": 700,
  "Beef, Lentil & Bean Chilli": 650,
  "Beef, Lentil & Veg Lasagne": 760,
  Burgers: 750,
  "Cheese toastie & beans": 550,
  "Gnocchi with Sausages": 760,
  "Chicken Fajita Rice": 620,
  "Chicken flat breads": 590,
  "Chicken Katsu Curry": 760,
  "Chicken Korma": 720,
  "Chicken Roast dinner": 680,
  "Chicken Tikka Masala": 780,
  "Chicken, Chorizo & Prawn Paella": 650,
  "Chipolata Gnocchi Traybake": 780,
  "Chorizo & Halloumi Tacos": 700,
  "Creamy Chicken Alfredo": 780,
  "Creamy Mustard Sausage & Leek Casserole": 720,
  "Creamy Pesto Halloumi Pasta": 780,
  "Egg Rolls": 520,
  Enchiladas: 720,
  "Halloumi Fajita Traybake": 680,
  "Falafel Sandwich": 560,
  "Fish fingers": 620,
  Fishcake: 560,
  "Garlic & Chilli Prawn Linguine": 620,
  "Hidden Veg Sauce": 480,
  "Jacket potato": 500,
  "Mushroom Soup Carbonara": 720,
  "Chicken Nuggets": 650,
  Pizza: 700,
  "Pulled Chicken Burrito Bowl": 680,
  "Sausage egg chips beans": 850,
  "Sausage Risotto": 760,
  "Slow Cooked Beef Brisket": 820,
  "Slow Cooker Chicken Pot Pie": 760,
  "Slow Cooker Sausage & Bean Casserole": 700,
  Soup: 350,
  "Sticky pork": 720,
  "Stir fry": 550,
  "Thai Red Chicken Curry Noodles": 680,
  "Three Bean Tacos": 620,
  "Chicken strip wraps": 650,
  "Coconut Red Curry Cod": 620,
  "Cheesy sausage and Chorizo gnocchi": 820,
  "Tortellini pasta bake": 740,
  "Marry me chicken rice": 780,
  "Creamy leek and chicken potato gratin": 760,
  "Hash brown cottage pie": 780,
  "Halloumi salad": 520,
};

const BASE_PRICE_ESTIMATES = {
  // Approximate editable grocery prices. In a hosted app, replace this with a backend call to a live grocery data provider.
  "milk": 1.55,
  "butter": 1.99,
  "cheddar cheese": 1.99,
  "mozzarella": 1.29,
  "parmesan": 2.49,
  "yoghurt": 1.15,
  "cream": 1.25,
  "sour cream": 0.89,
  "soft cheese": 1.25,
  "eggs": 1.89,
  "halloumi": 2.39,
  "feta cheese": 1.59,
  "chicken breast": 4.25,
  "chicken breasts": 4.25,
  "chicken thighs": 3.29,
  "beef mince": 3.49,
  "pork mince": 2.79,
  "sausages": 2.25,
  "pork sausages": 2.25,
  "bacon": 1.99,
  "ham": 1.59,
  "cod fillets": 4.49,
  "prawns": 2.99,
  "fish fingers": 1.89,
  "fishcakes": 1.99,
  "beef meatballs": 2.49,
  "burgers": 2.49,
  "bean/beef burgers": 2.49,
  "whole chicken": 4.49,
  "chorizo": 2.19,
  "pepperoni slices": 1.25,
  "onion": 0.99,
  "onions": 0.99,
  "red onion": 0.99,
  "garlic": 0.89,
  "garlic cloves": 0.89,
  "carrots": 0.69,
  "broccoli": 0.85,
  "leeks": 1.19,
  "peppers": 1.69,
  "courgette": 0.75,
  "mushrooms": 1.09,
  "spinach": 1.29,
  "cherry tomatoes": 1.09,
  "tomatoes": 0.95,
  "cucumber": 0.79,
  "salad": 0.99,
  "lettuce": 0.85,
  "potatoes": 1.35,
  "jacket potatoes": 1.35,
  "sweet potatoes": 1.19,
  "apples": 1.49,
  "bananas": 0.89,
  "grapes": 1.99,
  "lemons": 0.79,
  "limes": 0.79,
  "avocado": 0.89,
  "strawberries": 1.99,
  "sugar snap peas": 1.19,
  "spring onions": 0.59,
  "coriander": 0.55,
  "fresh basil": 0.59,
  "bread": 0.89,
  "bread rolls": 0.99,
  "burger buns": 0.99,
  "wraps": 0.99,
  "flatbreads": 1.19,
  "flat breads": 1.19,
  "pitta bread": 0.85,
  "garlic bread": 0.89,
  "naan bread": 1.15,
  "croissants": 1.49,
  "pasta": 0.75,
  "linguine": 0.85,
  "rice": 1.25,
  "paella rice": 1.49,
  "risotto rice": 1.59,
  "noodles": 1.09,
  "gnocchi": 1.49,
  "tortellini": 1.99,
  "lasagne sheets": 0.95,
  "tinned tomatoes": 0.39,
  "chopped tomatoes": 0.39,
  "passata": 0.55,
  "tomato puree": 0.49,
  "baked beans": 0.42,
  "beans": 0.42,
  "kidney beans": 0.55,
  "mixed beans": 0.65,
  "mixed beans / kidney beans": 0.65,
  "black beans": 0.65,
  "chickpeas": 0.55,
  "sweetcorn": 0.55,
  "tuna": 0.95,
  "coconut milk": 0.95,
  "green lentils": 0.75,
  "lentils": 0.75,
  "chicken stock": 0.75,
  "beef stock": 0.75,
  "gravy": 0.85,
  "gravy granules": 0.85,
  "flour": 0.79,
  "cornflour": 0.85,
  "breadcrumbs": 0.89,
  "hash browns": 1.49,
  "chips": 1.45,
  "peas": 0.85,
  "frozen peas": 0.85,
  "frozen chips": 1.45,
  "chicken nuggets": 1.99,
  "pizza": 1.99,
  "soup": 0.69,
  "mushroom soup": 0.69,
  "green pesto": 0.95,
  "pesto": 0.95,
  "korma sauce": 0.99,
  "tikka masala sauce": 0.99,
  "katsu curry sauce": 1.29,
  "enchilada sauce": 1.29,
  "pasta sauce": 0.75,
  "thai red curry paste": 1.25,
  "fajita seasoning": 0.75,
  "taco seasoning": 0.75,
  "salsa": 0.99,
  "bbq sauce": 0.85,
  "soy sauce": 0.95,
  "sesame oil": 1.89,
  "hoisin sauce": 1.25,
  "rice vinegar": 0.95,
  "olive oil": 3.49,
  "mayonnaise": 0.95,
  "mustard": 0.55,
  "honey": 1.15,
  "sweet chilli sauce": 0.95,
  "worcestershire sauce": 0.95,
  "marmite": 2.49,
  "paprika": 0.65,
  "mixed herbs": 0.65,
  "chilli flakes": 0.65,
  "smoked paprika": 0.65,
  "ginger": 0.69,
  "toilet roll": 3.79,
  "kitchen roll": 2.49,
  "washing up liquid": 0.85,
  "laundry detergent": 3.99,
  "dishwasher tablets": 3.49,
  "bin bags": 1.49,
  "foil": 1.09,
  "wipes": 0.69,
};

const SUPERMARKET_SOURCES = {
  trolley: {
    label: "Trolley live-ready",
    note: "Best fit for UK supermarket comparison data. This prototype uses estimates until connected to a backend feed.",
    multiplier: 1,
  },
  aldi: { label: "Aldi estimate", note: "Budget supermarket estimate", multiplier: 0.95 },
  tesco: { label: "Tesco estimate", note: "Main supermarket estimate", multiplier: 1.08 },
  asda: { label: "Asda estimate", note: "Main supermarket estimate", multiplier: 1.03 },
  sainsburys: { label: "Sainsbury's estimate", note: "Main supermarket estimate", multiplier: 1.12 },
  morrisons: { label: "Morrisons estimate", note: "Main supermarket estimate", multiplier: 1.07 },
};

const SEED_ESSENTIALS = {
  "Chilled / Dairy": ["Milk", "Butter", "Cheddar cheese", "Mozzarella", "Parmesan", "Yoghurt", "Hummus", "Cream", "Sour cream", "Soft cheese", "Eggs", "Halloumi"],
  "Meat & Fish": ["Chicken breasts", "Chicken thighs", "Beef mince", "Pork mince", "Sausages", "Bacon", "Ham", "Salmon fillets", "White fish", "Fish fingers", "Meatballs", "Burgers", "Whole chicken", "Chorizo"],
  "Fruit & Veg": ["Onions", "Garlic", "Carrots", "Broccoli", "Peppers", "Courgette", "Mushrooms", "Spinach", "Cherry tomatoes", "Cucumber", "Salad", "Potatoes", "Sweet potatoes", "Apples", "Bananas", "Grapes", "Lemons", "Limes", "Pears", "Avocado", "Strawberries", "Lettuce", "Spring onions", "Coriander", "Tomatoes", "Peas", "Sugar snap peas"],
  Bakery: ["Bread", "Wraps", "Burger buns", "Hot dog rolls", "Garlic bread", "Crumpets", "Bagels", "Pancakes", "French stick", "Naan bread", "Croissants", "Flat breads", "Pitta bread"],
  Cupboard: ["Pasta", "Rice", "Noodles", "Tinned tomatoes", "Tomato purée", "Baked beans", "Kidney beans", "Chickpeas", "Sweetcorn", "Tuna", "Coconut milk", "Chicken stock", "Beef stock", "Gravy granules", "Flour", "Cornflour", "Sugar", "Brown sugar", "Breadsticks", "Prawn crackers", "Tortilla chips", "Tinned soup", "Lentils", "Peanut butter", "Passata"],
  Sauces: ["Olive oil", "Vegetable oil", "Sesame oil", "Soy sauce", "BBQ sauce", "Ketchup", "Mayonnaise", "Mustard", "Honey", "Chilli sauce", "Sweet chilli sauce", "Curry paste", "Fajita seasoning", "Taco seasoning", "Sweet and sour"],
  "Herbs & Spices": ["Salt", "Black pepper", "Mixed herbs", "Oregano", "Paprika", "Chilli flakes", "Cumin", "Curry powder", "Garlic granules", "Ginger paste", "Garlic paste"],
  Frozen: ["Frozen peas", "Frozen sweetcorn", "Frozen broccoli", "Frozen chips", "Frozen berries", "Ice cream", "Nuggets", "Fish fingers", "Chips", "Pizza"],
  Household: ["Toilet roll", "Kitchen roll", "Washing up liquid", "Laundry detergent", "Fabric softener", "Dishwasher tablets", "Bin bags", "Cling film", "Foil", "Toothpaste", "Surface spray", "Hand soap", "Wipes", "Bleach", "Sponges"],
  Drinks: ["Squash", "Tea bags", "Coffee", "Coke", "Lemonade", "Tonic", "Orange squash", "Bubblegum squash", "Juice", "Sprite", "Pepsi Max", "Pepsi Max Cherry"],
  Snacks: ["Biscuits", "Crisps", "Cereal bars", "Crackers", "Jam", "Chocolate", "Nuts", "Cornflakes"],
};

function normalise(value) {
  return String(value || "").toLowerCase().trim();
}

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

function safeLoad(key, fallback) {
  try {
    const saved = window.localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

function safeSave(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // App still works if storage is unavailable.
  }
}

function getAutoMealCategory(meal) {
  const text = normalise([meal.name, ...(meal.ingredients || []).map((item) => item.name)].join(" "));

  if (/chicken|korma|tikka|katsu|marry me|enchilada|burrito/.test(text)) return "Chicken";
  if (/sausage|chipolata|chorizo|pork|bacon|gammon/.test(text)) return "Sausage / Pork";
  if (/beef|brisket|burger|meatball|mince|cottage|chilli/.test(text)) return "Beef";
  if (/fish|cod|salmon|prawn|seafood|tuna/.test(text)) return "Fish";
  if (/halloumi|falafel|bean|lentil|vegetarian|feta|paneer|panneer/.test(text)) return "Vegetarian";
  if (/pasta|gnocchi|tortellini|linguine|lasagne|carbonara|alfredo/.test(text)) return "Pasta / Gnocchi";
  if (/pizza|nugget|toastie|sandwich|pitta|wrap|soup|jacket|fish fingers|egg roll/.test(text)) return "Quick teas";
  return "Other meals";
}

function getMealCategory(meal) {
  if (CATEGORY_ORDER.includes(meal.type)) return meal.type;
  return getAutoMealCategory(meal);
}

const CATEGORY_ORDER = [
  "Chicken",
  "Sausage / Pork",
  "Beef",
  "Fish",
  "Vegetarian",
  "Pasta / Gnocchi",
  "Quick teas",
  "Other meals",
];

function makeShoppingItems(planner, meals, essentials = {}) {
  const itemMap = new Map();

  Object.values(planner).forEach((mealName) => {
    if (!mealName || mealName === "LEFTOVERS") return;
    const meal = meals.find((candidate) => candidate.name === mealName);
    if (!meal) return;

    meal.ingredients.forEach((ingredient) => {
      const key = `${normalise(ingredient.name)}::${ingredient.aisle}`;
      if (!itemMap.has(key)) {
        itemMap.set(key, { ...ingredient, qtys: ingredient.qty ? [ingredient.qty] : [] });
      } else if (ingredient.qty) {
        itemMap.get(key).qtys.push(ingredient.qty);
      }
    });
  });

  Object.entries(essentials).forEach(([key, checked]) => {
    if (!checked) return;
    const [aisle, name] = key.split("::");
    if (!aisle || !name) return;
    const itemKey = `${normalise(name)}::${aisle}`;
    if (!itemMap.has(itemKey)) {
      itemMap.set(itemKey, { name, aisle, qty: "", qtys: [] });
    }
  });

  return Array.from(itemMap.values()).map((item) => ({
    ...item,
    qty: Array.from(new Set(item.qtys)).filter(Boolean).join(" + "),
  }));
}

function groupShoppingByAisle(items) {
  return AISLES.reduce((groups, aisle) => {
    const aisleItems = items.filter((item) => item.aisle === aisle).sort((a, b) => a.name.localeCompare(b.name));
    if (aisleItems.length) groups.push({ aisle, items: aisleItems });
    return groups;
  }, []);
}

function getMealCalories(mealName, customCalories = {}) {
  if (!mealName || mealName === "LEFTOVERS") return 0;
  return Number(customCalories[mealName] ?? MEAL_CALORIES[mealName] ?? 600);
}

function getWeeklyCalories(planner, customCalories = {}) {
  return Object.values(planner).reduce((total, mealName) => total + getMealCalories(mealName, customCalories), 0);
}

function getItemCost(item, customPrices = {}, supermarket = "trolley") {
  const key = normalise(item.name);
  const source = SUPERMARKET_SOURCES[supermarket] || SUPERMARKET_SOURCES.trolley;
  const basePrice = Number(customPrices[key] ?? BASE_PRICE_ESTIMATES[key] ?? 1.25);
  return Number((basePrice * source.multiplier).toFixed(2));
}

function getShoppingCost(items, customPrices = {}, supermarket = "trolley") {
  return items.reduce((total, item) => total + getItemCost(item, customPrices, supermarket), 0);
}

function getCheapestBasket(items, customPrices = {}) {
  return Object.entries(SUPERMARKET_SOURCES)
    .filter(([key]) => key !== "trolley")
    .map(([key, source]) => ({ key, label: source.label, total: getShoppingCost(items, customPrices, key) }))
    .sort((a, b) => a.total - b.total)[0];
}

function renameMealEverywhere(meals, planner, customCalories, oldName, newName) {
  const cleanName = String(newName || "").trim();
  if (!oldName || !cleanName || oldName === cleanName) {
    return { meals, planner, customCalories };
  }

  const updatedMeals = meals.map((meal) => meal.name === oldName ? { ...meal, name: cleanName } : meal);
  const updatedPlanner = Object.fromEntries(Object.entries(planner).map(([day, mealName]) => [day, mealName === oldName ? cleanName : mealName]));
  const updatedCalories = { ...customCalories };

  if (Object.prototype.hasOwnProperty.call(updatedCalories, oldName)) {
    updatedCalories[cleanName] = updatedCalories[oldName];
    delete updatedCalories[oldName];
  }

  return { meals: updatedMeals, planner: updatedPlanner, customCalories: updatedCalories };
}

function runTests() {
  const groupedMeal = getMealCategory({ name: "Chicken Korma", type: "Monday", ingredients: [] });
  console.assert(groupedMeal === "Chicken", "Chicken Korma should be grouped as Chicken");

  const testPlanner = { Mon: "Burgers", Tue: "Burgers", Wed: "LEFTOVERS", Thu: "", Fri: "", Sat: "", Sun: "" };
  const items = makeShoppingItems(testPlanner, SEED_MEALS, { "Chilled / Dairy::Milk": true });
  console.assert(items.some((item) => item.name === "Chips"), "Shopping list should include chips from Burgers");
  console.assert(items.filter((item) => item.name === "Chips").length === 1, "Duplicate chips should be merged");
  console.assert(!items.some((item) => item.name === "LEFTOVERS"), "LEFTOVERS should not become a shopping item");
  console.assert(items.some((item) => item.name === "Milk"), "Checked essentials should appear in shopping list");

  const quickMeal = getMealCategory({ name: "Cheese toastie & beans", type: "Tuesday", ingredients: [] });
  console.assert(quickMeal === "Quick teas", "Toasties should be grouped as Quick teas");
  const manualOverride = getMealCategory({ name: "Chicken salad", type: "Vegetarian", ingredients: [{ name: "Chicken", aisle: "Meat & Fish" }] });
  console.assert(manualOverride === "Vegetarian", "Manual category override should be respected");
  const autoSuggest = getMealCategory({ name: "Falafel Sandwich", type: "Auto-suggest", ingredients: [{ name: "Falafel", aisle: "Chilled / Dairy" }] });
  console.assert(autoSuggest === "Vegetarian", "Auto-suggest should categorise from meal name and ingredients");
  console.assert(getMealCalories("LEFTOVERS") === 0, "Leftovers should not add calories");
  console.assert(getWeeklyCalories({ Mon: "Burgers", Tue: "LEFTOVERS" }) === MEAL_CALORIES.Burgers, "Weekly calories should total planned meals only");
  console.assert(getItemCost({ name: "Milk" }) > 0, "Known grocery price estimate should be found");
  console.assert(getShoppingCost([{ name: "Milk" }, { name: "Bread" }]) > getItemCost({ name: "Milk" }), "Shopping cost should total items");
  console.assert(getCheapestBasket([{ name: "Milk" }, { name: "Bread" }]).total > 0, "Cheapest basket should return a total");
  console.assert(SEED_MEALS.find((meal) => meal.name === "Burgers")?.ingredients.length > 0, "Meal database cards should have ingredients to display");
  const renameResult = renameMealEverywhere(
    [{ name: "Old Meal", type: "Quick teas", ingredients: [] }],
    { Mon: "Old Meal" },
    { "Old Meal": 500 },
    "Old Meal",
    "New Meal"
  );
  console.assert(renameResult.meals[0].name === "New Meal", "Renaming should update meal database title");
  console.assert(renameResult.planner.Mon === "New Meal", "Renaming should update planned meal references");
  console.assert(renameResult.customCalories["New Meal"] === 500, "Renaming should preserve custom calories");
}

runTests();

export default function App() {
  const [tab, setTab] = useState("planner");
  const [meals, setMeals] = useState(() => safeLoad("megsMeals_meals_v1", SEED_MEALS));
  const [planner, setPlanner] = useState(() => safeLoad("megsMeals_planner_v1", INITIAL_PLANNER));
  const [checks, setChecks] = useState(() => safeLoad("megsMeals_shoppingChecks_v1", {}));
  const [query, setQuery] = useState("");
  const [essentialChecks, setEssentialChecks] = useState(() => safeLoad("megsMeals_essentialChecks_v1", {}));
  const [newEssential, setNewEssential] = useState({ name: "", aisle: "Fruit & Veg" });
  const [customEssentials, setCustomEssentials] = useState(() => safeLoad("megsMeals_customEssentials_v1", {}));
  const [newMeal, setNewMeal] = useState({ name: "", type: "Auto-suggest", ingredient: "", qty: "", aisle: "Fruit & Veg", calories: "" });
  const [customCalories, setCustomCalories] = useState(() => safeLoad("megsMeals_customCalories_v1", {}));
  const [customPrices, setCustomPrices] = useState(() => safeLoad("megsMeals_customPrices_v1", {}));
  const [priceSource, setPriceSource] = useState(() => safeLoad("megsMeals_priceSource_v1", "trolley"));
  const [openMeal, setOpenMeal] = useState(null);
  const [editingMealName, setEditingMealName] = useState(null);
  const [editingMealTitle, setEditingMealTitle] = useState("");
  const [editingMealCategory, setEditingMealCategory] = useState("");
  const [editingMethods, setEditingMethods] = useState("");
  const [editingCalories, setEditingCalories] = useState("");
  const [editingIngredients, setEditingIngredients] = useState([]);
  const [methodChecks, setMethodChecks] = useState({});
  const [openDay, setOpenDay] = useState(null);
  const [user, setUser] = useState(null);
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [cloudStatus, setCloudStatus] = useState(SUPABASE_READY ? "Not signed in" : "Cloud sync not configured yet");

  useEffect(() => safeSave("megsMeals_meals_v1", meals), [meals]);
  useEffect(() => safeSave("megsMeals_planner_v1", planner), [planner]);
  useEffect(() => safeSave("megsMeals_shoppingChecks_v1", checks), [checks]);
  useEffect(() => safeSave("megsMeals_essentialChecks_v1", essentialChecks), [essentialChecks]);
  useEffect(() => safeSave("megsMeals_customEssentials_v1", customEssentials), [customEssentials]);
  useEffect(() => safeSave("megsMeals_customCalories_v1", customCalories), [customCalories]);
  useEffect(() => safeSave("megsMeals_customPrices_v1", customPrices), [customPrices]);
  useEffect(() => safeSave("megsMeals_priceSource_v1", priceSource), [priceSource]);

  useEffect(() => {
    async function initialiseAuth() {
      const supabase = await getSupabaseClient();
      if (!supabase) return;
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
        setCloudStatus(`Signed in as ${data.user.email}`);
      }
    }
    initialiseAuth();
  }, []);

  const mealGroups = useMemo(() => {
    const groups = {};

    meals.forEach((meal) => {
      const category = getMealCategory(meal);
      if (!groups[category]) groups[category] = [];
      groups[category].push(meal.name);
    });

    Object.keys(groups).forEach((category) => {
      groups[category].sort((a, b) => a.localeCompare(b));
    });

    return CATEGORY_ORDER.filter((category) => groups[category]?.length).map((category) => ({ category, meals: groups[category] }));
  }, [meals]);

  const shopping = useMemo(() => makeShoppingItems(planner, meals, essentialChecks), [planner, meals, essentialChecks]);
  const groupedShopping = useMemo(() => groupShoppingByAisle(shopping), [shopping]);
  const weeklyCalories = useMemo(() => getWeeklyCalories(planner, customCalories), [planner, customCalories]);
  const plannedMealCount = Object.values(planner).filter((value) => value && value !== "LEFTOVERS").length;
  const averageCalories = plannedMealCount ? Math.round(weeklyCalories / plannedMealCount) : 0;
  const weeklyCost = useMemo(() => getShoppingCost(shopping, customPrices, priceSource), [shopping, customPrices, priceSource]);
  const cheapestBasket = useMemo(() => getCheapestBasket(shopping, customPrices), [shopping, customPrices]);

  const cloudPayload = useMemo(() => ({
    meals,
    planner,
    checks,
    essentialChecks,
    customEssentials,
    customCalories,
    customPrices,
    priceSource,
    savedAt: new Date().toISOString(),
  }), [meals, planner, checks, essentialChecks, customEssentials, customCalories, customPrices, priceSource]);

  const filteredGroups = useMemo(() => {
    if (!query.trim()) return mealGroups;
    return mealGroups
      .map((group) => ({ ...group, meals: group.meals.filter((meal) => normalise(meal).includes(normalise(query))) }))
      .filter((group) => group.meals.length);
  }, [mealGroups, query]);

  function addEssential() {
    const cleanName = newEssential.name.trim();
    if (!cleanName) return;

    const key = `${newEssential.aisle}::${cleanName}`;

    setCustomEssentials((previous) => {
      const existing = previous[newEssential.aisle] || [];
      if (existing.some((item) => normalise(item) === normalise(cleanName))) return previous;
      return {
        ...previous,
        [newEssential.aisle]: [...existing, cleanName],
      };
    });

    setEssentialChecks((previous) => ({ ...previous, [key]: true }));
    setNewEssential({ name: "", aisle: "Fruit & Veg" });
  }

  function deleteCustomEssential(aisle, item) {
    const key = `${aisle}::${item}`;
    setCustomEssentials((previous) => ({
      ...previous,
      [aisle]: (previous[aisle] || []).filter((existing) => existing !== item),
    }));
    setEssentialChecks((previous) => {
      const next = { ...previous };
      delete next[key];
      return next;
    });
  }

  function addMeal() {
    if (!newMeal.name.trim()) return;
    const ingredients = newMeal.ingredient.trim()
      ? [{ name: newMeal.ingredient.trim(), qty: newMeal.qty.trim(), aisle: newMeal.aisle }]
      : [];
    const mealName = newMeal.name.trim();
    setMeals((previous) => [...previous, { name: mealName, type: newMeal.type, ingredients }]);
    if (newMeal.calories && Number(newMeal.calories) > 0) {
      setCustomCalories((previous) => ({ ...previous, [mealName]: Number(newMeal.calories) }));
    }
    setNewMeal({ name: "", type: "Auto-suggest", ingredient: "", qty: "", aisle: "Fruit & Veg", calories: "" });
  }

  function addIngredientToMeal(mealName) {
    const ingredientName = window.prompt("Ingredient name");
    if (!ingredientName) return;
    const qty = window.prompt("Quantity", "") || "";
    const aisleChoice = window.prompt(`Aisle: ${AISLES.join(", ")}`, "Fruit & Veg") || "Other";
    const aisle = AISLES.includes(aisleChoice) ? aisleChoice : "Other";
    setMeals((previous) => previous.map((meal) => meal.name === mealName ? { ...meal, ingredients: [...meal.ingredients, { name: ingredientName, qty, aisle }] } : meal));
  }

  function startEditingMealTitle(mealName) {
    const meal = meals.find((m) => m.name === mealName);
    setEditingMealName(mealName);
    setEditingMealTitle(mealName);
    setEditingMealCategory(CATEGORY_ORDER.includes(meal?.type) ? meal.type : "Auto-suggest");
    setEditingCalories(String(getMealCalories(mealName, customCalories) || ""));
    const existing = Array.isArray(meal?.methods) ? meal.methods.join("\n") : (meal?.methods || "");
    setEditingMethods(existing);
    setEditingIngredients((meal?.ingredients || []).map((ingredient) => ({ ...ingredient })));
  }

  function cancelEditingMealTitle() {
    setEditingMealName(null);
    setEditingMealTitle("");
    setEditingMealCategory("");
    setEditingCalories("");
    setEditingMethods("");
    setEditingIngredients([]);
  }

  function saveMealTitle(oldName) {
    const cleanName = editingMealTitle.trim();
    if (!cleanName) return;

    const cleanedIngredients = editingIngredients
      .filter((ingredient) => ingredient.name.trim())
      .map((ingredient) => ({
        name: ingredient.name.trim(),
        qty: ingredient.qty.trim(),
        aisle: AISLES.includes(ingredient.aisle) ? ingredient.aisle : "Other",
      }));

    let updatedMeals = meals.map((meal) =>
      meal.name === oldName
        ? {
            ...meal,
            name: cleanName,
            type: editingMealCategory === "Auto-suggest" ? "" : editingMealCategory,
            ingredients: cleanedIngredients,
            methods: editingMethods
              ? editingMethods.split("\n").map((s) => s.trim()).filter(Boolean)
              : [],
          }
        : meal
    );

    const { meals: renamedMeals, planner: updatedPlanner, customCalories: updatedCalories } = renameMealEverywhere(
      updatedMeals,
      planner,
      customCalories,
      oldName,
      cleanName
    );

    if (editingCalories && Number(editingCalories) > 0) {
      updatedCalories[cleanName] = Number(editingCalories);
    } else {
      delete updatedCalories[cleanName];
    }

    setMeals(renamedMeals);
    setPlanner(updatedPlanner);
    setCustomCalories(updatedCalories);
    setOpenMeal(cleanName);
    cancelEditingMealTitle();
  }

  function updateEditingIngredient(index, field, value) {
    setEditingIngredients((previous) => previous.map((ingredient, i) => i === index ? { ...ingredient, [field]: value } : ingredient));
  }

  function addEditingIngredientRow() {
    setEditingIngredients((previous) => [...previous, { name: "", qty: "", aisle: "Fruit & Veg" }]);
  }

  function deleteEditingIngredientRow(index) {
    setEditingIngredients((previous) => previous.filter((_, i) => i !== index));
  }

  function deleteMeal(mealName) {
    setMeals((previous) => previous.filter((meal) => meal.name !== mealName));
    setPlanner((previous) => Object.fromEntries(Object.entries(previous).map(([day, selected]) => [day, selected === mealName ? "" : selected])));
    setOpenMeal(null);
    cancelEditingMealTitle();
  }

  function toggleMethodStep(day, index) {
    const key = `${day}::${index}`;
    setMethodChecks((previous) => ({ ...previous, [key]: !previous[key] }));
  }

  async function signUp() {
    const supabase = await getSupabaseClient();
    if (!supabase) {
      setCloudStatus("Add your Supabase URL and anon key first.");
      return;
    }
    const { data, error } = await supabase.auth.signUp({ email: authEmail, password: authPassword });
    if (error) {
      setCloudStatus(error.message);
      return;
    }
    setUser(data.user || null);
    setCloudStatus("Account created. Check your email if confirmation is enabled.");
  }

  async function signIn() {
    const supabase = await getSupabaseClient();
    if (!supabase) {
      setCloudStatus("Add your Supabase URL and anon key first.");
      return;
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email: authEmail, password: authPassword });
    if (error) {
      setCloudStatus(error.message);
      return;
    }
    setUser(data.user);
    setCloudStatus(`Signed in as ${data.user.email}`);
  }

  async function signOut() {
    const supabase = await getSupabaseClient();
    if (!supabase) return;
    await supabase.auth.signOut();
    setUser(null);
    setCloudStatus("Signed out");
  }

  async function saveToCloud() {
    const supabase = await getSupabaseClient();
    if (!supabase || !user) {
      setCloudStatus("Sign in before saving to cloud.");
      return;
    }
    const { error } = await supabase.from("meal_planner_data").upsert({
      user_id: user.id,
      app_data: cloudPayload,
      updated_at: new Date().toISOString(),
    });
    setCloudStatus(error ? error.message : "Saved to cloud ✓");
  }

  async function loadFromCloud() {
    const supabase = await getSupabaseClient();
    if (!supabase || !user) {
      setCloudStatus("Sign in before loading from cloud.");
      return;
    }
    const { data, error } = await supabase
      .from("meal_planner_data")
      .select("app_data")
      .eq("user_id", user.id)
      .single();

    if (error || !data?.app_data) {
      setCloudStatus(error?.message || "No cloud save found yet.");
      return;
    }

    const saved = data.app_data;
    setMeals(saved.meals || SEED_MEALS);
    setPlanner(saved.planner || INITIAL_PLANNER);
    setChecks(saved.checks || {});
    setEssentialChecks(saved.essentialChecks || {});
    setCustomEssentials(saved.customEssentials || {});
    setCustomCalories(saved.customCalories || {});
    setCustomPrices(saved.customPrices || {});
    setPriceSource(saved.priceSource || "trolley");
    setCloudStatus("Loaded from cloud ✓");
  }

  return (
    <div className="min-h-screen bg-[#FFF9F5] p-4 text-[#1F2937]">
      <main className="mx-auto max-w-md pb-20">
        <header className="mb-4 rounded-[2rem] bg-white p-5 shadow-md ring-1 ring-[#C8B6FF]/20">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-wide text-[#1F2937] ">Meg’s Meals</p>
              <h1 className="mt-1 text-3xl font-black leading-tight text-[#1F2937] ">Plan your week</h1>
              <p className="mt-1 text-sm font-bold text-[#1F2937]/70 ">Pick meals, auto-build your aisle shopping list.</p>
            </div>
            <div className="rounded-2xl bg-[#4DA8FF] px-3 py-2 text-2xl shadow-md text-white">🧺</div>
          </div>

          <div className="mt-4 grid grid-cols-4 gap-2 text-center">
            <div className="rounded-2xl bg-[#4DA8FF] text-white p-2 shadow-sm ring-1 ring-[#C8B6FF]/20">
              <div className="text-lg font-black">{plannedMealCount}</div>
              <div className="text-[11px] font-bold">meals</div>
            </div>
            <div className="rounded-2xl bg-[#C8B6FF] text-[#1F2937] p-2 shadow-sm ring-1 ring-[#C8B6FF]/20">
              <div className="text-lg font-black">{shopping.length}</div>
              <div className="text-[11px] font-bold">items</div>
            </div>
            <div className="rounded-2xl bg-[#6FE3C1]/20 p-2 shadow-sm ring-1 ring-[#C8B6FF]/20">
              <div className="text-lg font-black">£{weeklyCost.toFixed(2)}</div>
              <div className="text-[11px] font-bold text-[#1F2937]/60">est cost</div>
            </div>
            <div className="rounded-2xl bg-[#FF8A73]/10 p-2 shadow-sm ring-1 ring-[#C8B6FF]/20">
              <div className="text-lg font-black">{weeklyCalories}</div>
              <div className="text-[11px] font-bold text-[#1F2937]/60">kcal/wk</div>
            </div>
          </div>
        </header>

        <nav className="sticky top-2 z-10 mb-4 grid grid-cols-6 gap-1 rounded-full bg-white p-1 shadow-sm ring-1 ring-[#C8B6FF]/30">
          <button onClick={() => setTab("planner")} className={cx("rounded-full px-1 py-3 text-[11px] font-black", tab === "planner" ? "bg-[#4DA8FF] text-white shadow-md" : "bg-[#4DA8FF]/10 text-[#1F2937]")}>📅 Plan</button>
          <button onClick={() => setTab("shopping")} className={cx("rounded-full px-1 py-3 text-[11px] font-black", tab === "shopping" ? "bg-[#6FE3C1] text-[#1F2937] shadow-md" : "bg-[#6FE3C1]/10 text-[#6FE3C1]")}>🛒 Shop</button>
          <button onClick={() => setTab("cost")} className={cx("rounded-full px-1 py-3 text-[11px] font-black", tab === "cost" ? "bg-[#C8B6FF] text-[#1F2937] shadow-md" : "bg-[#4DA8FF]/10 text-[#1F2937]")}>£ Cost</button>
          <button onClick={() => setTab("essentials")} className={cx("rounded-full px-1 py-3 text-[11px] font-black", tab === "essentials" ? "bg-[#FFE27A] text-[#1F2937] shadow-md" : "bg-[#FF8A73]/10 text-[#FF8A73]")}>✔️ Extra</button>
          <button onClick={() => setTab("add")} className={cx("rounded-full px-1 py-3 text-[11px] font-black", tab === "add" ? "bg-[#FF8A73] text-white shadow-md" : "bg-[#FF8A73]/10 text-[#FF8A73]")}>➕ Meal</button>
          <button onClick={() => setTab("account")} className={cx("rounded-full px-1 py-3 text-[11px] font-black", tab === "account" ? "bg-[#1F2937] text-white shadow-md" : "bg-[#1F2937]/10 text-[#1F2937]")}>👤 Me</button>
        </nav>

        {tab === "account" && (
          <section className="space-y-4">
            <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-[#C8B6FF]/20">
              <h2 className="text-lg font-black">Account + cloud sync</h2>
              <p className="text-sm text-[#1F2937]/60">Create an account to sync Meg’s Meals across phones, tablets and laptops.</p>
              {!SUPABASE_READY && (
                <div className="mt-3 rounded-2xl bg-[#FFE27A]/40 p-3 text-xs font-bold text-[#1F2937]">
                  Cloud sync is added, but not connected yet. Paste your Supabase project URL and anon key into the code, then create the database table.
                </div>
              )}
              <div className="mt-4 grid gap-2">
                <input
                  value={authEmail}
                  onChange={(event) => setAuthEmail(event.target.value)}
                  type="email"
                  placeholder="Email"
                  className="w-full rounded-2xl bg-[#FFF9F5] px-4 py-3 text-sm outline-none ring-1 ring-[#C8B6FF]/30 focus:ring-2 focus:ring-[#4DA8FF]"
                />
                <input
                  value={authPassword}
                  onChange={(event) => setAuthPassword(event.target.value)}
                  type="password"
                  placeholder="Password"
                  className="w-full rounded-2xl bg-[#FFF9F5] px-4 py-3 text-sm outline-none ring-1 ring-[#C8B6FF]/30 focus:ring-2 focus:ring-[#4DA8FF]"
                />
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={signIn} className="rounded-2xl bg-[#4DA8FF] px-4 py-3 text-sm font-black text-white">Sign in</button>
                  <button onClick={signUp} className="rounded-2xl bg-[#FF8A73] px-4 py-3 text-sm font-black text-white">Create account</button>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-[#C8B6FF]/20">
              <h3 className="text-base font-black">Cloud save</h3>
              <p className="mt-1 text-sm text-[#1F2937]/60">{cloudStatus}</p>
              {user && <p className="mt-1 text-xs font-bold text-[#1F2937]/60">Signed in: {user.email}</p>}
              <div className="mt-4 grid grid-cols-2 gap-2">
                <button onClick={saveToCloud} className="rounded-2xl bg-[#6FE3C1] px-4 py-3 text-sm font-black text-[#1F2937]">Save cloud</button>
                <button onClick={loadFromCloud} className="rounded-2xl bg-[#C8B6FF] px-4 py-3 text-sm font-black text-[#1F2937]">Load cloud</button>
              </div>
              {user && (
                <button onClick={signOut} className="mt-2 w-full rounded-2xl bg-[#1F2937]/10 px-4 py-3 text-sm font-black text-[#1F2937]">Sign out</button>
              )}
            </div>
          </section>
        )}

        {tab === "planner" && (
          <section className="space-y-3">
            <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-[#C8B6FF]/20">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-black">Calories</h2>
                  <p className="text-sm text-[#1F2937]/60">Estimated from your planned dinners.</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-[#FF8A73]">{weeklyCalories}</div>
                  <div className="text-xs font-bold text-[#1F2937]/60">kcal/week</div>
                </div>
              </div>
              <div className="mt-3 rounded-2xl bg-white p-3 text-sm font-bold text-[#1F2937]">
                Average: {averageCalories} kcal per planned meal
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {DAYS.map((day) => {
                const isOpen = openDay === day;
                const selectedMealName = planner[day];
                const selectedMeal = meals.find((meal) => meal.name === selectedMealName);
                const hasMeal = Boolean(selectedMealName);
                const hasMethod = Boolean(selectedMeal?.methods?.length);

                return (
                  <div key={day} className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-[#C8B6FF]/20">
                    <button
                      type="button"
                      onClick={() => setOpenDay(isOpen ? null : day)}
                      className="flex w-full items-center justify-between gap-3 text-left"
                    >
                      <div>
                        <div className="text-sm font-black">{day}</div>
                        <div className="mt-1 text-xs font-bold text-[#1F2937]/60">
                          {selectedMealName || "No meal selected"}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {hasMeal && selectedMealName !== "LEFTOVERS" && (
                          <span className="rounded-full bg-[#FFF9F5] px-2 py-1 text-[11px] font-black text-[#FF8A73]">
                            {getMealCalories(selectedMealName, customCalories)} kcal
                          </span>
                        )}
                        <span className="rounded-full bg-[#FF8A73]/10 px-2 py-1 text-xs font-black text-[#1F2937]/60">
                          {isOpen ? "Hide" : "Show"}
                        </span>
                      </div>
                    </button>

                    {isOpen && (
                      <div className="mt-3 space-y-3 border-t border-zinc-100 pt-3">
                        <div className="flex items-center gap-2">
                          <select
                            value={planner[day] || ""}
                            onChange={(event) => setPlanner({ ...planner, [day]: event.target.value })}
                            className="min-w-0 flex-1 rounded-2xl border-0 bg-white p-3 text-sm outline-none ring-1 ring-[#C8B6FF]/30 focus:ring-2 focus:ring-[#4DA8FF]"
                          >
                            <option value="">Choose meal</option>
                            <option value="LEFTOVERS">LEFTOVERS</option>
                            {mealGroups.map((group) => (
                              <optgroup key={group.category} label={group.category}>
                                {group.meals.map((meal) => <option key={meal} value={meal}>{meal} · {getMealCalories(meal, customCalories)} kcal</option>)}
                              </optgroup>
                            ))}
                          </select>
                          {planner[day] && (
                            <button onClick={() => setPlanner({ ...planner, [day]: "" })} className="rounded-2xl bg-[#FF8A73]/10 px-3 py-3 text-xs font-black text-[#1F2937]/60">Clear</button>
                          )}
                        </div>

                        {selectedMealName && selectedMealName !== "LEFTOVERS" && (
                          <div className="rounded-2xl bg-white p-3 text-xs font-bold text-[#1F2937]">
                            Estimated: {getMealCalories(selectedMealName, customCalories)} kcal
                          </div>
                        )}

                        {hasMethod && (
                          <div className="rounded-2xl bg-white p-3 text-xs">
                            <div className="mb-2 font-black">Cook mode</div>
                            <div className="space-y-2">
                              {selectedMeal.methods.map((step, i) => {
                                const stepKey = `${day}::${i}`;
                                const checked = Boolean(methodChecks[stepKey]);
                                return (
                                  <label key={i} className={cx("flex items-start gap-2 rounded-2xl bg-[#FFF9F5]  p-3 ring-1 ring-[#6FE3C1]/30", checked && "opacity-50")}>
                                    <input
                                      type="checkbox"
                                      checked={checked}
                                      onChange={() => toggleMethodStep(day, i)}
                                      className="mt-1 h-4 w-4 accent-[#6FE3C1]"
                                    />
                                    <span className={cx("flex-1", checked && "line-through")}>{step}</span>
                                  </label>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {tab === "cost" && (
          <section className="space-y-4">
            <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-[#C8B6FF]/20">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-black">Supermarket cost</h2>
                  <p className="text-sm text-[#1F2937]/60">Uses the most live-ready source mode available in this prototype.</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-black text-[#FF8A73]">£{weeklyCost.toFixed(2)}</div>
                  <div className="text-xs font-bold text-[#1F2937]/60">{SUPERMARKET_SOURCES[priceSource].label}</div>
                </div>
              </div>
              <div className="mt-3 grid gap-2">
                <select
                  value={priceSource}
                  onChange={(event) => setPriceSource(event.target.value)}
                  className="w-full rounded-2xl bg-[#FFF9F5] px-4 py-3 text-sm font-bold outline-none ring-1 ring-[#C8B6FF]/30 focus:ring-2 focus:ring-[#4DA8FF]"
                >
                  {Object.entries(SUPERMARKET_SOURCES).map(([key, source]) => <option key={key} value={key}>{source.label}</option>)}
                </select>
                <p className="rounded-2xl bg-[#FF8A73]/10 p-3 text-xs font-bold text-[#1F2937]">
                  {SUPERMARKET_SOURCES[priceSource].note} Real live pricing needs a hosted backend/API connection.
                </p>
                {cheapestBasket && (
                  <div className="rounded-2xl bg-white p-3 text-sm font-black text-[#1F2937]">
                    Cheapest estimate right now: {cheapestBasket.label} · £{cheapestBasket.total.toFixed(2)}
                  </div>
                )}
              </div>
            </div>

            {groupedShopping.length === 0 ? (
              <div className="rounded-3xl bg-[#FFF9F5]  p-5 text-center text-sm text-[#1F2937]/60 shadow-sm ring-1 ring-[#C8B6FF]/20">No costs yet. Add meals in the planner.</div>
            ) : (
              groupedShopping.map((group) => {
                const groupTotal = group.items.reduce((total, item) => total + getItemCost(item, customPrices, priceSource), 0);
                return (
                  <div key={group.aisle} className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-[#C8B6FF]/20">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <h3 className="text-base font-black">{AISLE_ICON[group.aisle] || "🛒"} {group.aisle}</h3>
                      <div className="text-sm font-black text-[#FF8A73]">£{groupTotal.toFixed(2)}</div>
                    </div>
                    <div className="space-y-2">
                      {group.items.map((item) => {
                        const itemKey = normalise(item.name);
                        const cost = getItemCost(item, customPrices, priceSource);
                        return (
                          <div key={`${item.aisle}::${item.name}`} className="grid grid-cols-[1fr_80px] items-center gap-2 rounded-2xl bg-white p-3 ring-1 ring-[#C8B6FF]/20 ">
                            <div className="min-w-0">
                              <div className="font-bold text-[#1F2937]">{item.name}</div>
                              <div className="text-xs text-[#1F2937]/60">{item.qty || "No qty"}</div>
                            </div>
                            <div className="relative">
                              <span className="absolute left-3 top-2.5 text-sm font-bold text-zinc-400">£</span>
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={cost.toFixed(2)}
                                onChange={(event) => setCustomPrices({ ...customPrices, [itemKey]: Number(event.target.value) / (SUPERMARKET_SOURCES[priceSource]?.multiplier || 1) || 0 })}
                                className="w-full rounded-xl bg-[#FFF9F5]  py-2 pl-6 pr-2 text-right text-sm font-black outline-none ring-1 ring-[#C8B6FF]/30 focus:ring-2 focus:ring-[#4DA8FF]"
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            )}
          </section>
        )}

        {tab === "essentials" && (
          <section className="space-y-4">
            <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-[#C8B6FF]/20">
              <h2 className="text-lg font-black">Essentials</h2>
              <p className="text-sm text-[#1F2937]/60">Tick extras like milk, bread, fruit or household bits.</p>
              <div className="mt-4 grid gap-2">
                <input
                  value={newEssential.name}
                  onChange={(event) => setNewEssential({ ...newEssential, name: event.target.value })}
                  placeholder="Add your own essential"
                  className="w-full rounded-2xl bg-[#FFF9F5] px-4 py-3 text-sm outline-none ring-1 ring-[#C8B6FF]/30 focus:ring-2 focus:ring-[#4DA8FF]"
                />
                <div className="grid grid-cols-[1fr_auto] gap-2">
                  <select
                    value={newEssential.aisle}
                    onChange={(event) => setNewEssential({ ...newEssential, aisle: event.target.value })}
                    className="rounded-2xl bg-[#FFF9F5] px-4 py-3 text-sm outline-none ring-1 ring-[#C8B6FF]/30"
                  >
                    {AISLES.map((aisle) => <option key={aisle}>{aisle}</option>)}
                  </select>
                  <button onClick={addEssential} className="rounded-2xl bg-[#FF8A73] px-4 py-3 text-sm font-black text-[#1F2937]">Add</button>
                </div>
              </div>
            </div>

            {Object.entries(SEED_ESSENTIALS).map(([aisle, seedItems]) => {
              const customItems = customEssentials[aisle] || [];
              const items = [...seedItems, ...customItems];
              return (
              <div key={aisle} className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-[#C8B6FF]/20">
                <h3 className="mb-3 text-base font-black">{AISLE_ICON[aisle] || "🛒"} {aisle}</h3>
                <div className="grid gap-2">
                  {items.map((item) => {
                    const key = `${aisle}::${item}`;
                    return (
                      <label key={key} className="flex items-center gap-3 rounded-2xl bg-white p-3 ring-1 ring-[#C8B6FF]/20 ">
                        <input
                          type="checkbox"
                          checked={Boolean(essentialChecks[key])}
                          onChange={(event) => setEssentialChecks({ ...essentialChecks, [key]: event.target.checked })}
                          className="h-5 w-5 accent-[#6FE3C1]"
                        />
                        <span className="flex-1 font-medium">{item}</span>
                        {customItems.includes(item) && (
                          <button
                            type="button"
                            onClick={(event) => {
                              event.preventDefault();
                              deleteCustomEssential(aisle, item);
                            }}
                            className="rounded-full bg-[#FF8A73]/10 px-2 py-1 text-xs font-black text-[#1F2937]"
                          >
                            Delete
                          </button>
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>
              );
            })}
          </section>
        )}

        {tab === "add" && (
          <section className="space-y-4">
            <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-[#C8B6FF]/20">
              <h2 className="text-lg font-black">Add meal</h2>
              <p className="mb-4 text-sm text-[#1F2937]/60">Add a new meal to your dropdowns. Start with one ingredient, then add more below.</p>
              <div className="grid gap-2">
                <input value={newMeal.name} onChange={(event) => setNewMeal({ ...newMeal, name: event.target.value })} placeholder="Meal name" className="rounded-2xl bg-[#FFF9F5] px-4 py-3 text-sm outline-none ring-1 ring-[#C8B6FF]/30" />
                <select value={newMeal.type} onChange={(event) => setNewMeal({ ...newMeal, type: event.target.value })} className="rounded-2xl bg-[#FFF9F5] px-4 py-3 text-sm outline-none ring-1 ring-[#C8B6FF]/30">
                  <option>Auto-suggest</option>
                  {CATEGORY_ORDER.map((category) => <option key={category}>{category}</option>)}
                </select>
                <input value={newMeal.ingredient} onChange={(event) => setNewMeal({ ...newMeal, ingredient: event.target.value })} placeholder="First ingredient" className="rounded-2xl bg-[#FFF9F5] px-4 py-3 text-sm outline-none ring-1 ring-[#C8B6FF]/30" />
                <input value={newMeal.calories} onChange={(event) => setNewMeal({ ...newMeal, calories: event.target.value })} type="number" min="0" placeholder="Estimated calories per serving" className="rounded-2xl bg-[#FFF9F5] px-4 py-3 text-sm outline-none ring-1 ring-[#C8B6FF]/30" />
                <div className="grid grid-cols-2 gap-2">
                  <input value={newMeal.qty} onChange={(event) => setNewMeal({ ...newMeal, qty: event.target.value })} placeholder="Qty" className="rounded-2xl bg-[#FFF9F5] px-4 py-3 text-sm outline-none ring-1 ring-[#C8B6FF]/30" />
                  <select value={newMeal.aisle} onChange={(event) => setNewMeal({ ...newMeal, aisle: event.target.value })} className="rounded-2xl bg-[#FFF9F5] px-4 py-3 text-sm outline-none ring-1 ring-[#C8B6FF]/30">
                    {AISLES.map((aisle) => <option key={aisle}>{aisle}</option>)}
                  </select>
                </div>
                <button onClick={addMeal} className="rounded-2xl bg-[#FF8A73] px-4 py-3 text-sm font-black text-[#1F2937]">Add meal</button>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-[#C8B6FF]/20">
              <h3 className="mb-1 text-base font-black">Meal database</h3>
              <p className="mb-3 text-xs font-bold text-[#1F2937]/60">Tap a meal to view the ingredients already included.</p>
              <div className="space-y-2">
                {meals.slice().sort((a, b) => a.name.localeCompare(b.name)).map((meal) => {
                  const isOpen = openMeal === meal.name;
                  return (
                    <div key={meal.name} className="rounded-2xl bg-white p-3 ring-1 ring-[#C8B6FF]/20 ">
                      <button
                        type="button"
                        onClick={() => setOpenMeal(isOpen ? null : meal.name)}
                        className="w-full text-left"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            {editingMealName === meal.name ? (
                              <div className="space-y-2">
                                <input
                                  value={editingMealTitle}
                                  onChange={(event) => setEditingMealTitle(event.target.value)}
                                  onClick={(event) => event.stopPropagation()}
                                  className="w-full rounded-xl bg-[#FFF9F5]  px-3 py-2 text-sm font-bold outline-none ring-1 ring-[#6FE3C1]/40 focus:ring-2 focus:ring-[#4DA8FF]"
                                  autoFocus
                                />
                                <select
                                  value={editingMealCategory}
                                  onChange={(e) => setEditingMealCategory(e.target.value)}
                                  onClick={(e) => e.stopPropagation()}
                                  className="w-full rounded-xl bg-[#FFF9F5]  px-3 py-2 text-sm font-bold outline-none ring-1 ring-[#6FE3C1]/40"
                                >
                                  <option>Auto-suggest</option>
                                  {CATEGORY_ORDER.map((cat) => (
                                    <option key={cat}>{cat}</option>
                                  ))}
                                </select>
                                <input
                                  value={editingCalories}
                                  onChange={(e) => setEditingCalories(e.target.value)}
                                  onClick={(e) => e.stopPropagation()}
                                  type="number"
                                  min="0"
                                  placeholder="Calories per serving"
                                  className="w-full rounded-xl bg-[#FFF9F5]  px-3 py-2 text-sm font-bold outline-none ring-1 ring-[#6FE3C1]/40"
                                />
                                <textarea
                                  value={editingMethods}
                                  onChange={(e) => setEditingMethods(e.target.value)}
                                  onClick={(e) => e.stopPropagation()}
                                  placeholder="Methods (one step per line)"
                                  className="w-full rounded-xl bg-[#FFF9F5]  px-3 py-2 text-sm outline-none ring-1 ring-[#6FE3C1]/40"
                                />
                                <div className="rounded-2xl bg-[#FFF9F5]  p-3 ring-1 ring-[#6FE3C1]/30">
                                  <div className="mb-2 flex items-center justify-between gap-2">
                                    <div className="text-xs font-black uppercase tracking-wide text-[#FF8A73]">Ingredients</div>
                                    <button type="button" onClick={(e) => { e.stopPropagation(); addEditingIngredientRow(); }} className="rounded-full bg-[#FFF9F5] px-3 py-1 text-xs font-black text-[#FF8A73]">+ add</button>
                                  </div>
                                  <div className="space-y-2">
                                    {editingIngredients.map((ingredient, index) => (
                                      <div key={index} className="rounded-2xl bg-white p-2 shadow-sm ring-1 ring-[#C8B6FF]/20">
                                        <input
                                          value={ingredient.name}
                                          onChange={(e) => updateEditingIngredient(index, "name", e.target.value)}
                                          onClick={(e) => e.stopPropagation()}
                                          placeholder="Ingredient"
                                          className="mb-2 w-full rounded-xl bg-[#FFF9F5]  px-3 py-2 text-sm font-bold outline-none ring-1 ring-[#C8B6FF]/30"
                                        />
                                        <div className="grid grid-cols-[1fr_1fr_auto] gap-2">
                                          <input
                                            value={ingredient.qty}
                                            onChange={(e) => updateEditingIngredient(index, "qty", e.target.value)}
                                            onClick={(e) => e.stopPropagation()}
                                            placeholder="Qty"
                                            className="rounded-xl bg-[#FFF9F5]  px-3 py-2 text-sm outline-none ring-1 ring-[#C8B6FF]/30"
                                          />
                                          <select
                                            value={ingredient.aisle}
                                            onChange={(e) => updateEditingIngredient(index, "aisle", e.target.value)}
                                            onClick={(e) => e.stopPropagation()}
                                            className="rounded-xl bg-[#FFF9F5]  px-2 py-2 text-xs font-bold outline-none ring-1 ring-[#C8B6FF]/30"
                                          >
                                            {AISLES.map((aisle) => <option key={aisle}>{aisle}</option>)}
                                          </select>
                                          <button type="button" onClick={(e) => { e.stopPropagation(); deleteEditingIngredientRow(index); }} className="rounded-xl bg-[#FF8A73]/20 px-2 py-2 text-xs font-black text-[#FF8A73]">Del</button>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  <button
                                    type="button"
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      saveMealTitle(meal.name);
                                    }}
                                    className="rounded-xl bg-[#FF8A73] px-3 py-2 text-xs font-black text-[#1F2937]"
                                  >
                                    Save
                                  </button>
                                  <button
                                    type="button"
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      cancelEditingMealTitle();
                                    }}
                                    className="rounded-xl bg-[#FFF9F5]  px-3 py-2 text-xs font-black shadow-sm"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    type="button"
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      deleteMeal(meal.name);
                                    }}
                                    className="rounded-xl bg-[#FF8A73]/20 px-3 py-2 text-xs font-black text-[#FF8A73]"
                                  >
                                    Delete meal
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <div className="font-bold text-[#1F2937]">{meal.name}</div>
                                <div className="text-xs text-[#1F2937]/60">{getMealCategory(meal)} · {meal.ingredients.length} ingredients · {getMealCalories(meal.name, customCalories)} kcal</div>
                              </>
                            )}
                          </div>
                          <div className="flex shrink-0 flex-col items-end gap-1">
                            <div className="rounded-full bg-[#FFF9F5]  px-2 py-1 text-xs font-black shadow-sm">{isOpen ? "Hide" : "View"}</div>
                            {isOpen && editingMealName !== meal.name && (
                              <button
                                type="button"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  startEditingMealTitle(meal.name);
                                }}
                                className="rounded-full bg-[#FFF9F5] px-2 py-1 text-xs font-black text-[#FF8A73]"
                              >
                                Edit title
                              </button>
                            )}
                          </div>
                        </div>
                      </button>

                      {isOpen && (
                        <div className="mt-3 space-y-2 border-t border-zinc-200 pt-3">
                          {meal.methods && meal.methods.length > 0 && (
                            <div className="rounded-2xl bg-white p-3 text-sm">
                              <div className="mb-1 font-black">Method</div>
                              <ol className="list-decimal pl-5 space-y-1">
                                {meal.methods.map((step, i) => (
                                  <li key={i}>{step}</li>
                                ))}
                              </ol>
                            </div>
                          )}
                          {meal.ingredients.length === 0 ? (
                            <div className="rounded-2xl bg-[#FFF9F5]  p-3 text-sm text-[#1F2937]/60">No ingredients added yet.</div>
                          ) : (
                            meal.ingredients.map((ingredient, index) => (
                              <div key={`${meal.name}-${ingredient.name}-${index}`} className="grid grid-cols-[1fr_auto] gap-2 rounded-2xl bg-[#FFF9F5] p-3 text-sm shadow-sm ring-1 ring-[#C8B6FF]/20 ">
                                <div>
                                  <div className="font-bold">{ingredient.name}</div>
                                  <div className="text-xs text-[#1F2937]/60">{AISLE_ICON[ingredient.aisle] || "🛒"} {ingredient.aisle}</div>
                                </div>
                                <div className="text-right text-xs font-black text-[#FF8A73]">{ingredient.qty || "No qty"}</div>
                              </div>
                            ))
                          )}
                          <button onClick={() => startEditingMealTitle(meal.name)} className="w-full rounded-2xl bg-[#FFF9F5]  px-3 py-3 text-sm font-black shadow-sm ring-1 ring-[#C8B6FF]/20">Edit full meal</button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {tab === "shopping" && (
          <section className="space-y-4">
            <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-[#C8B6FF]/20">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-black">Shopping list</h2>
                  <p className="text-sm text-[#1F2937]/60">Grouped by aisle. Tick off as you shop.</p>
                </div>
                <button onClick={() => setChecks({})} className="rounded-2xl bg-[#FF8A73]/10 px-3 py-2 text-xs font-black">Untick</button>
              </div>
            </div>

            {groupedShopping.length === 0 ? (
              <div className="rounded-3xl bg-[#FFF9F5]  p-5 text-center text-sm text-[#1F2937]/60 shadow-sm ring-1 ring-[#C8B6FF]/20">No items yet. Add meals in the planner.</div>
            ) : (
              groupedShopping.map((group) => (
                <div key={group.aisle} className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-[#C8B6FF]/20">
                  <h3 className="mb-3 text-base font-black">{AISLE_ICON[group.aisle] || "🛒"} {group.aisle}</h3>
                  <div className="space-y-2">
                    {group.items.map((item) => {
                      const key = `${item.aisle}::${item.name}`;
                      return (
                        <label key={key} className={cx("flex items-start gap-3 rounded-2xl bg-white p-3 ring-1 ring-[#C8B6FF]/20 ", checks[key] && "opacity-40")}>
                          <input
                            type="checkbox"
                            checked={Boolean(checks[key])}
                            onChange={(event) => setChecks({ ...checks, [key]: event.target.checked })}
                            className="mt-1 h-5 w-5 accent-[#6FE3C1]"
                          />
                          <div className="min-w-0 flex-1">
                            <div className={cx("font-bold text-[#1F2937]", checks[key] && "line-through")}>{item.name}</div>
                            {item.qty && <div className="text-xs text-[#1F2937]/60">{item.qty}</div>}
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </section>
        )}
      </main>
    </div>
  );
}

