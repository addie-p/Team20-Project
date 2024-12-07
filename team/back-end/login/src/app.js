import express from "express";
import session from "express-session";
import dotenv from "dotenv";
import cors from "cors";
import passport from "./auth/passport.js";
import routes from "./routes/routes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();


const app = express();

app.use(cors({
    origin: "http://127.0.0.1:5503", 
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"], 
    credentials: true, 
  }));

  app.options("*", (req, res) => {
    res.header("Access-Control-Allow-Origin", "http://127.0.0.1:5500");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");
    res.sendStatus(200);
  });
  

app.use(express.json()); 
app.use(express.urlencoded({ extended: false }));

app.use(express.static("public"));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "defaultSecret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/", routes);
app.use("/auth", authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
