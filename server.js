const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());

mongoose.connect("mongodb://localhost:27017/hangman", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const wordSchema = new mongoose.Schema({
    language: String,
    words: {
        easy: [String],
        medium: [String],
        hard: [String],
        nightmare: [String]
    }
});

const WordModel = mongoose.model("Word", wordSchema);

app.get("/words/:language/:difficulty", async (req, res) => {
    const { language, difficulty } = req.params;
    try {
        const wordsDoc = await WordModel.findOne({ language });
        if (wordsDoc) {
            const wordsList = wordsDoc.words[difficulty] || [];
            const randomWord = wordsList.length > 0 ? wordsList[Math.floor(Math.random() * wordsList.length)] : "";
            res.json({ word: randomWord });
        } else {
            res.status(404).json({ error: "No words found" });
        }
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
