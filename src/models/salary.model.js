import mongoose from 'mongoose'


const salarySchema = new mongoose.Schema({

    branch_name: { type: String, required: true },
    salary_mode: { type: String, required: true },
    salary_structure: { type: String, required: true },
    account_no: { type: String, required: true },
    IFSC_code: { type: String, required: true },
    IMCR_code: { type: Number, required: true },
    PF_UAN: { type: String, required: true },
    ESIC_NO: { type: String, required: true },
    PF_ACCOUNT_no: { type: Number, required: true },
    empId: { type: String, required: true }
    
});

export const Salary = mongoose.model('salary', salarySchema);
