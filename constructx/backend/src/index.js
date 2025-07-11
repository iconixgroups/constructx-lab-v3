const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("ConstructX Backend is running!");
});

// API routes
app.use("/api/auth", authRoutes);
// app.use("/api/contracts", require("./routes/contractRoutes"));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

