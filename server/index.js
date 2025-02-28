const express = require("express")
const app = express()
const cors = require("cors")
const bodyParser = require("body-parser");
const path = require("path");

const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://jay886888:@tour.gr8e8.mongodb.net/?retryWrites=true&w=majority&appName=tour")
.then(() => console.log("Connected to MongoDB"))
.catch((error) => console.error("Connection error", error));

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));
app.use('/images', express.static(path.join(__dirname, 'public/images')));

const jwt = require('jsonwebtoken');

const user = require("./routes/userRoute");
const hotel = require("./routes/hotelRoute");
const places = require("./routes/placesRoute");
const restaurant = require("./routes/restaurantRoute");
const review = require("./routes/reviewRoute");

app.use(cors({
    origin: '*', // Allow all origins
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'], // Specify allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers
  }));

app.get("/verify", (req, res, next) => {
    const token = req.headers['authorization'];
    console.log(token);
    if (!token) {
      return next();
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return next();
      }
      return res.json({
        data: decoded
      });
    });
});

app.use("/user", user);
app.use("/places", places);
app.use("/hotel", hotel);
app.use("/restaurant", restaurant);
app.use("/review",review);

app.use((req, res, next) => {
  return res.status(404).send(`can't find path ${req.method} ${req.originalUrl}`);
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));