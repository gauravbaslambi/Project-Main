const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/votingDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const VoteSchema = new mongoose.Schema({
    voterId: String,
    candidate: String
});

const Vote = mongoose.model("Vote", VoteSchema);

app.post("/vote", async (req, res) => {
    const { voterId, candidate } = req.body;

    const existingVote = await Vote.findOne({ voterId });

    if (existingVote) {
        return res.json({
            success: false,
            message: "You already voted"
        });
    }

    const newVote = new Vote({
        voterId,
        candidate
    });

    await newVote.save();

    res.json({
        success: true,
        message: "Vote submitted successfully"
    });
});

app.get("/results", async (req, res) => {
    const results = await Vote.aggregate([
        {
            $group: {
                _id: "$candidate",
                totalVotes: { $sum: 1 }
            }
        }
    ]);

    res.json(results);
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
