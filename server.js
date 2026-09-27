const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
const express = require("express");
const mongoose = require("mongoose");
const patientRoutes = require("./routes/patientRoutes");
const opdRoutes = require("./routes/opdRoutes");
const billingRoutes = require("./routes/billingRoutes");
const labRoutes = require("./routes/labRoutes");
const ipdRoutes = require("./routes/ipdRoutes");
const pharmacyRoutes = require("./routes/pharmacyRoutes");
const abdmRoutes = require("./routes/abdmRoutes");
const authRoutes = require("./routes/authRoutes");
const app = express();

app.use(express.json());
// Middlewares
const path = require("path");
app.use(express.static(path.join(__dirname, "public")));

//Routes
app.use("/api/patients", patientRoutes);
app.use("/api/opd", opdRoutes);
app.use("/api/billing", billingRoutes);
app.use("/api/lab", labRoutes);
app.use("/api/ipd", ipdRoutes);
app.use("/api/pharmacy", pharmacyRoutes);
app.use("/api/abdm", abdmRoutes);
app.use("/api/auth", authRoutes);
const PORT = 5000;

// Connect to MongoDB Atlas
mongoose
  .connect(
    "mongodb+srv://mintech_user2026:director_hain_daddy@cluster0.00gf3n8.mongodb.net/hims_portal?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log("Connected to MongoDB Atlas successfully!");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});