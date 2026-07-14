import express from "express";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static("public"));

// ── Connect to MongoDB ──────────────────────────────
let db, packages, bookings, enquiries;

try {
  const client = new MongoClient(process.env.MONGO_URI || "mongodb://localhost:27017");
  await client.connect();
  db        = client.db("journeyhub");
  packages  = db.collection("packages");
  bookings  = db.collection("bookings");
  enquiries = db.collection("enquiries");
  console.log("Connected to MongoDB");
} catch (err) {
  console.error("MongoDB connection failed:", err.message);
  process.exit(1);
}

// ── Seed 4 packages on first run ────────────────────
if ((await packages.countDocuments()) === 0) {
  await packages.insertMany([
    {
      name: "Kerala Backwaters",
      destination: "Alleppey & Munnar, India",
      category: "Cultural",
      duration: "6 Days / 5 Nights",
      price: 32999,
      originalPrice: 42000,
      image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=700",
      description: "Drift through emerald backwaters on a traditional houseboat and unwind in the misty tea estates of Munnar.",
      highlights: ["Alleppey Houseboat Stay", "Munnar Tea Garden Walk", "Kathakali Dance Show", "Ayurvedic Spa Session"],
      includes: ["5 Nights Hotel + Houseboat", "Daily Breakfast & Dinner", "All Transfers", "Guided Tours"],
      difficulty: "Easy", rating: 4.9, reviews: 412, featured: true
    },
    {
      name: "Golden Triangle",
      destination: "Delhi - Agra - Jaipur, India",
      category: "Cultural",
      duration: "5 Days / 4 Nights",
      price: 24999,
      originalPrice: 31000,
      image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=700",
      description: "India's most iconic route — the Taj Mahal at dawn, Jaipur's pink forts, and the grand bazaars of Old Delhi.",
      highlights: ["Taj Mahal Sunrise Visit", "Amber Fort Jaipur", "Old Delhi Rickshaw Ride", "Jaipur City Palace"],
      includes: ["4 Nights Hotel", "Daily Breakfast", "AC Car & Driver", "Monument Guides"],
      difficulty: "Easy", rating: 4.8, reviews: 634, featured: true
    },
    {
      name: "Goa Beach Escape",
      destination: "North & South Goa, India",
      category: "Beach",
      duration: "4 Days / 3 Nights",
      price: 18499,
      originalPrice: 23000,
      image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=700",
      description: "Sunny beaches, Portuguese-era churches, water sports, and fresh seafood — the perfect quick getaway.",
      highlights: ["Baga & Anjuna Beaches", "Water Sports Session", "Old Goa Churches", "Sunset Cruise"],
      includes: ["3 Nights Beach Resort", "Daily Breakfast", "Airport Transfers", "Water Sports"],
      difficulty: "Easy", rating: 4.7, reviews: 519, featured: true
    },
    {
      name: "Manali Snow Trip",
      destination: "Manali, Himachal Pradesh",
      category: "Adventure",
      duration: "5 Days / 4 Nights",
      price: 21999,
      originalPrice: 27500,
      image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=700",
      description: "Snow peaks, river rafting on Beas, and Rohtang Pass — Manali packs everything an adventure lover needs.",
      highlights: ["Rohtang Pass Snow Day", "Solang Valley Activities", "Beas River Rafting", "Old Manali Walk"],
      includes: ["4 Nights Hotel", "Daily Breakfast & Dinner", "Volvo Bus from Delhi", "Sightseeing Tours"],
      difficulty: "Moderate", rating: 4.8, reviews: 388, featured: true
    }
  ]);
}

// ── GET all packages ────────────────────────────────
app.get("/api/packages", async (req, res) => {
  try {
    const { search, category } = req.query;
    const query = {};
    if (category && category !== "all") query.category = category;
    if (search) query.name = { $regex: search, $options: "i" };
    const list = await packages.find(query).toArray();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// ── GET single package ──────────────────────────────
app.get("/api/packages/:id", async (req, res) => {
  try {
    const { ObjectId } = await import("mongodb");
    const pkg = await packages.findOne({ _id: new ObjectId(req.params.id) });
    if (!pkg) return res.status(404).json({ error: "Not found" });
    res.json(pkg);
  } catch (err) {
    res.status(400).json({ error: "Invalid ID" });
  }
});

// ── POST create booking ─────────────────────────────
app.post("/api/bookings", async (req, res) => {
  try {
    const { packageId, packageName, firstName, lastName,
            email, phone, city, travelDate, adults, children, totalPrice } = req.body;

    if (!firstName || !lastName || !email || !phone || !travelDate) {
      return res.status(400).json({ error: "All required fields must be filled" });
    }

    const cleanPhone = phone.replace(/^\+91/, "").trim();
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      return res.status(400).json({ error: "Enter a valid 10-digit Indian mobile number" });
    }

    const ref = "JH" + Date.now().toString(36).toUpperCase();
    await bookings.insertOne({
      ref,
      packageId:   packageId   || "",
      packageName: packageName || "",
      firstName, lastName, email,
      phone: "+91" + cleanPhone,
      city:        city        || "",
      travelDate:  new Date(travelDate),
      travelers: {
        adults:   parseInt(adults)   || 1,
        children: parseInt(children) || 0
      },
      totalPrice: parseFloat(totalPrice) || 0,
      status:    "Pending",
      createdAt: new Date()
    });

    res.json({ ok: true, ref });

  } catch (err) {
    res.status(500).json({ error: "Server error while saving booking" });
  }
});

// ── GET lookup booking ──────────────────────────────
app.get("/api/bookings/lookup", async (req, res) => {
  try {
    const ref = (req.query.ref || "").toUpperCase();
    const booking = await bookings.findOne({ ref });
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// ── POST save enquiry ───────────────────────────────
app.post("/api/enquiries", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields required" });
    }
    await enquiries.insertOne({ name, email, message, createdAt: new Date() });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: "Server error while saving enquiry" });
  }
});

// ── GET list enquiries ──────────────────────────────
app.get("/api/enquiries", async (req, res) => {
  try {
    const list = await enquiries.find().sort({ createdAt: -1 }).limit(20).toArray();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// ── Start server ────────────────────────────────────
app.listen(process.env.PORT || 3000, () => {
  console.log("JourneyHub running at http://localhost:3000");
});
