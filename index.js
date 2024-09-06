const express = require("express");
const cors = require("cors");

const app = express();
const port = 5000; // Server runs on port 5000

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse incoming JSON requests

// Basic route
app.get("/", (req, res) => {
  res.send("Hello from the Node.js backend!");
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
