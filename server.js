require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

const PORT = process.env.PORT || 8081;
const URL_FRONTEND =
  process.env.URL_FRONTEND ||
  "https://frontend-hackathon-next-stop-station.onrender.com";

const fleetData = require("./data/fleetData");

app.use(express.json());

app.use(
  cors({
    origin: [URL_FRONTEND, "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// -------------------------------------
//  Battery API Routes
// -------------------------------------

// Full fleet data
app.get("/api/battery", (req, res) => {
  res.json(fleetData);
});

// Average fleet trend (for dashboard overview)
app.get("/api/battery/trend", (req, res) => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Today"];

  // Calculate overall average health score
  const avgHealth =
    fleetData.buses.reduce((sum, bus) => sum + bus.healthScore, 0) /
    fleetData.buses.length;

  // Simulate gradual decline
  const trend = days.map((day, i) => ({
    day,
    performance: Math.round(avgHealth - i * 1.5),
  }));

  res.json(trend);
});

// AI-Predicted Battery Performance (per bus)
app.get("/api/battery/trend/:busId", (req, res) => {
  // Decode to handle URL-encoded IDs like "Bus%20101"
  const busId = decodeURIComponent(req.params.busId);

  console.log(`Received trend request for: ${busId}`); 

  const bus = fleetData.buses.find((b) => b.id === busId);
  if (!bus) return res.status(404).json({ error: "Bus not found" });

  const days = [
    "Today",
    "Day 1",
    "Day 2",
    "Day 3",
    "Day 4",
    "Day 5",
    "Day 6",
    "Day 7",
  ];
  const base = bus.healthScore;

  // Simulate AI forecast with small random variations
  let performance = base;
  const trend = days.map((day, i) => {
    const drift = (Math.random() - 0.5) * 1.5; // ±0.75 random variation
    const decay = i * 1.1; // gentle decline
    performance = Math.max(0, Math.min(100, performance - decay + drift));
    return {
      day,
      performance: Math.round(performance),
      lower: Math.max(0, Math.round(performance - 2)),
      upper: Math.min(100, Math.round(performance + 2)),
    };
  });

  res.json(trend);
});

// Simple test endpoint
app.get("/api", (req, res) => {
  res.json({ fruits: ["apple", "orange", "banana"] });
});

// -------------------------------------

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`CORS allowed for: ${URL_FRONTEND}`);
});
