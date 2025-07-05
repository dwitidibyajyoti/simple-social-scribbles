const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    address: String,
    city: String,
    state: String,
    zipCode: String,
    dateOfBirth: Date,
    occupation: String,
    bio: String,
    newsletter: { type: Boolean, default: false },
    terms: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("form", userSchema);
