import mongoose from 'mongoose'


const joiningSchema = mongoose.Schema({
    empId: { type: String, require: true, unique: true },
    branch: { type: String },
    date_of_joining: { type: Date, require: true, },
    default_shift: { type: String, require: true, },
    department: { type: String, require: true, },
    reports_to: { type: String },
    designation: { type: String, require: true, },
    geo_fence: { type: String },
    profile_picture: { type: String, },
    status: { type: String },

});

export const Joining = mongoose.model("joining", joiningSchema)