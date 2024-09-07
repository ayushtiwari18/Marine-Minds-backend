const express = require("express");
// const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const path = require("path");
const expressLayouts = require("express-ejs-layouts"); // Add this line

const app = express();
const port = process.env.PORT || 5000;

app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// Set the view engine to EJS
app.set("view engine", "ejs");
// Use express-ejs-layouts
app.use(expressLayouts); // Add this line

app.use(cors());
app.use(bodyParser.json());

// Set the default layout for your application
app.set("layout", "layouts/boilerplate"); // This specifies the default layout to use

// Connect to MongoDB
// mongoose
//   .connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("MongoDB connected"))
//   .catch((err) => console.error(err));

// Define routes
// app.use("/api/game", require("./routes/gameRoutes"));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

app.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});

app.get("/Mystries", (req, res) => {
  res.render("mystries", { layout: "layouts/boilerplate2", title: "Mystries" });
});

app.get("/Mystries/titanic", (req, res) => {
  res.render("titanic", { layout: "layouts/boilerplate2", title: "titanic" });
});

app.get("/Dive", (req, res) => {
  res.render("dive", { title: "Dive" });
});

app.get("/Dive/FoodChain", (req, res) => {
  res.render("foodchain", {
    layout: "layouts/boilerplate2",
    title: "FoodChain",
  });
});

app.get("/GameUi", (req, res) => {
  res.render("gameui", { title: "Game-UI" });
});

app.get("/News", (req, res) => {
  res.redirect("/CommingSoon");
});

app.get("/About/Contact", (req, res) => {
  res.render("contact", { title: "Contact" });
});

app.get("/About/Team", (req, res) => {
  res.render("team", { title: "Team" });
});

app.get("/Community/JoinUS", (req, res) => {
  res.redirect("/CommingSoon");
});

app.get("/Community/Event", (req, res) => {
  res.redirect("/CommingSoon");
});

app.get("/Community/Donation", (req, res) => {
  res.redirect("/CommingSoon");
});

app.get("/CommingSoon", (req, res) => {
  res.render("commingsoon", { title: "Comming Soon" });
});

app.get("*", (req, res) => {
  res.render("pagenotfound", { title: "404" });
});
