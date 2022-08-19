const express = require("express");
const connectDB = require("./config/db");
const routes = require("./routes/api");

const app = express();

//Connect database
connectDB();

//Init Middleware
//allows you to get data in the request
app.use(express.json({ extended: false }));

app.get("/", (req, res) => res.send("API running"));

//define routes
app.use("/api", routes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
