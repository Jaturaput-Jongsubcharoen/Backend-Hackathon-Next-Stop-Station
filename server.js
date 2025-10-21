require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

const PORT = process.env.PORT || 8081;
const URL_FRONTEND = process.env.URL_FRONTEND;

// Import fleet data from local file
const fleetData = require("./data/fleetData");

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: URL_FRONTEND,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);


// API Routes
// -------------------------------------
// Fleet data route
app.get("/api/battery", (req, res) => {
  res.json(fleetData);
});

// untouched
app.get("/api", (req, res) => {
  res.json({ fruits: ["apple", "orange", "banana"] });
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`CORS allowed for: ${URL_FRONTEND}`);
});
