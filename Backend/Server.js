require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;  // Store API key in .env

app.get("/search", async (req, res) => {
    const query = req.query.q;  // Get search term from frontend
    const apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&key=${YOUTUBE_API_KEY}`;

    try {
        const response = await axios.get(apiUrl);
        res.json(response.data.items);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch videos" });
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
