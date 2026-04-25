require("dotenv").config();
const express = require("express");
const userRoutes = require("./routes/userRoutes");
const { sequelize } = require("./models");
const cors = require("cors");
const errorHandler = require("./middlewares/errorHandler");
const app = express();
const { connectRedis } = require("./config/redis");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use("/api/users", userRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT;

// synchronize models before starting server
sequelize
  .sync()
  .then(async () => {
    await connectRedis();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("Unable to start server", err);
  });
