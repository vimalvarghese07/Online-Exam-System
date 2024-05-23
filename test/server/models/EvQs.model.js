import mongoose from "mongoose";

export const EvQsSchema = new mongoose.Schema({
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
    fname: {
        type: String,
        required: false,
        unique: false
    },
    email: {
        type: String,
        required: false,
        unique: false
    },
    lname: {
        type: String,
        required: false,
        unique: false
    },
    dob: {
        type: String,
        required: false,
        unique: false
    },
    admin :{
        type: Array,
        required: false,
        unique: false
    },
    exam :{
        type: Array,
        required: false,
        unique: false
    },
    examUpdate :{
        type: Object,
        required: false,
        unique: false,
    },
    examAccepted :{
        type: Object,
        required: false,
        unique: false,
    },
    reqStatus :{
        type: Boolean,
        required: false,
        unique: false,
    },
});

export default mongoose.model.EvQs || mongoose.model("EvQs", EvQsSchema);