import mongoose from "mongoose";

export const AnswersheetSchema = new mongoose.Schema({
    username:{
        type: String,
        unique: false,
        required: false
    },
    answersheet:{
        type: String,
        unique: false,
        required: false
    }

});

export default mongoose.model.answersheets || mongoose.model("answersheet", AnswersheetSchema)