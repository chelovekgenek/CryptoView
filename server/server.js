//Config express
const express = require("express");
const workoutRoutes = require("./routes/workouts.js");
const usersRoutes = require("./routes/users.js");
const nftsRoutes = require("./routes/nfts.js");
const transactionsRoutes = require("./routes/Transactions.js");
const userPortfolio = require("./routes/userPortfolio.js");
const mongoose = require("mongoose");
const cors = require("cors");
const config = require("./config.js");

const app = express();

// configuration cors
const corsOptions = {
  origin: ["http://localhost:5173", "https://api.coingecko.com/"],
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// middleware pour parser le json
app.use(express.json());

// middleware pour logger les requetes
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// routes
app.use("/api/workouts/", workoutRoutes);
app.use("/api/portfolio/", userPortfolio);
app.use("/api/transactions/", transactionsRoutes);
app.use("/api/users/", usersRoutes);
app.use("/api/nfts", nftsRoutes);

//connect to db et lancement du server
mongoose
  .connect(config.mongoUri)
  .then(() => {
    // listen requests
    console.log(`connected to db`);
  })
  .catch(() => {
    // console.log(error);
  });

app.listen(config.port, () => {
  console.log(`listening on port ${config.port}`);
});
