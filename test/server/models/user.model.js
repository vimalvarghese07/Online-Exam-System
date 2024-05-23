import mongoose from "mongoose";

export const UserShema = new mongoose.Schema({
    type: {
        type: String,
        required: [true, "Please provide a type"],
        unique: false
    },
    username: {
        type: String,
        required: [true, "Please provide a username"],
        unique: [true, "Please provide unique username"]
    },
    email: {
        type: String,
        required: [true,"Please provide an email"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        unique: false
    }
});

export default mongoose.model.users || mongoose.model("user", UserShema);