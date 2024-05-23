import mongoose from "mongoose";

export const StudentSchema = new mongoose.Schema({
    profile: {
        type: String,
        required: false,
        unique: false
    },
    username: {
        type: String,
        required: true,
        unique: false
    },
    email: {
        type: String,
        required: false,
        unique: false
    },
    fname: {
        type: String,
        required: false,
        unique: false
    },
    lname: {
        type: String,
        required: false,
        unique: false
    },
    clg: {
        type: String,
        required: false,
        unique: false
    },
    reg: {
        type: String,
        required: false,
        unique: false
    },
    uni: {
        type: String,
        required: false,
        unique: false
    },
    dob: {
        type: String,
        required: false,
        unique: false
    },
    center:{
        type:String,
        required:false,
        unique:false
    }
});

export default mongoose.model.Stds || mongoose.model("Std", StudentSchema);