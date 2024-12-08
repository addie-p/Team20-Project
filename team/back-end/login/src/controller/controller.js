import bcrypt from "bcryptjs";
import { User } from "../models/user.js";

export const registerUser = async (req, res) => {
    console.log("Register Request Body:", req.body);
  
    try {
      const { username, password } = req.body;
  
      if (!username || !password) {
        console.warn("Missing username or password");
        return res.status(400).json({ message: "Username and password are required." });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      await User.create({ username, password: hashedPassword });
  
      res.json({ message: "User registered successfully!" });
    } catch (error) {
      if (error.name === "SequelizeUniqueConstraintError") {
        console.info(`Duplicate username attempted: ${req.body.username}`);
        return res.status(400).json({ message: "Username already exists." });
      }
      console.error("Error during registration:", error);
      res.status(500).json({ message: "An error occurred during registration." });
    }
  };
  

  
  
  export const loginUser = async (req, res) => {
    console.log("Login Request Body:", req.body); 
  
    try {
      const { username, password } = req.body;
  
      if (!username || !password) {
        console.error("Missing username or password");
        return res.status(400).json({ message: "Username and password are required." });
      }
  
      const user = await User.findOne({ where: { username } });
      if (!user) {
        console.error("Invalid username");
        return res.status(400).json({ message: "Invalid username or password." });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        console.error("Invalid password");
        return res.status(400).json({ message: "Invalid username or password." });
      }
  
      res.json({ message: "Logged in successfully!" });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ message: "An error occurred during login." });
    }
  };
  

export const logoutUser = (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ message: "Error logging out." });
    res.json({ message: "Logged out successfully!" });
  });
};
