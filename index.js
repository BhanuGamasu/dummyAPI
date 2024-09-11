const express = require("express");
const app = express();
const port = 3900;
const cors = require("cors");
const apiRoutes = express.Router();
const dbConnection = require("./dbConnection");
const bodyParser = require("body-parser");
const adminRouter = require("./Routes/adminRoutes");

let db;

// Define allowed origins
const allowedOrigins = ["http://localhost:3000", "http://localhost:3001"];

// Configure CORS dynamically based on request origin
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin, like mobile apps or curl requests
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true); // Origin is allowed
      } else {
        callback(new Error("Not allowed by CORS")); // Origin is not allowed
      }
    },
    credentials: true, // This will allow cookies to be sent
  })
);

// Use body-parser to handle JSON requests
app.use(bodyParser.json());

// Handle preflight requests for all routes
app.options("*", cors());

// Establish database connection
dbConnection()
  .then(async (val) => {
    db = val;
  })
  .catch((err) => {
    console.log(err);
  });

// Middleware to attach the DB connection to the request object
app.use((req, res, next) => {
  if (!db) {
    dbConnection()
      .then(async (val) => {
        db = val;
        req.db = db;
        next();
      })
      .catch((err) => {
        console.log(err);
        res
          .status(500)
          .send({ success: false, error: "MongoDB Connection Error!" });
      });
  } else {
    req.db = db;
    next();
  }
});

// Use the admin routes
apiRoutes.use("", adminRouter);
app.use(apiRoutes);

// Start the server
app.listen(port, () => {
  console.log("Server running on port:" + port);
});
