import mongoose from "mongoose";

export const StudentRegSchema = new mongoose.Schema({
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
    exam: {
        type: Array,
        required: true,
        unique: false,
    },
});

export default mongoose.model.regStudents || mongoose.model("RegisteredStudent", StudentRegSchema);