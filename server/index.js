
const express = require("express")
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const app = express()

app.use(bodyParser.json())

require("dotenv").config()
PORT = process.env.PORT || 2027

const cors = require("cors");
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

app.use(cookieParser());
app.use(express.json());


app.get("/", (req, res) => {
    res.status(200).json({
        message: "Default route - LeadTrackr",
        success: true
    })
})


const guestRoutes = require("./routes/guest");
const adminAuthRoutes = require("./routes/adminAuth");
const adminRoutes = require("./routes/admin");

app.use("/api/guest", guestRoutes);
app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api/admin", adminRoutes);

app.listen(PORT, () => {
    console.log("LeadTrackr server running on port", PORT);
})

