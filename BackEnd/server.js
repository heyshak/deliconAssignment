const express = require("express");
const cors = require("cors");
const app = express();

//Database Connection
const connectDB = require("./config/db");
connectDB();

//Middleware
app.use(cors());
app.use(express.json({ extended: true }));
app.use("/user", require("./routes/users"));
app.use("/auth", require("./routes/auth"));
app.use("/addhotel", require("./routes/hotel"));

//PORT configuration
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Listening on ${PORT} port`));
