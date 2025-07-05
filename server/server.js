require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Comment = require('./models/Comment');
const cors = require('cors'); // <== add this
const form = require('./models/form');

const app = express();
app.use(cors()); // <== add this
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Add a comment or child comment
// Add a comment or child comment
app.post('/comments', async (req, res) => {
    try {
        const { postId, text, parentId } = req.body;
        const newComment = new Comment({ postId, text, parentId: parentId || null });
        await newComment.save();
        res.status(201).json(newComment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/submit', async (req, res) => {
    try {
        const userData = req.body;
        const newUser = new form(userData);
        await newUser.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// Get all comments for a post with nested replies
app.get('/comments/:postId', async (req, res) => {
    const { postId } = req.params;
    const comments = await Comment.find({ postId }).lean();
    const map = {};
    comments.forEach(comment => (map[comment._id] = { ...comment, children: [] }));

    const tree = [];
    comments.forEach(comment => {
        if (comment.parentId) {
            map[comment.parentId]?.children.push(map[comment._id]);
        } else {
            tree.push(map[comment._id]);
        }
    });

    res.json(tree);
});


// Get all comments with children nested
app.get('/comments', async (req, res) => {
    const comments = await Comment.find().lean();
    const map = {};
    comments.forEach(comment => (map[comment._id] = { ...comment, children: [] }));

    const tree = [];
    comments.forEach(comment => {
        if (comment.parentId) {
            map[comment.parentId]?.children.push(map[comment._id]);
        } else {
            tree.push(map[comment._id]);
        }
    });

    res.json(tree);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
