const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    first_name: { type: String, required: true, trim: true, lowercase: true },
    last_name: { type: String, required: true, trim: true, lowercase: true },
    email: { type: String, requried: true, unique: true, lowercase: true },
    password: { type: String, required: true, trim: true, minLength: 9 },
    token: { type: String },
});

module.exports = mongoose.model("user", userSchema);