import React, { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Trash2,
  RotateCcw,
  ShoppingCart,
  CalendarDays,
  Database,
  CheckSquare,
  Search,
  Pencil,
  UserRound,
  LogOut,
  LockKeyhole,
} from "lucide-react";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const AISLES = [
  "Chilled / Dairy",
  "Meat & Fish",
  "Fruit & Veg",
  "Bakery",
  "Cupboard",
  "Sauces",
  "Herbs & Spices",
  "Frozen",
  "Snacks",
  "Household",
  "Drinks",
  "Other",
];

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

const seedMeals = [
  {
    name: "Creamy Mustard Sausage & Leek Casserole",
    type: "Wednesday",
    caloriesPerServing: 620,
    servings: 4,
    ingredients: [
      { name: "Pork sausages", qty: "12", aisle: "Meat & Fish" },
      { name: "Leeks", qty: "3", aisle: "Fruit & Veg" },
      { name: "Crème fraîche", qty: "2 tbsp", aisle: "Chilled / Dairy" },
      { name: "Rice", qty: "", aisle: "Cupboard" },
    ],
  },
  {
    name: "Burgers",
    type: "Friday",
    caloriesPerServing: 720,
    servings: 4,
    ingredients: [
      { name: "Bean/Beef Burgers", qty: "", aisle: "Meat & Fish" },
      { name: "Bread rolls", qty: "1", aisle: "Bakery" },
      { name: "Chips", qty: "", aisle: "Frozen" },
      { name: "Baked beans/Peas", qty: "", aisle: "Cupboard" },
    ],
  },
  {
    name: "Beef Meatballs in Onion Gravy",
    type: "Saturday",
    caloriesPerServing: 650,
    servings: 4,
    ingredients: [
      { name: "Beef meatballs", qty: "500g", aisle: "Meat & Fish" },
      { name: "Onion", qty: "2", aisle: "Fruit & Veg" },
      { name: "Broccoli", qty: "", aisle: "Fruit & Veg" },
      { name: "Mash", qty: "", aisle: "Fruit & Veg" },
    ],
  },
  {
    name: "Air Fryer Baked Feta Pasta",
    type: "Thursday",
    caloriesPerServing: 560,
    servings: 4,
    ingredients: [
      { name: "Feta cheese", qty: "1 block", aisle: "Chilled / Dairy" },
      { name: "Cherry tomatoes", qty: "1 pack", aisle: "Fruit & Veg" },
      { name: "Pasta", qty: "As needed", aisle: "Cupboard" },
      { name: "Sun-dried tomatoes", qty: "70g", aisle: "Cupboard" },
      { name: "Fresh basil", qty: "To serve", aisle: "Fruit & Veg" },
    ],
  },
  {
    name: "Air Fryer Crispy Beijing Beef",
    type: "Tuesday",
    caloriesPerServing: 690,
    servings: 4,
    ingredients: [
      { name: "Beef strips", qty: "500g", aisle: "Meat & Fish" },
      { name: "Onion", qty: "1", aisle: "Fruit & Veg" },
      { name: "Sugar snap peas", qty: "Handful", aisle: "Fruit & Veg" },
      { name: "Cornflour", qty: "2 tbsp", aisle: "Cupboard" },
      { name: "Noodles", qty: "~600g", aisle: "Cupboard" },
      { name: "Hoisin sauce", qty: "3 tbsp", aisle: "Sauces" },
      { name: "Sesame oil", qty: "1 tbsp", aisle: "Sauces" },
      { name: "Garlic cloves / puree", qty: "4 cloves", aisle: "Fruit & Veg" },
      { name: "Rice vinegar", qty: "1 tbsp", aisle: "Sauces" },
    ],
  },
  {
    name: "Beef, Lentil & Bean Chilli",
    type: "Thursday",
    caloriesPerServing: 520,
    servings: 6,
    ingredients: [
      { name: "Beef mince", qty: "1kg", aisle: "Meat & Fish" },
      { name: "Green lentils", qty: "1", aisle: "Cupboard" },
      { name: "Carrots", qty: "2", aisle: "Fruit & Veg" },
      { name: "Celery", qty: "2 sticks", aisle: "Fruit & Veg" },
      { name: "Onion", qty: "1", aisle: "Fruit & Veg" },
      { name: "Mushrooms", qty: "150g", aisle: "Fruit & Veg" },
      { name: "Mixed beans / kidney beans", qty: "1 tin", aisle: "Cupboard" },
      { name: "Chopped tomatoes", qty: "4", aisle: "Cupboard" },
      { name: "Tomato puree", qty: "2 tbsp", aisle: "Sauces" },
      { name: "Soy sauce", qty: "1 tbsp", aisle: "Sauces" },
    ],
  },
  {
    name: "Chicken Fajita Rice",
    type: "Family favourite",
    caloriesPerServing: 540,
    servings: 4,
    ingredients: [
      { name: "Chicken breasts", qty: "", aisle: "Meat & Fish" },
      { name: "Peppers", qty: "", aisle: "Fruit & Veg" },
      { name: "Onion", qty: "", aisle: "Fruit & Veg" },
      { name: "Rice", qty: "", aisle: "Cupboard" },
      { name: "Fajita seasoning", qty: "", aisle: "Sauces" },
    ],
  },
  {
    name: "Chicken Korma",
    type: "Family favourite",
    caloriesPerServing: 610,
    servings: 4,
    ingredients: [
      { name: "Chicken breasts", qty: "", aisle: "Meat & Fish" },
      { name: "Korma sauce", qty: "", aisle: "Sauces" },
      { name: "Rice", qty: "", aisle: "Cupboard" },
      { name: "Naan bread", qty: "", aisle: "Bakery" },
    ],
  },
  {
    name: "Fish fingers",
    type: "Quick tea",
    caloriesPerServing: 480,
    servings: 4,
    ingredients: [
      { name: "Fish fingers", qty: "", aisle: "Frozen" },
      { name: "Chips", qty: "", aisle: "Frozen" },
      { name: "Peas", qty: "", aisle: "Frozen" },
    ],
  },
];

const seedEssentials = {
  "Chilled / Dairy": ["Milk", "Butter", "Margarine", "Cheddar cheese", "Mozzarella", "Parmesan", "Yoghurt", "Hummous", "Cream", "Sour cream", "Soft cheese", "Eggs", "Paneer", "Halloumi"],
  "Meat & Fish": ["Chicken breasts", "Chicken thighs", "Beef mince", "Pork mince", "Sausages", "Bacon", "Ham", "Salmon fillets", "White fish", "Fish fingers", "Meatballs", "Burgers", "Whole chicken", "Chorizo"],
  "Fruit & Veg": ["Onions", "Garlic", "Carrots", "Broccoli", "Peppers", "Courgette", "Mushrooms", "Spinach", "Cherry tomatoes", "Cucumber", "Salad", "Potatoes", "Sweet potatoes", "Apples", "Bananas", "Grapes", "Lemons", "Limes", "Pears", "Avocado", "Strawberries"],
  Bakery: ["Bread", "Wraps", "Burger buns", "Hot dog rolls", "Garlic bread", "Crumpets", "Bagels", "Pancakes", "French stick", "Naan bread"],
  Cupboard: ["Pasta", "Rice", "Noodles", "Tinned tomatoes", "Tomato purée", "Baked beans", "Kidney beans", "Chickpeas", "Sweetcorn", "Tuna", "Coconut milk", "Chicken stock", "Beef stock", "Gravy granules", "Flour", "Cornflour", "Sugar", "Brown sugar", "Breadsticks", "Prawn crackers", "Microwave quinoa"],
  Sauces: ["Olive oil", "Vegetable oil", "Sesame oil", "Soy sauce", "BBQ sauce", "Ketchup", "Mayonnaise", "Mustard", "Honey", "Chilli sauce", "Sweet chilli sauce", "Curry paste", "Fajita seasoning", "Taco seasoning", "Sweet and sour"],
  "Herbs & Spices": ["Salt", "Black pepper", "Mixed herbs", "Oregano", "Paprika", "Chilli flakes", "Cumin", "Curry powder", "Garlic granules", "Basil", "Fajita mix"],
  Frozen: ["Frozen peas", "Frozen sweetcorn", "Frozen broccoli", "Frozen chips", "Frozen berries", "Ice cream"],
  Snacks: ["Biscuits", "Crisps", "Cereal bars", "Crackers", "Peanut butter", "Jam", "Chocolate", "Nuts", "Cornflakes"],
  Household: ["Toilet roll", "Kitchen roll", "Washing up liquid", "Laundry detergent", "Fabric softener", "Dishwasher tablets", "Bin bags", "Cling film", "Foil", "Toothpaste", "Surface spray", "Hand soap"],
  Drinks: ["Squash", "Cold fusion tea bags", "Tea bags", "Coffee", "Coke", "Lemonade", "Tonic"],
};

const initialPlanner = {
  Monday: "",
  Tuesday: "",
  Wednesday: "Creamy Mustard Sausage & Leek Casserole",
  Thursday: "",
  Friday: "Burgers",
  Saturday: "Beef Meatballs in Onion Gravy",
  Sunday: "LEFTOVERS",
};

function load(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

function normalise(text) {
  return String(text || "").trim().toLowerCase();
}

function pillClass(active) {
  return `rounded-full px-4 py-2 text-sm font-semibold transition ${active ? "bg-zinc-950 text-white" : "bg-white text-zinc-700 shadow-sm ring-1 ring-zinc-200"}`;
}

export default function MealPlannerApp() {
  const [tab, setTab] = useState("planner");
  const [profile, setProfile] = useState(() => load("mp_profile", null));
  const [signup, setSignup] = useState({ name: "", email: "" });
  const [meals, setMeals] = useState(() => load("mp_meals", seedMeals));
  const [planner, setPlanner] = useState(() => load("mp_planner", initialPlanner));
  const [essentialChecks, setEssentialChecks] = useState(() => load("mp_essential_checks", {}));
  const [shoppingChecks, setShoppingChecks] = useState(() => load("mp_shopping_checks", {}));
  const [query, setQuery] = useState("");
  const [newMeal, setNewMeal] = useState({ name: "", type: "", caloriesPerServing: "", servings: "4", ingredient: "", qty: "", aisle: "Fruit & Veg" });
  const [newEssential, setNewEssential] = useState({ name: "", aisle: "Fruit & Veg" });

  useEffect(() => save("mp_profile", profile), [profile]);
  useEffect(() => save("mp_meals", meals), [meals]);
  useEffect(() => save("mp_planner", planner), [planner]);
  useEffect(() => save("mp_essential_checks", essentialChecks), [essentialChecks]);
  useEffect(() => save("mp_shopping_checks", shoppingChecks), [shoppingChecks]);

  const mealNames = useMemo(() => meals.map((m) => m.name).sort((a, b) => a.localeCompare(b)), [meals]);

  const shoppingList = useMemo(() => {
    const items = [];

    Object.values(planner).forEach((mealName) => {
      const meal = meals.find((m) => m.name === mealName);
      if (!meal) return;
      meal.ingredients.forEach((ing) => items.push({ ...ing, source: meal.name }));
    });

    Object.entries(essentialChecks).forEach(([key, checked]) => {
      if (!checked) return;
      const [aisle, name] = key.split("::");
      items.push({ name, qty: "", aisle, source: "Essentials" });
    });

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

    return Array.from(merged.values()).map((item) => ({
      ...item,
      qty: [...new Set(item.qtys)].join(" + "),
      sources: [...new Set(item.sources)],
    }));
  }, [planner, meals, essentialChecks]);

  const groupedShopping = useMemo(() => {
    return AISLES.reduce((acc, aisle) => {
      const matches = shoppingList.filter((item) => item.aisle === aisle);
      if (matches.length) acc[aisle] = matches.sort((a, b) => a.name.localeCompare(b.name));
      return acc;
    }, {});
  }, [shoppingList]);

  const filteredMeals = useMemo(() => {
    return meals.filter((meal) => normalise(meal.name).includes(normalise(query)) || normalise(meal.type).includes(normalise(query)));
  }, [meals, query]);

  const dailyCalories = useMemo(() => {
    return DAYS.reduce((acc, day) => {
      const meal = meals.find((m) => m.name === planner[day]);
      acc[day] = meal?.caloriesPerServing || 0;
      return acc;
    }, {});
  }, [meals, planner]);

  const weeklyCalories = useMemo(() => {
    return Object.values(dailyCalories).reduce((sum, kcal) => sum + Number(kcal || 0), 0);
  }, [dailyCalories]);

  function getMealByName(name) {
    return meals.find((meal) => meal.name === name);
  }

  function mealIngredients(mealName) {
    const meal = getMealByName(mealName);
    return meal?.ingredients || [];
  }

  function resetWeek() {
    setPlanner(DAYS.reduce((acc, day) => ({ ...acc, [day]: "" }), {}));
    setShoppingChecks({});
  }

  function resetEverything() {
    setMeals(seedMeals);
    setPlanner(initialPlanner);
    setEssentialChecks({});
    setShoppingChecks({});
  }

  function completeSignup() {
    if (!signup.name.trim() || !signup.email.trim()) return;
    setProfile({ name: signup.name.trim(), email: signup.email.trim(), joinedAt: new Date().toISOString() });
    setTab("planner");
  }

  function signOut() {
    setProfile(null);
    setSignup({ name: "", email: "" });
    setTab("planner");
  }

  function addMeal() {
    if (!newMeal.name.trim()) return;
    const ingredient = newMeal.ingredient.trim()
      ? [{ name: newMeal.ingredient.trim(), qty: newMeal.qty.trim(), aisle: newMeal.aisle }]
      : [];
    setMeals((prev) => [...prev, {
      name: newMeal.name.trim(),
      type: newMeal.type.trim() || "New",
      caloriesPerServing: Number(newMeal.caloriesPerServing) || 0,
      servings: Number(newMeal.servings) || 4,
      ingredients: ingredient,
    }]);
    setNewMeal({ name: "", type: "", caloriesPerServing: "", servings: "4", ingredient: "", qty: "", aisle: "Fruit & Veg" });
  }

  function addIngredient(mealName) {
    const ingredientName = prompt("Ingredient name");
    if (!ingredientName) return;
    const qty = prompt("Quantity", "") || "";
    const aisle = prompt(`Aisle: ${AISLES.join(", ")}`, "Fruit & Veg") || "Other";
    setMeals((prev) =>
      prev.map((meal) =>
        meal.name === mealName
          ? { ...meal, ingredients: [...meal.ingredients, { name: ingredientName, qty, aisle: AISLES.includes(aisle) ? aisle : "Other" }] }
          : meal
      )
    );
  }

  function deleteMeal(name) {
    setMeals((prev) => prev.filter((meal) => meal.name !== name));
    setPlanner((prev) => Object.fromEntries(Object.entries(prev).map(([day, meal]) => [day, meal === name ? "" : meal])));
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
              <p className="mt-2 max-w-2xl text-sm text-zinc-600">
                {profile ? `Welcome back, ${profile.name.split(" ")[0]}.` : "Create a free account first to unlock the planner."}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button onClick={() => setTab("me")} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-sm">
                <UserRound size={18} /> {profile ? profile.name.split(" ")[0] : "Me"}
              </button>
              {profile && (
                <button onClick={resetEverything} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-zinc-950 px-4 py-3 text-sm font-bold text-white shadow-sm">
                  <RotateCcw size={18} /> Reset demo
                </button>
              )}
            </div>
          </div>
        </header>

        {profile && (
          <nav className="mb-5 flex gap-2 overflow-x-auto pb-1">
            <button onClick={() => setTab("planner")} className={pillClass(tab === "planner")}><CalendarDays className="mr-2 inline" size={16} />Planner</button>
            <button onClick={() => setTab("shopping")} className={pillClass(tab === "shopping")}><ShoppingCart className="mr-2 inline" size={16} />Shopping</button>
            <button onClick={() => setTab("essentials")} className={pillClass(tab === "essentials")}><CheckSquare className="mr-2 inline" size={16} />Essentials</button>
            <button onClick={() => setTab("meals")} className={pillClass(tab === "meals")}><Database className="mr-2 inline" size={16} />Meal database</button>
          </nav>
        )}

        {!profile && tab !== "me" && (
          <section className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-zinc-100">
            <div className="mx-auto max-w-xl text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-100 text-3xl">👋</div>
              <h2 className="text-2xl font-black">Create your meal planner account</h2>
              <p className="mt-2 text-sm text-zinc-600">Sign up first so your planner feels personal and your saved meals, essentials and shopping list belong to you.</p>
              <div className="mt-5 grid gap-3 text-left">
                <label className="text-sm font-bold">Name</label>
                <input value={signup.name} onChange={(e) => setSignup({ ...signup, name: e.target.value })} placeholder="e.g. Megan" className="rounded-2xl bg-zinc-50 px-4 py-3 text-sm ring-1 ring-zinc-200" />
                <label className="text-sm font-bold">Email</label>
                <input value={signup.email} onChange={(e) => setSignup({ ...signup, email: e.target.value })} placeholder="you@example.com" type="email" className="rounded-2xl bg-zinc-50 px-4 py-3 text-sm ring-1 ring-zinc-200" />
                <button onClick={completeSignup} disabled={!signup.name.trim() || !signup.email.trim()} className="mt-2 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-40">
                  <LockKeyhole size={16} className="mr-1 inline" /> Sign up and start planning
                </button>
              </div>
              <p className="mt-4 text-xs text-zinc-500">Prototype note: this stores the profile locally in this browser. A real launched app would use proper authentication and a database.</p>
            </div>
          </section>
        )}

        {tab === "me" && (
          <section className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-zinc-100">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">My account</p>
                <h2 className="mt-1 text-2xl font-black">{profile ? `Hi, ${profile.name}` : "Sign up to continue"}</h2>
                <p className="mt-2 max-w-xl text-sm text-zinc-600">This is where profile details, subscription settings, saved preferences and account tools would live.</p>
              </div>
              {profile && (
                <button onClick={signOut} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-zinc-100 px-4 py-3 text-sm font-bold text-zinc-800">
                  <LogOut size={18} /> Sign out
                </button>
              )}
            </div>

            {!profile ? (
              <div className="mt-5 grid gap-3 rounded-3xl bg-emerald-50 p-4 ring-1 ring-emerald-100">
                <label className="text-sm font-bold">Name</label>
                <input value={signup.name} onChange={(e) => setSignup({ ...signup, name: e.target.value })} placeholder="e.g. Megan" className="rounded-2xl bg-white px-4 py-3 text-sm ring-1 ring-emerald-100" />
                <label className="text-sm font-bold">Email</label>
                <input value={signup.email} onChange={(e) => setSignup({ ...signup, email: e.target.value })} placeholder="you@example.com" type="email" className="rounded-2xl bg-white px-4 py-3 text-sm ring-1 ring-emerald-100" />
                <button onClick={completeSignup} disabled={!signup.name.trim() || !signup.email.trim()} className="rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-40">Create account</button>
              </div>
            ) : (
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="rounded-3xl bg-zinc-50 p-4 ring-1 ring-zinc-100">
                  <p className="text-sm text-zinc-500">Name</p>
                  <p className="font-black">{profile.name}</p>
                </div>
                <div className="rounded-3xl bg-zinc-50 p-4 ring-1 ring-zinc-100">
                  <p className="text-sm text-zinc-500">Email</p>
                  <p className="break-all font-black">{profile.email}</p>
                </div>
                <div className="rounded-3xl bg-zinc-50 p-4 ring-1 ring-zinc-100">
                  <p className="text-sm text-zinc-500">Plan</p>
                  <p className="font-black">Free prototype</p>
                </div>
              </div>
            )}
          </section>
        )}

        {profile && tab === "planner" && (
          <section className="grid gap-4">
            <div className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-zinc-100">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-black">🍽 Weekly food planner</h2>
                  <p className="text-sm text-zinc-600">Choose meals and the shopping list updates automatically. Calories show per serving.</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="rounded-2xl bg-emerald-50 px-4 py-2 text-right ring-1 ring-emerald-100">
                    <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">Weekly planned calories</p>
                    <p className="text-lg font-black">{weeklyCalories || 0} kcal</p>
                    <p className="text-xs text-zinc-500">per serving total</p>
                  </div>
                  <button onClick={resetWeek} className="rounded-2xl bg-orange-100 px-4 py-2 text-sm font-bold text-orange-900">RESET week</button>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {DAYS.map((day) => (
                  <div key={day} className="rounded-3xl bg-zinc-50 p-4 ring-1 ring-zinc-100">
                    <label className="mb-2 block text-sm font-black">{day}</label>
                    <select value={planner[day] || ""} onChange={(e) => setPlanner({ ...planner, [day]: e.target.value })} className="w-full rounded-2xl border-0 bg-white px-3 py-3 text-sm shadow-sm ring-1 ring-zinc-200">
                      <option value="">No meal selected</option>
                      <option value="LEFTOVERS">LEFTOVERS</option>
                      {mealNames.map((name) => <option key={name} value={name}>{name}</option>)}
                    </select>
                    <div className="mt-2 rounded-xl bg-white px-3 py-2 text-sm shadow-sm ring-1 ring-zinc-100">
                      <p className="font-bold text-emerald-700">{dailyCalories[day] ? `${dailyCalories[day]} kcal per serving` : "No calories planned"}</p>
                      {planner[day] && planner[day] !== "LEFTOVERS" && (
                        <div className="mt-2 border-t border-zinc-100 pt-2">
                          <p className="mb-1 text-xs font-black uppercase tracking-wide text-zinc-500">Ingredients</p>
                          <ul className="space-y-1 text-xs leading-snug text-zinc-600">
                            {mealIngredients(planner[day]).map((ing, index) => (
                              <li key={`${ing.name}-${index}`} className="flex justify-between gap-2 rounded-lg bg-zinc-50 px-2 py-1">
                                <span>{ing.name}</span>
                                <span className="shrink-0 font-bold text-zinc-700">{ing.qty || ""}</span>
                              </li>
                            ))}
                          </ul>
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
                <h2 className="text-xl font-black">🛒 Shopping list</h2>
                <p className="text-sm text-zinc-600">Grouped by aisle, with duplicate ingredients merged.</p>
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
                            <span className="flex-1">
                              <span className={`block font-bold ${shoppingChecks[key] ? "line-through" : ""}`}>{item.name}</span>
                              <span className="block text-sm text-zinc-500">{item.qty || "No qty"} · {item.sources.join(", ")}</span>
                            </span>
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
                <div>
                  <h2 className="text-xl font-black">✔ Additional essentials</h2>
                  <p className="text-sm text-zinc-600">Tick extras and they appear on the shopping list.</p>
                </div>
                <button onClick={() => setEssentialChecks({})} className="rounded-2xl bg-orange-100 px-4 py-2 text-sm font-bold text-orange-900">RESET extras</button>
              </div>
              <div className="mb-5 grid gap-2 sm:grid-cols-[1fr_180px_auto]">
                <input value={newEssential.name} onChange={(e) => setNewEssential({ ...newEssential, name: e.target.value })} placeholder="Add an essential item" className="rounded-2xl bg-zinc-50 px-4 py-3 text-sm ring-1 ring-zinc-200" />
                <select value={newEssential.aisle} onChange={(e) => setNewEssential({ ...newEssential, aisle: e.target.value })} className="rounded-2xl bg-zinc-50 px-4 py-3 text-sm ring-1 ring-zinc-200">{AISLES.map((a) => <option key={a}>{a}</option>)}</select>
                <button onClick={addEssential} className="rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white"><Plus size={16} className="mr-1 inline" />Add</button>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {Object.entries(seedEssentials).map(([aisle, items]) => (
                  <div key={aisle} className="rounded-3xl bg-zinc-50 p-4 ring-1 ring-zinc-100">
                    <h3 className="mb-3 text-lg font-black">{aisleIcon[aisle]} {aisle}</h3>
                    <div className="grid gap-2">
                      {items.map((item) => {
                        const key = `${aisle}::${item}`;
                        return (
                          <label key={key} className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-zinc-100">
                            <input type="checkbox" checked={!!essentialChecks[key]} onChange={(e) => setEssentialChecks({ ...essentialChecks, [key]: e.target.checked })} className="h-5 w-5" />
                            <span className="font-medium">{item}</span>
                          </label>
                        );
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
                <div>
                  <h2 className="text-xl font-black">📝 Meal database</h2>
                  <p className="text-sm text-zinc-600">Add meals and ingredients. These become available in the weekly planner.</p>
                </div>
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-3.5 text-zinc-400" />
                  <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search meals" className="w-full rounded-2xl bg-zinc-50 py-3 pl-9 pr-4 text-sm ring-1 ring-zinc-200" />
                </div>
              </div>

              <div className="mb-5 rounded-3xl bg-emerald-50 p-4 ring-1 ring-emerald-100">
                <h3 className="mb-3 font-black"><Pencil size={16} className="mr-1 inline" />Add new meal</h3>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
                  <input value={newMeal.name} onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })} placeholder="Meal name" className="rounded-2xl bg-white px-4 py-3 text-sm ring-1 ring-emerald-100 lg:col-span-2" />
                  <input value={newMeal.type} onChange={(e) => setNewMeal({ ...newMeal, type: e.target.value })} placeholder="Day/type" className="rounded-2xl bg-white px-4 py-3 text-sm ring-1 ring-emerald-100" />
                  <input value={newMeal.caloriesPerServing} onChange={(e) => setNewMeal({ ...newMeal, caloriesPerServing: e.target.value })} placeholder="kcal/serving" type="number" className="rounded-2xl bg-white px-4 py-3 text-sm ring-1 ring-emerald-100" />
                  <input value={newMeal.servings} onChange={(e) => setNewMeal({ ...newMeal, servings: e.target.value })} placeholder="Serves" type="number" className="rounded-2xl bg-white px-4 py-3 text-sm ring-1 ring-emerald-100" />
                  <input value={newMeal.ingredient} onChange={(e) => setNewMeal({ ...newMeal, ingredient: e.target.value })} placeholder="First ingredient" className="rounded-2xl bg-white px-4 py-3 text-sm ring-1 ring-emerald-100 lg:col-span-2" />
                  <button onClick={addMeal} className="rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white"><Plus size={16} className="mr-1 inline" />Add meal</button>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {filteredMeals.map((meal) => (
                  <article key={meal.name} className="rounded-3xl bg-zinc-50 p-4 ring-1 ring-zinc-100">
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-black">{meal.name}</h3>
                        <p className="text-sm text-zinc-500">{meal.type || "Meal"}</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">{meal.caloriesPerServing ? `${meal.caloriesPerServing} kcal/serving` : "Calories not set"}</span>
                          <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-900">Serves {meal.servings || 4}</span>
                        </div>
                      </div>
                      <button onClick={() => deleteMeal(meal.name)} className="rounded-xl bg-white p-2 text-zinc-500 shadow-sm ring-1 ring-zinc-100"><Trash2 size={16} /></button>
                    </div>
                    <div className="space-y-2">
                      {meal.ingredients.length === 0 ? <p className="text-sm text-zinc-500">No ingredients yet.</p> : meal.ingredients.map((ing, i) => (
                        <div key={`${ing.name}-${i}`} className="rounded-2xl bg-white p-3 text-sm shadow-sm ring-1 ring-zinc-100">
                          <span className="font-bold">{ing.name}</span>
                          <span className="text-zinc-500"> · {ing.qty || "No qty"} · {aisleIcon[ing.aisle] || "🛒"} {ing.aisle}</span>
                        </div>
                      ))}
                    </div>
                    <button onClick={() => addIngredient(meal.name)} className="mt-3 rounded-2xl bg-white px-4 py-2 text-sm font-bold shadow-sm ring-1 ring-zinc-100"><Plus size={16} className="mr-1 inline" />Add ingredient</button>
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
