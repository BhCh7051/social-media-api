const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index: true,
        validate: {
            validator: (v) => {
                return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,6}$/.test(v);
            },
        },
    },
    password: {
        type: String,
        required: true,
    },
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    followings: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    posts: [
        {
            type: String,
            ref: "User",
        },
    ],
});

userSchema.methods.comparePassword = async function (password) {
    const user = this;
    const isMatch = await bcrypt.compareSync(password, user.password);
    return isMatch;
};

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    const salt = "$2a$10$juvOZ0dxG20ugXTWn8dTD.";
    const hash = await bcrypt.hashSync(this.password, salt);
    this.password = hash;
    next();
});

module.exports = mongoose.model("User", userSchema);
