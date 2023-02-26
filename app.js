require("dotenv").config();
require("./config/database").connect();
const express = require("express");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs")

const auth = require("./middleware/auth");
const User = require("./model/user");

const app = express();

app.use(express.json());

app.get("/home", auth, (req,res)=>{
    res.status(200).send("Welcome");
});

app.post("/register", async (req, res) => {
    try {

        const { first_name, last_name, email, password } = req.body;
        if (!(first_name && last_name && email && password)) {
            return res.status(400).json({
                "meassge": "All input is required"
            });
        };
        const oldUser = await User.findOne({ email });
        if (oldUser) {
            return res.status(409).json({
                "message": "User Already Exist. Plase Login"
            });
        };

        const encryptedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            first_name,
            last_name,
            email,
            password: encryptedPassword,
        });
        const token = jwt.sign({ user_id: user._id, email }, process.env.TOKEN_KEY, { expiresIn: "1h", });
        user.token = token;
        return res.status(201).json(user);
    } catch (error) {
        console.error(error);
    };
});


app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!(email && password)) {
            return res.status(400).json({
                "message": "All input is required"
            });
        };
        const user = await User.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign({ user_id: user._id, email }, process.env.TOKEN_KEY, { expiresIn: "1h", });
            user.token = token;
            return res.status(200).json(user);
        };
        return res.status(400).json({
            "message": "Invalid Credentials"
        });
    } catch (error) {
        console.error(error);
    };
});



module.exports = app;