import mongoose from 'mongoose';

const overviewDetailsSchema = new mongoose.Schema({
    first_Name: { type: String, require: true, lowercase: true },
    middle_Name: { type: String, lowercase: true },
    email: String,
    last_Name: { type: String, require: true, lowercase: true },
    empId: { type: String, require: true },
    date_of_birth: { type: Date, require: true },
    gender: { type: String, require: true },
    postal_Code: { type: String, require: true },
    address: { type: String, require: true },
    whatsappNo: { type: String, require: true },
    addhar: { type: String },
    pan: { type: String }
});

export const Overview = mongoose.model('overview', overviewDetailsSchema);