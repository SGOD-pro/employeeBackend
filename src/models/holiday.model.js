import mongoose from "mongoose"
const Schema = mongoose.Schema;

const yourSchemaName = new Schema({
    listName: {
        type: String,
        required: true,
    },
    holidayName: {
        type: String,
        required: true,
        lower:true,
    },
    holidayType: {
        type: String,
        enum: ['state', 'national'],
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    departments: {
        type: Array,
        default: [],
        required: true
    },
    designations: {
        type: Array,
        default: [],
        required: true
    }
});

const holidayModel = mongoose.model('holiday', yourSchemaName);

export default holidayModel;