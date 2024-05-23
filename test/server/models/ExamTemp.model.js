import mongoose from "mongoose";

export const TempExamSaveSchema = new mongoose.Schema({
    username: {
        type: String,
        required:true,
        unique:false
    },
    examname: {
        type: String,
        required: true,
        unique:false
    },
    questionPaper:{
        type: Array,
        required: true,
        unique:false
    }
});

export default mongoose.model.examTemps || mongoose.model("ExamTemp", TempExamSaveSchema);