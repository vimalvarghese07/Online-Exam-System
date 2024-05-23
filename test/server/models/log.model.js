import mongoose from "mongoose";

export const logFile = new mongoose.Schema({
    username: {
        type: String,
        required:true,
        unique:false
    },
    answerArray: {
        type: Array,
        required: true,
        unique:false
    },
    markForReview:{
        type: Array,
        required: true,
        unique:false
    },
    timeLeft:{
        type: String,
        required: true,
        unique:false
    }
});

export default mongoose.model.logfiles || mongoose.model("logfile", logFile);