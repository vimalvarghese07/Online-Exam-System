import mongoose from "mongoose";

export const ExamSchema = new mongoose.Schema({
    examname: {
        type: String,
        required: true,
        unique: false
    },
    examdate: {
        type: String,
        required: true,
        unique: false
    },
    admin: {
        type: String,
        required: true,
        unique: false
    },
    evaluator: {
        type: String,
        required: false,
        unique: false
    },
    Qsetter: {
        type: String,
        required: false,
        unique: false
    },
    examfee: {
        type: String,
        required: false,
        unique: false
    },
    center: {
        type: Array,
        required: false,
        unique: false
    },
    questionPaper:{
        type: Object,
        required: false,
        unique: false
    },
    notificationSent:{
        type: Boolean,
        required: false,
        unique: false,
    }
});

export default mongoose.model.exam || mongoose.model("Exam", ExamSchema);