import mongoose from "mongoose";

export const CenterSchema = new mongoose.Schema({
    Center:{
        type: Object,
        unique: false,
        required: false
    },

});

export default mongoose.model.centers || mongoose.model("center", CenterSchema);