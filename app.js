const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const dbConnection = require("./db/dbConfig");
const userRoutes = require("./routes/userRoute");
const questionRoutes = require("./routes/questionRoute");
const answerRoutes = require("./routes/answerRoute");
const authMiddleware = require("./middleware/authMiddlewares");

const app = express();
const port = process.env.PORT || 5000;

// Enable CORS for all routes
app.use(cors());

// Use Helmet to set CSP headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", "data:"],
        // Add other CSP directives as needed
      },
    },
  })
);

// Middleware to parse JSON requests
app.use(express.json());

// Route handlers
app.use("/api/users", userRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/answers", authMiddleware, answerRoutes);

// Start the server
async function start() {
  try {
    // Test the database connection
    await dbConnection.query("SELECT 1");
    console.log("Connected to the database successfully");

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Error connecting to the database:", error);
    process.exit(1); // Exit process with failure
  }
}

start();
