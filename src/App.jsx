import React, { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const AISLES = ["Chilled / Dairy", "Meat & Fish", "Fruit & Veg", "Bakery", "Cupboard", "Sauces", "Herbs & Spices", "Frozen", "Snacks", "Household", "Drinks", "Other"];
const MEAL_CATEGORIES = ["Chicken", "Pork", "Beef", "Vegetarian", "Fish", "Quick tea", "Other"];

// Supabase setup
// 1) Add these to your app environment variables:
//    VITE_SUPABASE_URL=https://your-project.supabase.co
//    VITE_SUPABASE_ANON_KEY=your-anon-public-key
// 2) Create the SQL table shown in the final chat reply.
const SUPABASE_URL = import.meta.env?.VITE_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = import.meta.env?.VITE_SUPABASE_ANON_KEY || "";
const supabase = SUPABASE_URL && SUPABASE_ANON_KEY ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;
const CLOUD_TABLE = "meal_planner_profiles";

const aisleIcon = {
  "Chilled / Dairy": "🥛",
  "Meat & Fish": "🥩",
  "Fruit & Veg": "🥕",
  Bakery: "🥖",
  Cupboard: "🥫",
  Sauces: "🌍",
  "Herbs & Spices": "🧂",
  Frozen: "🧊",
  Snacks: "🍪",
  Household: "🧻",
  Drinks: "🧃",
  Other: "🛒",
};

const categoryIcon = {
  Chicken: "🍗",
  Pork: "🐷",
  Beef: "🥩",
  Vegetarian: "🥦",
  Fish: "🐟",
  "Quick tea": "⚡",
  Other: "🍽️",
};

function ing(name, qty = "", aisle = "Other") {
  return { name, qty, aisle };
}

function cleanMealTitle(name) {
  return String(name || "")
    .replace(/^air fryer /i, "")
    .replace(/^slow cooker /i, "")
    .trim();
}

function recipe(name, category, type, servings, ingredients, method, caloriesPerServing = 0) {
  return { name: cleanMealTitle(name), category, type, servings, ingredients, method, caloriesPerServing };
}

const seedMeals = [
  recipe("Creamy Mustard Sausage & Leek Casserole", "Pork", "Slow cooker", 4, [
    ing("Thick pork sausages", "12", "Meat & Fish"),
    ing("Leeks", "3", "Fruit & Veg"),
    ing("Garlic purée", "1 tbsp", "Fruit & Veg"),
    ing("Chicken stock", "300ml", "Cupboard"),
    ing("Worcestershire sauce", "1 tsp", "Sauces"),
    ing("Dijon mustard", "1 tbsp", "Sauces"),
    ing("Wholegrain mustard", "1 tbsp", "Sauces"),
    ing("Dried oregano", "1 tsp", "Herbs & Spices"),
    ing("Dried parsley", "1 tsp", "Herbs & Spices"),
    ing("Chicken salt", "1 tsp optional", "Herbs & Spices"),
    ing("Nutmeg", "Pinch", "Herbs & Spices"),
    ing("Salt and pepper", "To taste", "Herbs & Spices"),
    ing("Reduced-fat crème fraîche", "2 tbsp", "Chilled / Dairy"),
    ing("Fresh parsley", "To serve", "Fruit & Veg"),
    ing("Mash", "To serve", "Fruit & Veg"),
    ing("Tenderstem broccoli", "To serve", "Fruit & Veg"),
  ], `1. Brown the sausages in a pan, or use the sear function on your slow cooker.
2. Add the sausages to the slow cooker with the leeks, garlic, stock, Worcestershire sauce, mustards, herbs, nutmeg, salt and pepper.
3. Stir everything well.
4. Cook on HIGH for 3–4 hours or LOW for 7–8 hours.
5. Stir through the crème fraîche.
6. Cook for a further 10 minutes until creamy.
7. Serve with mash, tenderstem broccoli and fresh parsley.`),

  recipe("Burgers", "Beef", "Quick tea", 4, [
    ing("Bean or beef burgers", "4", "Meat & Fish"),
    ing("Bread rolls", "4", "Bakery"),
    ing("Chips", "", "Frozen"),
    ing("Baked beans or peas", "", "Cupboard"),
  ], `1. Cook the burgers according to packet instructions.
2. Bake or air fry the chips.
3. Warm the beans or peas.
4. Serve burgers in bread rolls with chips and beans or peas.`, 720),

  recipe("Beef Meatballs in Onion Gravy", "Beef", "Slow cooker", 4, [
    ing("Beef meatballs", "500g", "Meat & Fish"),
    ing("Onions", "2", "Fruit & Veg"),
    ing("Tomato purée", "2-3 tbsp", "Sauces"),
    ing("Worcestershire sauce", "2 tbsp", "Sauces"),
    ing("Dijon mustard", "1 tbsp", "Sauces"),
    ing("Oregano", "1 tsp", "Herbs & Spices"),
    ing("Onion granules", "1 tsp", "Herbs & Spices"),
    ing("Garlic cloves", "3", "Fruit & Veg"),
    ing("Beef stock", "400ml", "Cupboard"),
    ing("Bisto gravy powder", "2 tbsp", "Cupboard"),
    ing("Mash", "To serve", "Fruit & Veg"),
    ing("Greens", "To serve", "Fruit & Veg"),
  ], `1. Brown the meatballs in a pan for a few minutes.
2. Transfer meatballs to the slow cooker.
3. Fry onions in the same pan until softened.
4. Add onions and all remaining sauce ingredients to the slow cooker.
5. Cook on HIGH for 4 hours or LOW for 7–8 hours.
6. Serve with mash and greens.`, 650),

  recipe("Baked Feta Pasta", "Vegetarian", "Air fryer", 3, [
    ing("Feta", "1 block", "Chilled / Dairy"),
    ing("Cherry tomatoes", "1 pack", "Fruit & Veg"),
    ing("Olive oil", "1 tbsp", "Sauces"),
    ing("Oregano", "1 tsp", "Herbs & Spices"),
    ing("Salt and pepper", "To taste", "Herbs & Spices"),
    ing("Pasta", "Cooked, as needed", "Cupboard"),
    ing("Sun-dried tomatoes", "70g", "Cupboard"),
    ing("Fresh basil", "To serve", "Fruit & Veg"),
  ], `1. Place feta and cherry tomatoes in an air fryer-safe dish.
2. Add olive oil, oregano, salt and pepper.
3. Air fry at 180°C for about 20 minutes.
4. Mash the feta and tomatoes into a sauce.
5. Stir in sun-dried tomatoes.
6. Toss with cooked pasta.
7. Top with fresh basil and serve.`, 560),

  recipe("Crispy Beijing Beef", "Beef", "Air fryer", 4, [
    ing("Beef strips", "500g", "Meat & Fish"),
    ing("Onion", "1", "Fruit & Veg"),
    ing("Sugar snap peas", "Handful", "Fruit & Veg"),
    ing("Cornflour", "2 tbsp", "Cupboard"),
    ing("Noodles", "~150g per person", "Cupboard"),
    ing("Red chilli", "1 optional", "Fruit & Veg"),
    ing("Hoisin sauce", "3 tbsp", "Sauces"),
    ing("Sesame oil", "1 tbsp", "Sauces"),
    ing("Honey", "3 tbsp", "Sauces"),
    ing("Sriracha", "3 tbsp", "Sauces"),
    ing("Sweet chilli sauce", "2 tbsp", "Sauces"),
    ing("Garlic cloves / purée", "4 cloves", "Fruit & Veg"),
    ing("Rice vinegar", "1 tbsp", "Sauces"),
  ], `1. Toss beef strips in cornflour until coated.
2. Spray with oil and air fry at 200°C for 10–14 minutes until crispy.
3. Soften onion and sugar snap peas in a pan.
4. Mix hoisin, sesame oil, honey, sriracha, sweet chilli, garlic and rice vinegar.
5. Add crispy beef to the pan.
6. Pour over sauce and toss until glossy and thickened.
7. Serve with noodles and chilli if using.`, 690),

  recipe("Beef, Lentil Base Chilli or Lasagne Batch", "Beef", "Batch cook", 12, [
    ing("Lean beef mince", "1kg", "Meat & Fish"),
    ing("Onions", "2", "Fruit & Veg"),
    ing("Carrots", "3", "Fruit & Veg"),
    ing("Celery", "2 sticks", "Fruit & Veg"),
    ing("Garlic cloves", "4", "Fruit & Veg"),
    ing("Red pepper", "1", "Fruit & Veg"),
    ing("Courgette", "1", "Fruit & Veg"),
    ing("Tomato purée", "2 tbsp", "Sauces"),
    ing("Chopped tomatoes", "2 tins", "Cupboard"),
    ing("Beef stock", "500ml", "Cupboard"),
    ing("Red lentils", "150g", "Cupboard"),
    ing("Paprika", "2 tsp", "Herbs & Spices"),
    ing("Oregano", "2 tsp", "Herbs & Spices"),
    ing("Worcestershire sauce", "1 tbsp", "Sauces"),
    ing("Kidney beans", "1 tin", "Cupboard"),
    ing("Mixed or black beans", "1 tin", "Cupboard"),
    ing("Cumin", "2 tsp", "Herbs & Spices"),
    ing("Chilli powder", "1 tsp", "Herbs & Spices"),
    ing("Lasagne sheets", "As needed", "Cupboard"),
    ing("White/cheese sauce", "600ml", "Sauces"),
    ing("Grated cheese", "100g", "Chilled / Dairy"),
  ], `1. Brown mince in a large pan and drain excess fat.
2. Add onions, carrot, celery and pepper. Cook for 5–7 minutes.
3. Add garlic and courgette.
4. Add tomato purée, chopped tomatoes, stock, lentils, paprika, oregano and Worcestershire sauce.
5. Simmer for 25–30 minutes.
6. Split the mixture into portions.
7. For chilli, add beans, cumin, chilli powder and smoked paprika if using.
8. For lasagne, add Italian herbs, layer with lasagne sheets and white sauce, top with cheese and bake at 180°C for 35–40 minutes.`, 520),

  recipe("Chicken Fajita Rice", "Chicken", "Family favourite", 6, [
    ing("Diced chicken breast", "500g", "Meat & Fish"),
    ing("Cooked basmati rice", "500g", "Cupboard"),
    ing("Bell pepper", "1", "Fruit & Veg"),
    ing("Mushrooms", "200g", "Fruit & Veg"),
    ing("Onion", "1", "Fruit & Veg"),
    ing("Tomato purée", "1 tbsp", "Sauces"),
    ing("Mixed beans", "400g", "Cupboard"),
    ing("Chicken stock", "300ml", "Cupboard"),
    ing("Cheddar cheese", "80g", "Chilled / Dairy"),
    ing("Olive oil", "1 tbsp", "Sauces"),
    ing("Cumin", "1 tsp", "Herbs & Spices"),
    ing("Garlic powder", "1 tsp", "Herbs & Spices"),
    ing("Onion granules", "1 tsp", "Herbs & Spices"),
    ing("Smoked paprika", "1 tsp", "Herbs & Spices"),
    ing("Oregano", "1 tsp", "Herbs & Spices"),
  ], `1. Heat olive oil in a large frying pan.
2. Add chicken and fry until starting to brown.
3. Add mushrooms, pepper, onion and seasoning.
4. Cook for 5–10 minutes until soft and chicken is cooked.
5. Add beans, rice and stock.
6. Stir until rice is coated and heated through.
7. Sprinkle cheese on top, cover and cook on low until melted.`, 540),

  recipe("One-Pan Chicken Korma", "Chicken", "Batch cook", 5, [
    ing("Garlic cloves", "2", "Fruit & Veg"),
    ing("Ginger", "2-3cm piece", "Fruit & Veg"),
    ing("Sweet potatoes", "450g", "Fruit & Veg"),
    ing("Chicken breasts", "2 large", "Meat & Fish"),
    ing("Chicken stock cube", "1 in 400ml water", "Cupboard"),
    ing("Olive oil", "1 tbsp", "Sauces"),
    ing("Frozen diced onions", "115g", "Frozen"),
    ing("Ground turmeric", "1 tsp", "Herbs & Spices"),
    ing("Curry powder", "2 tsp", "Herbs & Spices"),
    ing("Frozen mixed vegetables", "250g", "Frozen"),
    ing("Greek yoghurt", "200g", "Chilled / Dairy"),
    ing("Mango chutney", "1 tbsp", "Sauces"),
    ing("Rice", "To serve", "Cupboard"),
    ing("Naan / flatbreads", "To serve", "Bakery"),
  ], `1. Crush garlic, grate ginger, chop sweet potatoes and chicken.
2. Dissolve stock cube in 400ml hot water.
3. Heat oil in a large pan and cook onions, garlic and ginger for 5 minutes.
4. Stir in turmeric and curry powder for 1 minute.
5. Add chicken, sweet potato and frozen vegetables.
6. Add stock, season, bring to the boil, cover and simmer for 15 minutes.
7. Remove lid and cook 5–10 minutes until chicken is cooked.
8. Stir in yoghurt and mango chutney.
9. Serve with rice and naan, or cool and freeze flat.`, 610),

  recipe("Fish fingers", "Fish", "Quick tea", 4, [
    ing("Fish fingers", "", "Frozen"),
    ing("Chips", "", "Frozen"),
    ing("Peas", "", "Frozen"),
  ], `1. Cook fish fingers according to packet instructions.
2. Cook chips in the oven or air fryer.
3. Heat peas.
4. Serve together as a quick tea.`, 480),

  recipe("Halloumi Fajita Traybake", "Vegetarian", "Traybake", 4, [
    ing("Halloumi cheese", "500g", "Chilled / Dairy"),
    ing("Peppers", "3", "Fruit & Veg"),
    ing("Red onions", "2", "Fruit & Veg"),
    ing("Fajita seasoning", "2 tbsp", "Sauces"),
    ing("Olive oil", "4 tbsp", "Sauces"),
    ing("Tortilla wraps", "4-8", "Bakery"),
    ing("Avocados", "2 optional", "Fruit & Veg"),
    ing("Lime", "1/2 optional", "Fruit & Veg"),
  ], `1. Preheat oven to 180°C.
2. Slice halloumi, peppers and onions into strips.
3. Place everything in a large baking tray.
4. Add fajita seasoning and olive oil.
5. Mix well to coat evenly.
6. Roast for 25–30 minutes, turning halfway.
7. Warm tortilla wraps.
8. Serve in wraps with guacamole if wanted.`),

  recipe("Garlic & Chilli Prawn Linguine", "Fish", "Pasta", 4, [
    ing("Linguine", "300g", "Cupboard"),
    ing("King prawns", "300g", "Meat & Fish"),
    ing("Minced garlic", "2 tbsp", "Fruit & Veg"),
    ing("Fresh red chilli", "1", "Fruit & Veg"),
    ing("Spring onions", "2", "Fruit & Veg"),
    ing("Passata", "500g", "Cupboard"),
    ing("Chilli flakes", "1 tsp", "Herbs & Spices"),
    ing("Salt", "1 tsp", "Herbs & Spices"),
    ing("Black pepper", "1 tsp", "Herbs & Spices"),
    ing("Spinach", "100g", "Fruit & Veg"),
    ing("Chopped parsley", "1/4 cup", "Fruit & Veg"),
    ing("Olive oil", "2 tbsp", "Sauces"),
    ing("Butter", "50g", "Chilled / Dairy"),
  ], `1. Start by cooking the linguine in boiling salted water.
2. While the pasta cooks, heat the olive oil and butter in a pan over a medium-high heat.
3. Add the prawns and cook for 1–2 minutes.
4. Turn the prawns over and cook for another 1–2 minutes.
5. Add the garlic, chilli and spring onions.
6. Move everything around the pan until the prawns are pink and cooked through.
7. Add the passata, chilli flakes, salt and pepper.
8. Stir again, then add the spinach and parsley.
9. Mix well and check the pasta.
10. Drain the pasta and add it to the pan.
11. Toss until everything is fully coated in the sauce.
12. Serve and enjoy.`),

  recipe("Sausage Risotto", "Pork", "Risotto", 4, [
    ing("Olive oil", "1 tbsp", "Sauces"),
    ing("Sausages", "6", "Meat & Fish"),
    ing("Celery", "1 stick", "Fruit & Veg"),
    ing("Yellow bell pepper", "1", "Fruit & Veg"),
    ing("Onion", "1", "Fruit & Veg"),
    ing("Risotto rice", "250g", "Cupboard"),
    ing("Garlic", "2 tsp", "Fruit & Veg"),
    ing("Tomato purée", "2 tbsp", "Sauces"),
    ing("Chicken stock", "1.5 litre", "Cupboard"),
    ing("Parmesan cheese", "2 tbsp", "Chilled / Dairy"),
    ing("Single cream", "75ml", "Chilled / Dairy"),
  ], `1. Heat olive oil in a large frying pan.
2. Remove sausage meat from skins and break into the pan.
3. Cook until browned and crumbly.
4. Add onion, pepper and celery.
5. Cook until softened.
6. Stir in garlic and tomato purée for 1 minute.
7. Add risotto rice and stir to coat.
8. Add stock gradually, stirring until rice is tender.
9. Stir in parmesan and cream.
10. Season and serve.`),

  recipe("Veggie Chilli", "Vegetarian", "Slow cooker", 6, [
    ing("Olive oil", "2 tbsp", "Sauces"),
    ing("Onion", "1 large", "Fruit & Veg"),
    ing("Garlic cloves", "3", "Fruit & Veg"),
    ing("Carrots", "2", "Fruit & Veg"),
    ing("Celery", "2 sticks", "Fruit & Veg"),
    ing("Red pepper", "1", "Fruit & Veg"),
    ing("Yellow pepper", "1", "Fruit & Veg"),
    ing("Courgette", "1", "Fruit & Veg"),
    ing("Sweet potato", "1 small", "Fruit & Veg"),
    ing("Chopped tomatoes", "2 x 400g tins", "Cupboard"),
    ing("Kidney beans", "1 x 400g tin", "Cupboard"),
    ing("Black beans or chickpeas", "1 x 400g tin", "Cupboard"),
    ing("Sweetcorn", "1 x 400g tin", "Cupboard"),
    ing("Tomato purée", "2 tbsp", "Sauces"),
    ing("Vegetable stock cube / stock", "1 cube or 200ml", "Cupboard"),
    ing("Ground cumin", "1 tsp", "Herbs & Spices"),
    ing("Smoked paprika", "1 tsp", "Herbs & Spices"),
    ing("Ground coriander", "1 tsp", "Herbs & Spices"),
    ing("Chilli powder", "1/2-1 tsp", "Herbs & Spices"),
    ing("Dried oregano", "1 tsp", "Herbs & Spices"),
  ], `1. Optional: sauté onion, garlic, carrots and celery in olive oil for 5 minutes.
2. Add all vegetables, beans, sweetcorn, tomatoes, tomato purée, stock and spices to the slow cooker.
3. Stir well.
4. Cook on LOW for 6–8 hours or HIGH for 3–4 hours.
5. Adjust seasoning.
6. Serve with rice or tortilla chips.`),

  recipe("Sticky Pork Rice Bowls", "Pork", "Family favourite", 4, [
    ing("5% pork mince", "500g", "Meat & Fish"),
    ing("Onion", "1/2", "Fruit & Veg"),
    ing("Fresh chilli", "1/2", "Fruit & Veg"),
    ing("Spring onions", "2 plus extra", "Fruit & Veg"),
    ing("Hoisin sauce", "2 tbsp", "Sauces"),
    ing("Sweet chilli sauce", "3 tbsp", "Sauces"),
    ing("Dark soy sauce", "2 tbsp", "Sauces"),
    ing("Ginger purée", "1 tsp", "Fruit & Veg"),
    ing("Garlic purée", "1 tsp", "Fruit & Veg"),
    ing("Sesame oil", "1 tbsp + 1 tbsp salad", "Sauces"),
    ing("Cucumber", "1/2", "Fruit & Veg"),
    ing("Sesame seeds", "1 tbsp", "Cupboard"),
    ing("Light soy sauce", "3 tbsp", "Sauces"),
    ing("Rice vinegar", "1 tbsp", "Sauces"),
    ing("Honey", "2 tbsp", "Sauces"),
    ing("Cooked rice", "600g", "Cupboard"),
  ], `1. Sear onion in oil for 2–3 minutes.
2. Add pork mince and brown.
3. Stir in sauces, ginger, garlic, chilli and spring onions.
4. Cook until sticky.
5. Mix cucumber salad ingredients.
6. Serve rice topped with pork and cucumber salad.`),

  recipe("3 Bean Tacos", "Vegetarian", "Quick tea", 4, [
    ing("Black beans", "1 x 400g can", "Cupboard"),
    ing("Kidney beans", "1 x 400g can", "Cupboard"),
    ing("Cannellini beans", "1 x 400g can", "Cupboard"),
    ing("Chopped tomatoes", "1 x 400g can", "Cupboard"),
    ing("Sweetcorn", "1 x 165g can optional", "Cupboard"),
    ing("Olive oil", "1 tbsp", "Sauces"),
    ing("Onion", "1", "Fruit & Veg"),
    ing("Garlic cloves", "2", "Fruit & Veg"),
    ing("Ground cumin", "1 tsp", "Herbs & Spices"),
    ing("Smoked paprika", "1 tsp", "Herbs & Spices"),
    ing("Chilli powder", "1/2 tsp", "Herbs & Spices"),
    ing("Taco shells or tortillas", "8", "Bakery"),
    ing("Shredded lettuce", "To serve", "Fruit & Veg"),
    ing("Grated cheese", "To serve", "Chilled / Dairy"),
    ing("Sour cream or yoghurt", "To serve", "Chilled / Dairy"),
    ing("Lime wedges", "To serve", "Fruit & Veg"),
  ], `1. Sauté onion in oil.
2. Add garlic and spices.
3. Add beans, tomatoes and sweetcorn.
4. Simmer until thickened.
5. Warm taco shells.
6. Fill and top with lettuce, cheese, sour cream and lime.`),

  recipe("Sausage Bean Casserole", "Pork", "Slow cooker", 4, [
    ing("Sausages", "12", "Meat & Fish"),
    ing("Red pepper", "1", "Fruit & Veg"),
    ing("White onion", "1", "Fruit & Veg"),
    ing("Paprika", "1 tsp", "Herbs & Spices"),
    ing("Dried mixed herbs", "1 tsp", "Herbs & Spices"),
    ing("Tomato purée", "2 tbsp", "Sauces"),
    ing("Garlic purée", "1 tsp", "Fruit & Veg"),
    ing("Worcestershire sauce", "1 tbsp", "Sauces"),
    ing("Baked beans", "2 x 400g tins", "Cupboard"),
    ing("Chicken stock", "150ml", "Cupboard"),
    ing("Salt and pepper", "To taste", "Herbs & Spices"),
    ing("Mash", "To serve", "Fruit & Veg"),
    ing("Fresh parsley", "To serve", "Fruit & Veg"),
  ], `1. Pan-fry the sausages until browned.
2. Transfer the sausages to the slow cooker.
3. Add the red pepper, onion, paprika, mixed herbs, tomato purée, garlic purée, Worcestershire sauce, baked beans, chicken stock, salt and pepper.
4. Stir everything together.
5. Cook on HIGH for 3–4 hours or LOW for 7–8 hours.
6. Serve with creamy mash and fresh parsley.`),

  recipe("Beef Brisket", "Beef", "Slow cooker", 6, [
    ing("Beef brisket joint", "1-1.5kg", "Meat & Fish"),
    ing("Dried basil", "1 tsp", "Herbs & Spices"),
    ing("Worcestershire sauce", "1 tsp", "Sauces"),
    ing("Chopped garlic", "3 tsp", "Fruit & Veg"),
    ing("Beef stock", "600ml", "Cupboard"),
    ing("Gravy granules", "3 tbsp", "Cupboard"),
    ing("Bay leaves", "2", "Herbs & Spices"),
    ing("Rosemary sprig", "1", "Fruit & Veg"),
    ing("Black pepper", "To taste", "Herbs & Spices"),
    ing("Mash", "To serve", "Fruit & Veg"),
    ing("Broccoli", "To serve", "Fruit & Veg"),
  ], `1. Add the brisket joint to the slow cooker.
2. Add dried basil, Worcestershire sauce, garlic, beef stock, gravy granules, bay leaves, rosemary and black pepper.
3. Cook on LOW for at least 8 hours or HIGH for around 6 hours.
4. Remove the lid.
5. Use two forks to pull the beef apart.
6. Serve with creamy mash and broccoli, jacket potatoes, or use the shredded beef for tacos.`),

  recipe("Coconut Cod Curry", "Fish", "Curry", 2, [
    ing("Microwave brown rice", "1 pack", "Cupboard"),
    ing("Carrot", "1", "Fruit & Veg"),
    ing("Courgette", "1", "Fruit & Veg"),
    ing("Cod fillets", "2", "Meat & Fish"),
    ing("Coconut milk", "1 tin", "Cupboard"),
    ing("Red curry paste", "1 tbsp", "Sauces"),
    ing("Spring onions", "2", "Fruit & Veg"),
    ing("Honey", "1 tsp", "Sauces"),
    ing("Chicken stock cube", "1", "Cupboard"),
    ing("Fish sauce", "1 tsp", "Sauces"),
    ing("Soy sauce", "1 tsp", "Sauces"),
    ing("Lime", "To serve", "Fruit & Veg"),
    ing("Crispy chilli oil", "To serve", "Sauces"),
  ], `1. Pat the cod dry and season with a little salt.
2. Add coconut milk, red curry paste, spring onions, honey, stock cube, fish sauce and soy sauce to a blender.
3. Blend until smooth.
4. Julienne the carrot and courgette, or peel them into ribbons.
5. Add the rice to a wide pan.
6. Top the rice with the carrot and courgette.
7. Place the cod fillets on top.
8. Pour the curry sauce over everything.
9. Put the lid on and simmer gently for 8–10 minutes, until the cod is cooked through and flakes easily.
10. Serve with lime and a drizzle of crispy chilli oil.`, 490),

  recipe("Creamy Pesto Pasta with Halloumi", "Vegetarian", "Pasta", 2, [
    ing("Halloumi", "100g", "Chilled / Dairy"),
    ing("Reduced-fat pesto", "1.5 tbsp", "Sauces"),
    ing("Tagliatelle", "160g", "Cupboard"),
    ing("Lightest cream cheese", "40g", "Chilled / Dairy"),
    ing("Skimmed milk", "60ml", "Chilled / Dairy"),
    ing("50% fat cheese", "30g", "Chilled / Dairy"),
    ing("Lemon juice", "1 tsp", "Fruit & Veg"),
    ing("Salt and pepper", "To taste", "Herbs & Spices"),
    ing("Fresh basil", "Handful", "Fruit & Veg"),
    ing("Pine nuts", "10g", "Cupboard"),
  ], `1. Heat a spray of olive oil in a frying pan over a medium-high heat.
2. Add the halloumi slices.
3. Brush the tops of the halloumi with a little pesto.
4. Once golden underneath, flip and brush pesto on the other side.
5. When golden on both sides, set the halloumi aside.
6. Cook the pasta in salty boiling water.
7. In a pan over low-medium heat, mix the cream cheese, milk, remaining pesto and cheese until combined into a sauce.
8. Add lemon juice, salt, pepper and a ladle or two of pasta water.
9. Stir through the cooked drained pasta.
10. Stir in basil and pine nuts.
11. Divide into bowls and top with halloumi.`, 573),
];

const seedEssentials = {
  "Chilled / Dairy": ["Milk", "Butter", "Margarine", "Cheddar cheese", "Mozzarella", "Parmesan", "Yoghurt", "Hummous", "Cream", "Sour cream", "Soft cheese", "Eggs", "Paneer", "Halloumi"],
  "Meat & Fish": ["Chicken breasts", "Chicken thighs", "Beef mince", "Pork mince", "Sausages", "Bacon", "Ham", "Salmon fillets", "White fish", "Fish fingers", "Meatballs", "Burgers", "Whole chicken", "Chorizo"],
  "Fruit & Veg": ["Onions", "Garlic", "Carrots", "Broccoli", "Peppers", "Courgette", "Mushrooms", "Spinach", "Cherry tomatoes", "Cucumber", "Salad", "Potatoes", "Sweet potatoes", "Apples", "Bananas", "Grapes", "Lemons", "Limes", "Pears", "Avocado", "Strawberries"],
  Bakery: ["Bread", "Wraps", "Burger buns", "Hot dog rolls", "Garlic bread", "Crumpets", "Bagels", "Pancakes", "French stick", "Naan bread", "Taco shells"],
  Cupboard: ["Pasta", "Rice", "Noodles", "Tinned tomatoes", "Tomato purée", "Baked beans", "Kidney beans", "Black beans", "Chickpeas", "Sweetcorn", "Tuna", "Coconut milk", "Chicken stock", "Beef stock", "Gravy granules", "Flour", "Cornflour", "Sugar", "Brown sugar", "Breadsticks", "Prawn crackers", "Microwave quinoa"],
  Sauces: ["Olive oil", "Vegetable oil", "Sesame oil", "Soy sauce", "BBQ sauce", "Ketchup", "Mayonnaise", "Mustard", "Honey", "Chilli sauce", "Sweet chilli sauce", "Curry paste", "Fajita seasoning", "Taco seasoning", "Sweet and sour", "Hoisin sauce"],
  "Herbs & Spices": ["Salt", "Black pepper", "Mixed herbs", "Oregano", "Paprika", "Chilli flakes", "Cumin", "Curry powder", "Garlic granules", "Basil", "Fajita mix", "Garam masala", "Turmeric"],
  Frozen: ["Frozen peas", "Frozen sweetcorn", "Frozen broccoli", "Frozen chips", "Frozen berries", "Ice cream", "Frozen mixed vegetables"],
  Snacks: ["Biscuits", "Crisps", "Cereal bars", "Crackers", "Peanut butter", "Jam", "Chocolate", "Nuts", "Cornflakes"],
  Household: ["Toilet roll", "Kitchen roll", "Washing up liquid", "Laundry detergent", "Fabric softener", "Dishwasher tablets", "Bin bags", "Cling film", "Foil", "Toothpaste", "Surface spray", "Hand soap"],
  Drinks: ["Squash", "Cold fusion tea bags", "Tea bags", "Coffee", "Coke", "Lemonade", "Tonic"],
};

const initialPlanner = { Monday: "", Tuesday: "", Wednesday: "Creamy Mustard Sausage & Leek Casserole", Thursday: "", Friday: "Burgers", Saturday: "Beef Meatballs in Onion Gravy", Sunday: "LEFTOVERS" };

function load(key, fallback) {
  try {
    if (typeof localStorage === "undefined") return fallback;
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

function save(key, value) {
  try {
    if (typeof localStorage === "undefined") return;
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

function normalise(text) {
  return String(text || "").trim().toLowerCase();
}

function accountId(email) {
  return normalise(email || "guest").replace(/[^a-z0-9@._-]/g, "");
}

function accountKey(email, key) {
  return `mp_account_${accountId(email)}_${key}`;
}

function loadAccountValue(email, key, fallback) {
  return load(accountKey(email, key), fallback);
}

function saveAccountValue(email, key, value) {
  if (!email) return;
  save(accountKey(email, key), value);
}

function defaultCloudData(profile = null) {
  return {
    profile,
    meals: withMealCategories(seedMeals),
    planner: initialPlanner,
    essential_checks: {},
    shopping_checks: {},
  };
}

function applyCloudDataToLocal(email, data) {
  if (!email || !data) return;
  saveAccountValue(email, "profile", data.profile || null);
  saveAccountValue(email, "meals", data.meals || []);
  saveAccountValue(email, "planner", data.planner || initialPlanner);
  saveAccountValue(email, "essential_checks", data.essential_checks || {});
  saveAccountValue(email, "shopping_checks", data.shopping_checks || {});
}

async function fetchCloudData(userId) {
  if (!supabase || !userId) return null;
  const { data, error } = await supabase.from(CLOUD_TABLE).select("*").eq("user_id", userId).maybeSingle();
  if (error) throw error;
  return data;
}

async function getConfirmedSupabaseUser() {
  if (!supabase) return null;
  const { data, error } = await supabase.auth.getUser();
  if (error) return null;
  return data?.user || null;
}

async function upsertCloudData(userId, email, payload) {
  if (!supabase || !userId) return;

  const confirmedUser = await getConfirmedSupabaseUser();
  if (!confirmedUser?.id || confirmedUser.id !== userId) {
    throw new Error("Not signed in to Supabase yet. Please sign out, then sign in again.");
  }

  const rowPayload = {
    email,
    profile: payload.profile,
    meals: payload.meals,
    planner: payload.planner,
    essential_checks: payload.essential_checks,
    shopping_checks: payload.shopping_checks,
    updated_at: new Date().toISOString(),
  };

  const existing = await fetchCloudData(confirmedUser.id);

  if (existing) {
    const { error } = await supabase
      .from(CLOUD_TABLE)
      .update(rowPayload)
      .eq("user_id", confirmedUser.id);
    if (error) throw error;
    return;
  }

  const { error } = await supabase
    .from(CLOUD_TABLE)
    .insert(rowPayload);
  if (error) throw error;
}

function methodSteps(method) {
  return String(method || "No method added yet.")
    .split("\n")
    .map((step) => step.replace(/^[0-9]+[.)]\s*/, "").trim())
    .filter(Boolean);
}

function inferCategory(meal) {
  const text = normalise(`${meal.name} ${meal.type} ${meal.ingredients?.map((item) => item.name).join(" ")}`);
  if (text.includes("chicken") || text.includes("korma") || text.includes("fajita")) return "Chicken";
  if (text.includes("pork") || text.includes("sausage") || text.includes("bacon") || text.includes("chorizo")) return "Pork";
  if (text.includes("beef") || text.includes("burger") || text.includes("meatball") || text.includes("mince") || text.includes("chilli")) return "Beef";
  if (text.includes("feta") || text.includes("vegetarian") || text.includes("veggie") || text.includes("halloumi") || text.includes("paneer")) return "Vegetarian";
  if (text.includes("fish") || text.includes("salmon") || text.includes("tuna") || text.includes("prawn") || text.includes("cod")) return "Fish";
  if (text.includes("quick")) return "Quick tea";
  return "Other";
}

function withMealCategories(mealList) {
  return mealList.map((meal) => ({ ...meal, name: cleanMealTitle(meal.name), category: meal.category || inferCategory(meal) }));
}

function mergeMeals(savedMeals, builtInMeals) {
  const merged = new Map();
  withMealCategories(builtInMeals).forEach((meal) => merged.set(normalise(meal.name), meal));
  withMealCategories(Array.isArray(savedMeals) ? savedMeals : []).forEach((meal) => {
    if (!meal?.name) return;
    merged.set(normalise(meal.name), { ...merged.get(normalise(meal.name)), ...meal, name: cleanMealTitle(meal.name), category: meal.category || inferCategory(meal) });
  });
  return Array.from(merged.values()).sort((a, b) => a.name.localeCompare(b.name));
}

function groupMealsByCategory(mealList) {
  const grouped = {};
  MEAL_CATEGORIES.forEach((category) => {
    const matches = mealList.filter((meal) => (meal.category || inferCategory(meal)) === category).sort((a, b) => a.name.localeCompare(b.name));
    if (matches.length) grouped[category] = matches;
  });
  return grouped;
}

function mergeShoppingItems(items) {
  const merged = new Map();
  items.forEach((item) => {
    const key = `${normalise(item.name)}::${item.aisle}`;
    if (!merged.has(key)) {
      merged.set(key, { ...item, qtys: item.qty ? [item.qty] : [], sources: [item.source] });
    } else {
      const existing = merged.get(key);
      if (item.qty) existing.qtys.push(item.qty);
      existing.sources.push(item.source);
    }
  });
  return Array.from(merged.values()).map((item) => ({ ...item, qty: [...new Set(item.qtys)].join(" + "), sources: [...new Set(item.sources)] }));
}

function buildShoppingList(planner, meals, essentialChecks) {
  const items = [];
  Object.values(planner).forEach((mealName) => {
    const meal = meals.find((item) => item.name === cleanMealTitle(mealName));
    if (!meal) return;
    meal.ingredients.forEach((item) => items.push({ ...item, source: meal.name }));
  });
  Object.entries(essentialChecks).forEach(([key, checked]) => {
    if (!checked) return;
    const [aisle, name] = key.split("::");
    if (aisle && name) items.push({ name, qty: "", aisle, source: "Essentials" });
  });
  return mergeShoppingItems(items);
}

const COST_LOOKUP = [
  ["chicken", 4.5], ["beef mince", 5], ["beef", 4.5], ["pork mince", 3.5], ["pork", 3.5], ["sausages", 3], ["meatballs", 3.25], ["prawns", 3.5], ["fish", 3],
  ["halloumi", 2.5], ["feta", 1.7], ["cheese", 2], ["yoghurt", 1.2], ["cream", 1.2], ["milk", 1.45], ["eggs", 1.7],
  ["rice", 1.5], ["pasta", 1], ["noodles", 1.2], ["wraps", 1.2], ["bread", 1.2], ["beans", 0.7], ["tomatoes", 0.8], ["stock", 0.4],
  ["onion", 0.25], ["garlic", 0.35], ["carrot", 0.25], ["pepper", 0.55], ["mushroom", 1], ["courgette", 0.6], ["leek", 0.7], ["potato", 1], ["avocado", 0.9], ["lime", 0.3],
  ["oil", 0.25], ["sauce", 1], ["paste", 1], ["spice", 0.25], ["seasoning", 0.5], ["herbs", 0.25], ["chips", 1.5], ["peas", 1], ["mixed vegetables", 1],
];

function estimateItemCost(item) {
  const text = normalise(`${item.name} ${item.qty}`);
  const match = COST_LOOKUP.find(([keyword]) => text.includes(keyword));
  return match ? match[1] : 0.75;
}

function estimateShoppingCost(items) {
  return items.reduce((sum, item) => sum + estimateItemCost(item), 0);
}

function trolleyReadyStatus(items, checks) {
  const total = items.length;
  const ticked = items.filter((item) => checks[`${item.aisle}::${item.name}`]).length;
  if (!total) return "No trolley items yet";
  if (ticked === total) return "Trolley complete";
  return `${total - ticked} items left to shop`;
}

const CALORIE_LOOKUP = [
  ["chicken thighs", 210], ["chicken breast", 165], ["chicken", 165], ["lean beef mince", 180], ["beef mince", 250], ["beef strips", 200], ["beef brisket", 250], ["brisket", 250], ["beef", 220], ["pork mince", 260], ["pork sausages", 300], ["sausages", 300], ["meatballs", 250], ["prawns", 100], ["fish fingers", 220], ["cod", 82], ["fish", 120],
  ["halloumi", 320], ["feta", 265], ["cheddar", 400], ["grated cheese", 400], ["parmesan", 430], ["cream cheese", 160], ["mozzarella", 280], ["yoghurt", 70], ["greek yoghurt", 90], ["cream", 190], ["crème fraîche", 300], ["butter", 720], ["egg", 70], ["milk", 35],
  ["cooked basmati rice", 130], ["microwave brown rice", 360], ["rice", 130], ["tagliatelle", 350], ["pasta", 155], ["linguine", 350], ["noodles", 150], ["risotto rice", 350], ["wrap", 180], ["tortilla", 180], ["bread rolls", 150], ["bread", 100], ["chips", 220],
  ["black beans", 95], ["kidney beans", 100], ["mixed beans", 100], ["cannellini beans", 95], ["baked beans", 80], ["chickpeas", 120], ["red lentils", 350], ["lentils", 115], ["sweetcorn", 85],
  ["chopped tomatoes", 25], ["passata", 33], ["tomato purée", 80], ["tomatoes", 20], ["onion", 40], ["garlic", 5], ["carrot", 35], ["celery", 10], ["pepper", 30], ["mushroom", 22], ["courgette", 20], ["leek", 55], ["sweet potato", 86], ["potato", 80], ["peas", 80], ["spinach", 23], ["avocado", 160], ["pine nuts", 670],
  ["olive oil", 120], ["sesame oil", 120], ["oil", 120], ["honey", 65], ["hoisin", 35], ["sweet chilli", 40], ["sriracha", 15], ["soy sauce", 10], ["worcestershire", 10], ["mustard", 10], ["stock", 10], ["cornflour", 30], ["flour", 35], ["gravy", 35], ["pesto", 80], ["curry paste", 50], ["fajita seasoning", 25], ["coconut milk", 400],
];

function caloriesForIngredientName(name) {
  const text = normalise(name);
  const match = CALORIE_LOOKUP.find(([keyword]) => text.includes(keyword));
  return match ? match[1] : 25;
}

function firstNumber(text) {
  const match = String(text || "").match(/[0-9]+(?:\.[0-9]+)?/);
  return match ? Number(match[0]) : 0;
}

function estimateIngredientCalories(item) {
  const name = normalise(item.name);
  const qty = normalise(item.qty);
  if (!qty || qty.includes("to serve") || qty.includes("optional") || qty.includes("as needed") || qty.includes("to taste") || qty.includes("garnish")) return 0;
  const kcal = caloriesForIngredientName(name);
  const amount = firstNumber(qty) || 1;
  if (qty.includes("kg")) return kcal * amount * 10;
  if (qty.includes("g")) return kcal * (amount / 100);
  if (qty.includes("ml")) return kcal * (amount / 100);
  if (qty.includes("litre") || qty.includes("litres")) return kcal * amount * 10;
  if (qty.includes("tbsp")) return name.includes("oil") ? amount * 120 : kcal * amount * 0.15;
  if (qty.includes("tsp")) return name.includes("oil") ? amount * 40 : kcal * amount * 0.05;
  if (qty.includes("tin") || qty.includes("can")) return kcal * amount * 4;
  if (qty.includes("pack")) return kcal * 2.5;
  if (qty.includes("block")) return kcal * 2;
  if (qty.includes("handful")) return kcal * 0.3;
  if (name.includes("egg")) return amount * 70;
  if (name.includes("wrap") || name.includes("tortilla")) return amount * 180;
  if (name.includes("bread roll")) return amount * 150;
  if (name.includes("sausage")) return amount * 180;
  return kcal * amount;
}

function estimateMealCalories(meal) {
  if (!meal) return 0;
  const total = (meal.ingredients || []).reduce((sum, item) => sum + estimateIngredientCalories(item), 0);
  const servings = Number(meal.servings) || 1;
  return Math.round(total / servings);
}

function displayMealCalories(meal) {
  if (!meal) return 0;
  return Number(meal.caloriesPerServing) || estimateMealCalories(meal);
}

function nextExpandedDay(currentDay, clickedDay) {
  return currentDay === clickedDay ? null : clickedDay;
}

function runMealPlannerTests() {
  const testMeals = [
    recipe("Pasta night", "Vegetarian", "Test", 4, [ing("Pasta", "500g", "Cupboard"), ing("Tomatoes", "1 tin", "Cupboard")], `1. Cook.`),
    recipe("Tomato soup", "Vegetarian", "Test", 4, [ing("tomatoes", "2 tins", "Cupboard")], `1. Cook.`),
  ];
  const result = buildShoppingList({ Monday: "Pasta night", Tuesday: "Tomato soup" }, testMeals, { "Cupboard::Pasta": true, "Fruit & Veg::Apples": false });
  const pasta = result.find((item) => normalise(item.name) === "pasta");
  const tomatoes = result.find((item) => normalise(item.name) === "tomatoes");
  const apples = result.find((item) => normalise(item.name) === "apples");
  console.assert(pasta?.sources.includes("Essentials"), "Test failed: checked essentials should appear in shopping list");
  console.assert(tomatoes?.qty === "1 tin + 2 tins", "Test failed: duplicate ingredients should merge and keep unique quantities");
  console.assert(!apples, "Test failed: unchecked essentials should not appear in shopping list");
  console.assert(nextExpandedDay(null, "Monday") === "Monday", "Test failed: clicking closed day should open it");
  console.assert(nextExpandedDay("Monday", "Monday") === null, "Test failed: clicking open day should close it");
  console.assert(typeof seedMeals[0].method === "string" && seedMeals[0].method.includes("1."), "Test failed: methods should be readable strings");
  console.assert(cleanMealTitle("Air Fryer Baked Feta Pasta") === "Baked Feta Pasta", "Test failed: Air Fryer should be removed from meal titles");
  console.assert(cleanMealTitle("Slow Cooker Butter Chicken") === "Butter Chicken", "Test failed: Slow Cooker should be removed from meal titles");
  console.assert(methodSteps("1. Chop veg\n2. Cook it").length === 2, "Test failed: method should become bullet steps");
  console.assert(estimateShoppingCost([ing("Chicken breasts", "500g", "Meat & Fish")]) > 0, "Test failed: shopping cost should estimate above zero");
  console.assert(trolleyReadyStatus([ing("Pasta", "500g", "Cupboard")], {}) === "1 items left to shop", "Test failed: trolley ready status should count unticked items");
  console.assert(trolleyReadyStatus([ing("Pasta", "500g", "Cupboard")], { "Cupboard::Pasta": true }) === "Trolley complete", "Test failed: trolley ready status should show complete when all items are ticked");
  console.assert(estimateIngredientCalories(ing("Chicken breasts", "500g", "Meat & Fish")) === 825, "Test failed: 500g chicken breast should estimate to 825 kcal");
  console.assert(estimateMealCalories(recipe("Test chicken", "Chicken", "Test", 3, [ing("Chicken breasts", "300g", "Meat & Fish")], "1. Cook.")) === 165, "Test failed: meal calories should divide total by servings");
  console.assert(!seedMeals.some((meal) => ["Butter Chicken", "Chicken Enchiladas", "Sweet Potato Black Bean Burgers", "Carrot Soup", "Spicy Butternut Squash Soup", "Parsnip Soup", "Chicken Tikka with Mint"].includes(meal.name)), "Test failed: deleted meals should not be in seedMeals");
  console.assert(CLOUD_TABLE === "meal_planner_profiles", "Test failed: cloud table name should match Supabase table");
  console.assert(defaultCloudData({ name: "Test", email: "test@example.com" }).planner.Wednesday === "Creamy Mustard Sausage & Leek Casserole", "Test failed: default cloud data should include starter planner");
}

function Icon({ children }) {
  return <span className="mr-2 inline-flex h-5 w-5 items-center justify-center text-base leading-none">{children}</span>;
}

function pillClass(active) {
  return `rounded-full px-4 py-2 text-sm font-semibold transition ${active ? "bg-zinc-950 text-white" : "bg-white text-zinc-700 shadow-sm ring-1 ring-zinc-200"}`;
}

function MethodList({ method, small = false }) {
  return (
    <ul className={`${small ? "text-xs" : "text-sm"} list-disc space-y-1 pl-5 leading-relaxed text-zinc-700`}>
      {methodSteps(method).map((step, index) => <li key={`${step}-${index}`}>{step}</li>)}
    </ul>
  );
}

export default function MealPlannerApp() {
  const [tab, setTab] = useState("planner");
  const [profile, setProfile] = useState(() => (supabase ? null : load("mp_profile", null)));
  const [signup, setSignup] = useState({ name: "", email: "", password: "" });
  const [authMode, setAuthMode] = useState("signin");
  const [authUser, setAuthUser] = useState(null);
  const [syncStatus, setSyncStatus] = useState(supabase ? "Supabase ready" : "Local-only mode");
  const [isSyncing, setIsSyncing] = useState(false);
  const [meals, setMeals] = useState(() => mergeMeals(!supabase && profile?.email ? loadAccountValue(profile.email, "meals", []) : [], seedMeals));
  const [planner, setPlanner] = useState(() => (!supabase && profile?.email ? loadAccountValue(profile.email, "planner", initialPlanner) : initialPlanner));
  const [essentialChecks, setEssentialChecks] = useState(() => (!supabase && profile?.email ? loadAccountValue(profile.email, "essential_checks", {}) : {}));
  const [shoppingChecks, setShoppingChecks] = useState(() => (!supabase && profile?.email ? loadAccountValue(profile.email, "shopping_checks", {}) : {}));
  const [query, setQuery] = useState("");
  const [newMeal, setNewMeal] = useState({ name: "", type: "", category: "Chicken", caloriesPerServing: "", servings: "4", ingredient: "", qty: "", aisle: "Fruit & Veg", method: "" });
  const [newEssential, setNewEssential] = useState({ name: "", aisle: "Fruit & Veg" });
  const [expandedDay, setExpandedDay] = useState(null);

  useEffect(() => {
    if (!supabase) save("mp_profile", profile);
  }, [profile]);
  useEffect(() => saveAccountValue(profile?.email, "meals", meals), [profile?.email, meals]);
  useEffect(() => saveAccountValue(profile?.email, "planner", planner), [profile?.email, planner]);
  useEffect(() => saveAccountValue(profile?.email, "essential_checks", essentialChecks), [profile?.email, essentialChecks]);
  useEffect(() => saveAccountValue(profile?.email, "shopping_checks", shoppingChecks), [profile?.email, shoppingChecks]);
  useEffect(() => runMealPlannerTests(), []);

  useEffect(() => {
    if (!supabase) return;
    let mounted = true;
    supabase.auth.getSession().then(async ({ data }) => {
      if (!mounted) return;
      const user = data.session?.user || null;
      setAuthUser(user);
      if (user?.email) {
        await loadSupabaseAccount(user);
      } else {
        setAuthUser(null);
        setProfile(null);
        setMeals(withMealCategories(seedMeals));
        setPlanner(initialPlanner);
        setEssentialChecks({});
        setShoppingChecks({});
        setSyncStatus("Please sign in to sync with Supabase");
      }
    });
    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const user = session?.user || null;
      setAuthUser(user);
      if (user?.email) await loadSupabaseAccount(user);
      if (!user) {
        setAuthUser(null);
        setProfile(null);
        setMeals(withMealCategories(seedMeals));
        setPlanner(initialPlanner);
        setEssentialChecks({});
        setShoppingChecks({});
        setSyncStatus("Signed out");
      }
    });
    return () => {
      mounted = false;
      listener?.subscription?.unsubscribe?.();
    };
  }, []);

  useEffect(() => {
    if (!supabase || !authUser?.id || !profile?.email) return;
    const timer = setTimeout(() => saveSupabaseAccount(), 500);
    return () => clearTimeout(timer);
  }, [authUser?.id, profile?.email, meals, planner, essentialChecks, shoppingChecks]);

  const mealGroups = useMemo(() => groupMealsByCategory(meals), [meals]);
  const shoppingList = useMemo(() => buildShoppingList(planner, meals, essentialChecks), [planner, meals, essentialChecks]);
  const estimatedShoppingCost = useMemo(() => estimateShoppingCost(shoppingList), [shoppingList]);
  const trolleyStatus = useMemo(() => trolleyReadyStatus(shoppingList, shoppingChecks), [shoppingList, shoppingChecks]);
  const groupedShopping = useMemo(() => AISLES.reduce((acc, aisle) => {
    const matches = shoppingList.filter((item) => item.aisle === aisle);
    if (matches.length) acc[aisle] = matches.sort((a, b) => a.name.localeCompare(b.name));
    return acc;
  }, {}), [shoppingList]);
  const filteredMeals = useMemo(() => meals.filter((meal) => normalise(meal.name).includes(normalise(query)) || normalise(meal.type).includes(normalise(query)) || normalise(meal.category).includes(normalise(query))), [meals, query]);
  const dailyCalories = useMemo(() => DAYS.reduce((acc, day) => {
    const meal = meals.find((item) => item.name === cleanMealTitle(planner[day]));
    acc[day] = displayMealCalories(meal);
    return acc;
  }, {}), [meals, planner]);
  const weeklyCalories = useMemo(() => Object.values(dailyCalories).reduce((sum, kcal) => sum + Number(kcal || 0), 0), [dailyCalories]);

  function getMealByName(name) {
    return meals.find((meal) => meal.name === cleanMealTitle(name));
  }

  function mealIngredients(mealName) {
    return getMealByName(mealName)?.ingredients || [];
  }

  function mealMethod(mealName) {
    return getMealByName(mealName)?.method || "No method added yet.";
  }

  function toggleDay(day) {
    setExpandedDay((currentDay) => nextExpandedDay(currentDay, day));
  }

  function resetWeek() {
    setPlanner(DAYS.reduce((acc, day) => ({ ...acc, [day]: "" }), {}));
    setShoppingChecks({});
    setExpandedDay(null);
  }

  function resetEverything() {
    setMeals(withMealCategories(seedMeals));
    setPlanner(initialPlanner);
    setEssentialChecks({});
    setShoppingChecks({});
    setExpandedDay(null);
  }

  async function loadSupabaseAccount(user) {
    if (!supabase || !user?.id) return;
    try {
      setIsSyncing(true);
      setSyncStatus("Loading cloud planner...");
      const confirmedUser = await getConfirmedSupabaseUser();
      if (!confirmedUser?.id || confirmedUser.id !== user.id) {
        setProfile(null);
        setSyncStatus("Please sign in again to start cloud sync.");
        return;
      }
      const cloud = await fetchCloudData(confirmedUser.id);
      const email = user.email.toLowerCase();
      const fallbackProfile = { name: user.user_metadata?.name || email.split("@")[0], email, joinedAt: user.created_at || new Date().toISOString() };
      const nextData = cloud || defaultCloudData(fallbackProfile);
      const nextProfile = nextData.profile || fallbackProfile;

      setProfile(nextProfile);
      setMeals(mergeMeals(nextData.meals || [], seedMeals));
      setPlanner(nextData.planner || initialPlanner);
      setEssentialChecks(nextData.essential_checks || {});
      setShoppingChecks(nextData.shopping_checks || {});
      applyCloudDataToLocal(email, nextData);

      if (!cloud) await upsertCloudData(confirmedUser.id, email, { ...nextData, profile: nextProfile });
      setSyncStatus("Synced with Supabase");
    } catch (error) {
      console.error(error);
      setSyncStatus(`Cloud sync error: ${error.message}`);
    } finally {
      setIsSyncing(false);
    }
  }

  async function saveSupabaseAccount() {
    if (!supabase || !authUser?.id || !profile?.email) return;
    try {
      const confirmedUser = await getConfirmedSupabaseUser();
      if (!confirmedUser?.id || confirmedUser.id !== authUser.id) {
        setSyncStatus("Please sign in again to save to Supabase.");
        return;
      }
      setSyncStatus("Saving to Supabase...");
      await upsertCloudData(confirmedUser.id, profile.email, {
        profile,
        meals,
        planner,
        essential_checks: essentialChecks,
        shopping_checks: shoppingChecks,
      });
      setSyncStatus("Synced with Supabase");
    } catch (error) {
      console.error(error);
      setSyncStatus(`Cloud save error: ${error.message}`);
    }
  }

  async function completeSignup() {
    if (!signup.email.trim()) return;
    const email = signup.email.trim().toLowerCase();

    if (supabase) {
      if (!signup.password.trim() || signup.password.length < 6) {
        setSyncStatus("Enter a password of at least 6 characters.");
        return;
      }
      try {
        setIsSyncing(true);
        setSyncStatus(authMode === "signup" ? "Creating account..." : "Signing in...");

        let data;
        let error;

        if (authMode === "signup") {
          const signUpResult = await supabase.auth.signUp({
            email,
            password: signup.password,
            options: { data: { name: signup.name.trim() || email.split("@")[0] } },
          });
          data = signUpResult.data;
          error = signUpResult.error;
        } else {
          const signInResult = await supabase.auth.signInWithPassword({ email, password: signup.password });
          data = signInResult.data;
          error = signInResult.error;
        }

        if (error) throw error;

        const sessionUser = data.session?.user || null;
        const user = sessionUser || data.user;

        if (sessionUser) {
          setAuthUser(sessionUser);
          await loadSupabaseAccount(sessionUser);
          setSignup({ name: "", email: "", password: "" });
          setTab("planner");
        } else if (user && authMode === "signup") {
          setProfile(null);
          setAuthMode("signin");
          setSyncStatus("Account created. Check your email to confirm it, then sign in.");
        } else {
          setProfile(null);
          setSyncStatus("No active session returned. Check email confirmation settings, then try again.");
        }
      } catch (error) {
        console.error(error);
        setSyncStatus(`${authMode === "signup" ? "Create account" : "Sign in"} error: ${error.message}`);
      } finally {
        setIsSyncing(false);
      }
      return;
    }

    const existingProfile = loadAccountValue(email, "profile", null);
    const nextProfile = existingProfile || { name: signup.name.trim() || email.split("@")[0], email, joinedAt: new Date().toISOString() };
    saveAccountValue(email, "profile", nextProfile);
    setProfile(nextProfile);
    setMeals(mergeMeals(loadAccountValue(email, "meals", []), seedMeals));
    setPlanner(loadAccountValue(email, "planner", initialPlanner));
    setEssentialChecks(loadAccountValue(email, "essential_checks", {}));
    setShoppingChecks(loadAccountValue(email, "shopping_checks", {}));
    setExpandedDay(null);
    setTab("planner");
  }

  async function signOut() {
    if (supabase) await supabase.auth.signOut();
    try {
      localStorage.removeItem("mp_profile");
    } catch {}
    setAuthUser(null);
    setProfile(null);
    setSignup({ name: "", email: "", password: "" });
    setMeals(withMealCategories(seedMeals));
    setPlanner(initialPlanner);
    setEssentialChecks({});
    setShoppingChecks({});
    setSyncStatus(supabase ? "Signed out" : "Local-only mode");
    setTab("planner");
  }

  function addMeal() {
    if (!newMeal.name.trim()) return;
    const ingredient = newMeal.ingredient.trim() ? [ing(newMeal.ingredient.trim(), newMeal.qty.trim(), newMeal.aisle)] : [];
    setMeals((prev) => [...prev, recipe(newMeal.name.trim(), newMeal.category, newMeal.type.trim() || "New", Number(newMeal.servings) || 4, ingredient, newMeal.method.trim() || "No method added yet.", Number(newMeal.caloriesPerServing) || 0)]);
    setNewMeal({ name: "", type: "", category: "Chicken", caloriesPerServing: "", servings: "4", ingredient: "", qty: "", aisle: "Fruit & Veg", method: "" });
  }

  function addIngredient(mealName) {
    const ingredientName = prompt("Ingredient name");
    if (!ingredientName) return;
    const qty = prompt("Quantity", "") || "";
    const aisle = prompt(`Aisle: ${AISLES.join(", ")}`, "Fruit & Veg") || "Other";
    setMeals((prev) => prev.map((meal) => (meal.name === mealName ? { ...meal, ingredients: [...meal.ingredients, ing(ingredientName, qty, AISLES.includes(aisle) ? aisle : "Other")] } : meal)));
  }

  function deleteMeal(name) {
    setMeals((prev) => prev.filter((meal) => meal.name !== name));
    setPlanner((prev) => Object.fromEntries(Object.entries(prev).map(([day, meal]) => [day, cleanMealTitle(meal) === cleanMealTitle(name) ? "" : meal])));
  }

  function addEssential() {
    if (!newEssential.name.trim()) return;
    const key = `${newEssential.aisle}::${newEssential.name.trim()}`;
    setEssentialChecks((prev) => ({ ...prev, [key]: true }));
    setNewEssential({ name: "", aisle: "Fruit & Veg" });
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-emerald-50 text-zinc-900">
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
        <header className="mb-6 rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-zinc-100">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">Mobile weekly meal planner</p>
              <h1 className="mt-1 text-3xl font-black tracking-tight sm:text-4xl">Pick meals, auto-build your shopping list.</h1>
              <p className="mt-2 max-w-2xl text-sm text-zinc-600">{profile ? `Welcome back, ${profile.name.split(" ")[0]}.` : "Create a free account first to unlock the planner."}</p>
              <p className="mt-2 inline-flex rounded-full bg-zinc-50 px-3 py-1 text-xs font-bold text-zinc-500 ring-1 ring-zinc-100">{isSyncing ? "Syncing..." : syncStatus}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button onClick={() => setTab("me")} className="inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-sm"><Icon>👤</Icon>{profile ? profile.name.split(" ")[0] : "Me"}</button>
              {profile && <button onClick={resetEverything} className="inline-flex items-center justify-center rounded-2xl bg-zinc-950 px-4 py-3 text-sm font-bold text-white shadow-sm"><Icon>↻</Icon>Reset demo</button>}
            </div>
          </div>
        </header>

        {profile && (
          <nav className="mb-5 flex gap-2 overflow-x-auto pb-1">
            <button onClick={() => setTab("planner")} className={pillClass(tab === "planner")}><Icon>📅</Icon>Planner</button>
            <button onClick={() => setTab("essentials")} className={pillClass(tab === "essentials")}><Icon>✅</Icon>Essentials</button>
            <button onClick={() => setTab("shopping")} className={pillClass(tab === "shopping")}><Icon>🛒</Icon>Shopping</button>
            <button onClick={() => setTab("meals")} className={pillClass(tab === "meals")}><Icon>🗂️</Icon>Meal database</button>
          </nav>
        )}

        {!profile && tab !== "me" && (
          <section className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-zinc-100">
            <div className="mx-auto max-w-xl text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-100 text-3xl">👋</div>
              <h2 className="text-2xl font-black">Sign in to your meal planner</h2>
              <p className="mt-2 text-sm text-zinc-600">Each email address gets its own Supabase account and cloud-saved planner. If Supabase keys are missing, it falls back to this browser only.</p>
              <div className="mt-5 grid gap-3 text-left">
                <div className="mb-2 grid gap-2 rounded-2xl bg-zinc-50 p-2 ring-1 ring-zinc-200 sm:grid-cols-2">
                  <button type="button" onClick={() => { setAuthMode("signin"); setSyncStatus("Sign in mode selected"); }} className={`rounded-xl px-3 py-3 text-sm font-black ${authMode === "signin" ? "bg-white text-emerald-700 shadow-sm ring-1 ring-emerald-100" : "bg-transparent text-zinc-500"}`}>Sign in to existing account</button>
                  <button type="button" onClick={() => { setAuthMode("signup"); setSyncStatus("Create account mode selected"); }} className={`rounded-xl px-3 py-3 text-sm font-black ${authMode === "signup" ? "bg-white text-emerald-700 shadow-sm ring-1 ring-emerald-100" : "bg-transparent text-zinc-500"}`}>Create new account</button>
                </div>
                <p className="rounded-2xl bg-white px-3 py-2 text-center text-xs font-bold text-zinc-500 ring-1 ring-zinc-100">{authMode === "signup" ? "Create account mode: enter your name, email and password." : "Sign in mode: use an existing confirmed account."}</p>
                {authMode === "signup" && <><label className="text-sm font-bold">Name</label>
                <input value={signup.name} onChange={(e) => setSignup({ ...signup, name: e.target.value })} placeholder="e.g. Megan" className="rounded-2xl bg-zinc-50 px-4 py-3 text-sm ring-1 ring-zinc-200" /></>}
                <label className="text-sm font-bold">Email</label>
                <input value={signup.email} onChange={(e) => setSignup({ ...signup, email: e.target.value })} placeholder="you@example.com" type="email" className="rounded-2xl bg-zinc-50 px-4 py-3 text-sm ring-1 ring-zinc-200" />
                <label className="text-sm font-bold">Password</label>
                <input value={signup.password} onChange={(e) => setSignup({ ...signup, password: e.target.value })} placeholder="At least 6 characters" type="password" className="rounded-2xl bg-zinc-50 px-4 py-3 text-sm ring-1 ring-zinc-200" />
                <button onClick={completeSignup} disabled={!signup.email.trim() || (supabase && signup.password.length < 6)} className="mt-2 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-40">🔐 {authMode === "signup" ? "Create account" : "Sign in and start planning"}</button>
                <button type="button" onClick={() => { setAuthMode(authMode === "signup" ? "signin" : "signup"); setSyncStatus(authMode === "signup" ? "Sign in mode selected" : "Create account mode selected"); }} className="rounded-2xl bg-zinc-100 px-4 py-3 text-sm font-bold text-zinc-700">
                  {authMode === "signup" ? "Already have an account? Sign in" : "Need an account? Create one"}
                </button>
                <p className="text-center text-xs font-bold text-zinc-500">{syncStatus}</p>
              </div>
              <p className="mt-4 text-xs text-zinc-500">Supabase mode uses real email/password auth and cloud data. Local-only mode appears when your Supabase environment variables are missing.</p>
            </div>
          </section>
        )}

        {tab === "me" && (
          <section className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-zinc-100">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">My account</p>
                <h2 className="mt-1 text-2xl font-black">{profile ? `Hi, ${profile.name}` : "Sign in to continue"}</h2>
                <p className="mt-2 max-w-xl text-sm text-zinc-600">This is where profile details, subscription settings, saved preferences and account tools would live.</p>
              </div>
              {profile && <button onClick={signOut} className="inline-flex items-center justify-center rounded-2xl bg-zinc-100 px-4 py-3 text-sm font-bold text-zinc-800"><Icon>🚪</Icon>Sign out</button>}
            </div>

            {!profile ? (
              <div className="mt-5 grid gap-3 rounded-3xl bg-emerald-50 p-4 ring-1 ring-emerald-100">
                <div className="mb-2 grid gap-2 rounded-2xl bg-white p-2 ring-1 ring-emerald-100 sm:grid-cols-2">
                  <button type="button" onClick={() => { setAuthMode("signin"); setSyncStatus("Sign in mode selected"); }} className={`rounded-xl px-3 py-3 text-sm font-black ${authMode === "signin" ? "bg-emerald-100 text-emerald-800" : "text-zinc-500"}`}>Sign in to existing account</button>
                  <button type="button" onClick={() => { setAuthMode("signup"); setSyncStatus("Create account mode selected"); }} className={`rounded-xl px-3 py-3 text-sm font-black ${authMode === "signup" ? "bg-emerald-100 text-emerald-800" : "text-zinc-500"}`}>Create new account</button>
                </div>
                <p className="rounded-2xl bg-white px-3 py-2 text-center text-xs font-bold text-zinc-500 ring-1 ring-emerald-100">{authMode === "signup" ? "Create account mode: enter your name, email and password." : "Sign in mode: use an existing confirmed account."}</p>
                {authMode === "signup" && <><label className="text-sm font-bold">Name</label>
                <input value={signup.name} onChange={(e) => setSignup({ ...signup, name: e.target.value })} placeholder="e.g. Megan" className="rounded-2xl bg-white px-4 py-3 text-sm ring-1 ring-emerald-100" /></>}
                <label className="text-sm font-bold">Email</label>
                <input value={signup.email} onChange={(e) => setSignup({ ...signup, email: e.target.value })} placeholder="you@example.com" type="email" className="rounded-2xl bg-white px-4 py-3 text-sm ring-1 ring-emerald-100" />
                <label className="text-sm font-bold">Password</label>
                <input value={signup.password} onChange={(e) => setSignup({ ...signup, password: e.target.value })} placeholder="At least 6 characters" type="password" className="rounded-2xl bg-white px-4 py-3 text-sm ring-1 ring-emerald-100" />
                <button onClick={completeSignup} disabled={!signup.email.trim() || (supabase && signup.password.length < 6)} className="rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-40">{authMode === "signup" ? "Create account" : "Sign in"}</button>
                <button type="button" onClick={() => { setAuthMode(authMode === "signup" ? "signin" : "signup"); setSyncStatus(authMode === "signup" ? "Sign in mode selected" : "Create account mode selected"); }} className="rounded-2xl bg-white px-4 py-3 text-sm font-bold text-zinc-700 ring-1 ring-emerald-100">
                  {authMode === "signup" ? "Already have an account? Sign in" : "Need an account? Create one"}
                </button>
                <p className="text-center text-xs font-bold text-zinc-500">{syncStatus}</p>
              </div>
            ) : (
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="rounded-3xl bg-zinc-50 p-4 ring-1 ring-zinc-100"><p className="text-sm text-zinc-500">Name</p><p className="font-black">{profile.name}</p></div>
                <div className="rounded-3xl bg-zinc-50 p-4 ring-1 ring-zinc-100"><p className="text-sm text-zinc-500">Email</p><p className="break-all font-black">{profile.email}</p></div>
                <div className="rounded-3xl bg-zinc-50 p-4 ring-1 ring-zinc-100"><p className="text-sm text-zinc-500">Plan</p><p className="font-black">Free prototype</p></div>
              </div>
            )}
          </section>
        )}

        {profile && tab === "planner" && (
          <section className="grid gap-4">
            <div className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-zinc-100">
              <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-xl font-black">🍽 Weekly food planner</h2>
                  <p className="text-sm text-zinc-600">Choose meals and the shopping list updates automatically. Tap a day to show or hide its ingredients.</p>
                </div>
                <div className="flex flex-col items-start gap-2 sm:items-end">
                  <div className="rounded-2xl bg-emerald-50 px-4 py-2 text-left ring-1 ring-emerald-100 sm:text-right">
                    <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">Weekly planned calories</p>
                    <p className="text-lg font-black">{weeklyCalories || 0} kcal</p>
                    <p className="text-xs text-zinc-500">planned kcal per serving total</p>
                  </div>
                  <button onClick={resetWeek} className="rounded-2xl bg-orange-100 px-4 py-2 text-sm font-bold text-orange-900">RESET week</button>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {DAYS.map((day) => (
                  <div key={day} className={`rounded-3xl bg-zinc-50 p-4 ring-1 transition ${expandedDay === day ? "ring-emerald-200 shadow-sm" : "ring-zinc-100"}`}>
                    <button type="button" onClick={() => toggleDay(day)} className="mb-2 flex w-full items-center justify-between text-left text-sm font-black">
                      <span>{day}</span>
                      <span className="rounded-full bg-white px-2 py-1 text-xs font-bold text-zinc-500 shadow-sm ring-1 ring-zinc-100">{expandedDay === day ? "Hide" : "Show"}</span>
                    </button>
                    <select value={planner[day] || ""} onChange={(e) => setPlanner({ ...planner, [day]: e.target.value })} className="w-full rounded-2xl border-0 bg-white px-3 py-3 text-sm shadow-sm ring-1 ring-zinc-200">
                      <option value="">No meal selected</option>
                      <option value="LEFTOVERS">LEFTOVERS</option>
                      {Object.entries(mealGroups).map(([category, categoryMeals]) => (
                        <optgroup key={category} label={`${categoryIcon[category] || "🍽️"} ${category}`}>
                          {categoryMeals.map((meal) => <option key={meal.name} value={meal.name}>{meal.name}</option>)}
                        </optgroup>
                      ))}
                    </select>
                    <div className="mt-2 rounded-xl bg-white px-3 py-2 text-sm shadow-sm ring-1 ring-zinc-100">
                      <button type="button" onClick={() => toggleDay(day)} className="flex w-full items-center justify-between text-left">
                        <span className="font-bold text-emerald-700">{getMealByName(planner[day]) ? `Serves ${getMealByName(planner[day])?.servings || 4} · ${displayMealCalories(getMealByName(planner[day])) || 0} kcal/serving` : "No meal details"}</span>
                        <span className="text-xs font-bold text-zinc-400">{expandedDay === day ? "▲" : "▼"}</span>
                      </button>
                      {expandedDay === day && planner[day] && planner[day] !== "LEFTOVERS" && (
                        <div className="mt-2 border-t border-zinc-100 pt-2">
                          <p className="mb-1 text-xs font-black uppercase tracking-wide text-zinc-500">Ingredients</p>
                          <ul className="space-y-1 text-xs leading-snug text-zinc-600">
                            {mealIngredients(planner[day]).map((item, index) => (
                              <li key={`${item.name}-${index}`} className="grid grid-cols-[1fr_auto] items-center gap-2 rounded-lg bg-zinc-50 px-2 py-1">
                                <span>{item.name}</span>
                                <span className="shrink-0 rounded-full bg-white px-2 py-0.5 text-xs font-black text-zinc-700 ring-1 ring-zinc-100">{item.qty || "Qty not set"}</span>
                              </li>
                            ))}
                          </ul>
                          <div className="mt-3 rounded-2xl bg-orange-50 p-3 ring-1 ring-orange-100">
                            <p className="mb-1 text-xs font-black uppercase tracking-wide text-orange-800">Method</p>
                            <MethodList method={mealMethod(planner[day])} small />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {profile && tab === "shopping" && (
          <section className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-zinc-100">
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="mb-2 inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-black uppercase tracking-wide text-emerald-800 ring-1 ring-emerald-200">🛒 Trolley live-ready</div>
                <h2 className="text-xl font-black">Weekly shop</h2>
                <p className="text-sm text-zinc-600">Aisle-grouped, tick-off friendly and ready to use around the shop.</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="rounded-full bg-zinc-100 px-3 py-1 text-sm font-bold text-zinc-700">{trolleyStatus}</span>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-black text-emerald-700 ring-1 ring-emerald-100">Estimated cost: £{estimatedShoppingCost.toFixed(2)}</span>
                </div>
              </div>
              <button onClick={() => setShoppingChecks({})} className="rounded-2xl bg-zinc-100 px-4 py-2 text-sm font-bold">Untick all</button>
            </div>
            {Object.keys(groupedShopping).length === 0 ? (
              <p className="rounded-2xl bg-zinc-50 p-4 text-sm text-zinc-600">No shopping items yet. Add meals or tick essentials.</p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {Object.entries(groupedShopping).map(([aisle, items]) => (
                  <div key={aisle} className="rounded-3xl bg-zinc-50 p-4 ring-1 ring-zinc-100">
                    <h3 className="mb-3 text-lg font-black">{aisleIcon[aisle]} {aisle}</h3>
                    <div className="space-y-2">
                      {items.map((item) => {
                        const key = `${item.aisle}::${item.name}`;
                        return (
                          <label key={key} className={`flex cursor-pointer items-start gap-3 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-zinc-100 ${shoppingChecks[key] ? "opacity-45" : ""}`}>
                            <input type="checkbox" checked={!!shoppingChecks[key]} onChange={(e) => setShoppingChecks({ ...shoppingChecks, [key]: e.target.checked })} className="mt-1 h-5 w-5" />
                            <span className="flex-1"><span className={`block font-bold ${shoppingChecks[key] ? "line-through" : ""}`}>{item.name}</span><span className="block text-sm text-zinc-500">{item.qty || "No qty"} · {item.sources.join(", ")}</span></span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {profile && tab === "essentials" && (
          <section className="grid gap-4">
            <div className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-zinc-100">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div><h2 className="text-xl font-black">✔ Additional essentials</h2><p className="text-sm text-zinc-600">Tick extras and they appear on the shopping list.</p></div>
                <button onClick={() => setEssentialChecks({})} className="rounded-2xl bg-orange-100 px-4 py-2 text-sm font-bold text-orange-900">RESET extras</button>
              </div>
              <div className="mb-5 grid gap-2 sm:grid-cols-[1fr_180px_auto]">
                <input value={newEssential.name} onChange={(e) => setNewEssential({ ...newEssential, name: e.target.value })} placeholder="Add an essential item" className="rounded-2xl bg-zinc-50 px-4 py-3 text-sm ring-1 ring-zinc-200" />
                <select value={newEssential.aisle} onChange={(e) => setNewEssential({ ...newEssential, aisle: e.target.value })} className="rounded-2xl bg-zinc-50 px-4 py-3 text-sm ring-1 ring-zinc-200">{AISLES.map((aisle) => <option key={aisle}>{aisle}</option>)}</select>
                <button onClick={addEssential} className="rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white">＋ Add</button>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {Object.entries(seedEssentials).map(([aisle, items]) => (
                  <div key={aisle} className="rounded-3xl bg-zinc-50 p-4 ring-1 ring-zinc-100">
                    <h3 className="mb-3 text-lg font-black">{aisleIcon[aisle]} {aisle}</h3>
                    <div className="grid gap-2">
                      {items.map((item) => {
                        const key = `${aisle}::${item}`;
                        return <label key={key} className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-zinc-100"><input type="checkbox" checked={!!essentialChecks[key]} onChange={(e) => setEssentialChecks({ ...essentialChecks, [key]: e.target.checked })} className="h-5 w-5" /><span className="font-medium">{item}</span></label>;
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {profile && tab === "meals" && (
          <section className="grid gap-4">
            <div className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-zinc-100">
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div><h2 className="text-xl font-black">📝 Meal database</h2><p className="text-sm text-zinc-600">Add meals and ingredients. These become available in the weekly planner.</p></div>
                <div className="relative"><span className="absolute left-3 top-3 text-zinc-400">🔎</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search meals" className="w-full rounded-2xl bg-zinc-50 py-3 pl-9 pr-4 text-sm ring-1 ring-zinc-200" /></div>
              </div>
              <div className="mb-5 rounded-3xl bg-emerald-50 p-4 ring-1 ring-emerald-100">
                <h3 className="mb-3 font-black">✏️ Add new meal</h3>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
                  <input value={newMeal.name} onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })} placeholder="Meal name" className="rounded-2xl bg-white px-4 py-3 text-sm ring-1 ring-emerald-100 lg:col-span-2" />
                  <input value={newMeal.type} onChange={(e) => setNewMeal({ ...newMeal, type: e.target.value })} placeholder="Day/type" className="rounded-2xl bg-white px-4 py-3 text-sm ring-1 ring-emerald-100" />
                  <select value={newMeal.category} onChange={(e) => setNewMeal({ ...newMeal, category: e.target.value })} className="rounded-2xl bg-white px-4 py-3 text-sm ring-1 ring-emerald-100">{MEAL_CATEGORIES.map((category) => <option key={category}>{category}</option>)}</select>
                  <input value={newMeal.caloriesPerServing} onChange={(e) => setNewMeal({ ...newMeal, caloriesPerServing: e.target.value })} placeholder="kcal/serving" type="number" className="rounded-2xl bg-white px-4 py-3 text-sm ring-1 ring-emerald-100" />
                  <input value={newMeal.servings} onChange={(e) => setNewMeal({ ...newMeal, servings: e.target.value })} placeholder="Serves" type="number" className="rounded-2xl bg-white px-4 py-3 text-sm ring-1 ring-emerald-100" />
                  <input value={newMeal.ingredient} onChange={(e) => setNewMeal({ ...newMeal, ingredient: e.target.value })} placeholder="First ingredient" className="rounded-2xl bg-white px-4 py-3 text-sm ring-1 ring-emerald-100" />
                  <input value={newMeal.qty} onChange={(e) => setNewMeal({ ...newMeal, qty: e.target.value })} placeholder="Qty e.g. 500g" className="rounded-2xl bg-white px-4 py-3 text-sm ring-1 ring-emerald-100" />
                  <textarea value={newMeal.method} onChange={(e) => setNewMeal({ ...newMeal, method: e.target.value })} placeholder="Method / cooking steps" className="min-h-24 rounded-2xl bg-white px-4 py-3 text-sm ring-1 ring-emerald-100 sm:col-span-2 lg:col-span-5" />
                  <button onClick={addMeal} className="rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white">＋ Add meal</button>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {filteredMeals.map((meal) => (
                  <article key={meal.name} className="rounded-3xl bg-zinc-50 p-4 ring-1 ring-zinc-100">
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-black">{meal.name}</h3>
                        <p className="text-sm text-zinc-500">{categoryIcon[meal.category || inferCategory(meal)] || "🍽️"} {meal.category || inferCategory(meal)} · {meal.type || "Meal"}</p>
                        <div className="mt-2 flex flex-wrap gap-2"><span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">{displayMealCalories(meal)} kcal/serving</span><span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-900">Serves {meal.servings || 4}</span></div>
                      </div>
                      <button onClick={() => deleteMeal(meal.name)} className="rounded-xl bg-white p-2 text-zinc-500 shadow-sm ring-1 ring-zinc-100">🗑️</button>
                    </div>
                    <div className="space-y-2">
                      {meal.ingredients.length === 0 ? <p className="text-sm text-zinc-500">No ingredients yet.</p> : meal.ingredients.map((item, index) => <div key={`${item.name}-${index}`} className="rounded-2xl bg-white p-3 text-sm shadow-sm ring-1 ring-zinc-100"><span className="font-bold">{item.name}</span><span className="text-zinc-500"> · {item.qty || "No qty"} · {aisleIcon[item.aisle] || "🛒"} {item.aisle}</span></div>)}
                      <div className="rounded-2xl bg-orange-50 p-3 text-sm ring-1 ring-orange-100"><p className="mb-1 text-xs font-black uppercase tracking-wide text-orange-800">Method</p><MethodList method={meal.method || "No method added yet."} /></div>
                    </div>
                    <button onClick={() => addIngredient(meal.name)} className="mt-3 rounded-2xl bg-white px-4 py-2 text-sm font-bold shadow-sm ring-1 ring-zinc-100">＋ Add ingredient</button>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
