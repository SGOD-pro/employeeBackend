import { asyncHandler } from "../utils/asyncHandeler.js";
import { ApiErrors } from "../utils/ApiErrors.js";
import generateUniqueId from "../utils/EmpId.js";
import { cloudinaryUpload } from "../utils/Cloudanary.js";
import { ApiResponce } from "../utils/ApiResponce.js";
import { Joining } from "../models/joining.js";
import { Salary } from "../models/salary.model.js";
import { Overview } from "../models/overview.model.js";

const EmployeeRegsiter = asyncHandler(async (req, res) => {

    try {
        const { first_Name, middle_Name, last_Name, date_of_birth, gender, postal_Code, address, email, whatsappNo } = req.body
        console.log(req.body);


        [first_Name, last_Name, date_of_birth, gender, postal_Code, address, whatsappNo].forEach(element => {
            if (!element || element === '') {
                throw new ApiErrors(400, 'Some required fields are empty.')
            }
        });

        const empId = generateUniqueId()
        const addharPath = req.files?.addhar[0]?.path;
        const panPath = req.files?.pan[0]?.path;

        console.log(addharPath);
        console.log(panPath);

        const addhar = await cloudinaryUpload(addharPath)
        const pan = await cloudinaryUpload(panPath)

        const user = await Overview.create({
            first_Name,
            middle_Name,
            last_Name,
            date_of_birth,
            gender,
            postal_Code,
            address,
            email,
            whatsappNo,
            addhar: addhar?.url || "",
            pan: pan?.url || "",
            empId
        })

        const CreatedUser = await Overview.aggregate(
            [
                {
                    $match: {
                        _id: user._id,
                    },
                },
                {
                    $addFields: {
                        id: "$_id"
                    }
                },
                {
                    $project: {
                        first_Name: 1,
                        last_Name: 1,
                        middle_Name: 1,
                        empId: 1,
                        gender: 1,
                        id: 1
                    },
                },
            ]
        )

        console.log(CreatedUser);
        if (!CreatedUser) {
            throw new ApiErrors(500, "Some internal error occurs.")
        }


        console.log(CreatedUser);
        res.status(200).json(new ApiResponce(200, CreatedUser[0], "Employee Successfully registered."))
    } catch (error) {
        console.log(error);
        if (error instanceof ApiErrors) {
            res.status(error.statusCode).json({ error: error.message });
        } else {
            res.status(500).json({ error: "Internal server error." });
        }
    }
})

const setJoining = asyncHandler(async (req, res) => {
    try {
        const { date_of_joining, branch, department, designation, reports_to, default_shift, geo_fence = null, status, empId } = req.body
        console.log(req.body);
        if ([date_of_joining, department, designation, default_shift, empId].some(elem => elem?.trim() === '')) {
            throw new ApiErrors(400, "Fill up properly")
        }
        console.log("files", req.file);
        const profilePicturePath = req.file?.path
        let profileURL;
        if (profilePicturePath) {
            // throw new ApiErrors(401, "pic required.")
            profileURL = await cloudinaryUpload(profilePicturePath)
        }
        console.log(profileURL);
        const empJoining = await Joining.create({
            date_of_joining, branch, department, designation, reports_to: reports_to || "", default_shift, geo_fence: geo_fence || "", status, empId, profile_picture: profileURL?.url || ""
        })
        if (!empJoining) {
            throw new ApiErrors(500, "Some internal error occurs.Try again later.")
        }
        const responce = await Joining.findById(empJoining._id).select("-branch -reports_to -geo_fence -default_shift -status -empId -profile_picture")
        res.status(200).json(new ApiResponce(200, responce, "Joining saved."))
    } catch (error) {
        console.log(error);
        if (error instanceof ApiErrors) {
            console.log(error);
            res.status(error.statusCode).json({ error: error.message });
        } else {
            res.status(500).json({ error: "Internal server error." });
        }
    }
})

const setSalary = asyncHandler(async (req, res) => {
    try {
        const { salary_structure, salary_mode, branch_name, account_no, IFSC_code, IMCR_code, PF_UAN, ESIC_NO, PF_ACCOUNT_no, empId } = req.body
        // const empId = req.params.empId
        console.log(req.body);
        if ([salary_structure, salary_mode, branch_name, account_no, IFSC_code, IMCR_code, PF_UAN, ESIC_NO, PF_ACCOUNT_no, empId].some(elem => (!elem || elem?.trim() === ""))) {
            throw new ApiErrors(400, "Fill up properly.")
        }

        const empSalary = await Salary.create({
            salary_structure, salary_mode, branch_name, account_no, IFSC_code, IMCR_code, PF_UAN, ESIC_NO, PF_ACCOUNT_no, empId
        })
        if (!empSalary) {
            throw new ApiErrors(500, "Some internal error occurs.Try again later.")
        }
        const result = { ...empSalary.toJSON(), id: empSalary._id }
        res.status(200).json(new ApiResponce(200, result, "Salary saved."))
    } catch (error) {
        if (error instanceof ApiErrors) {
            res.status(error.statusCode).json({ error: error.message });
        } else {
            res.status(500).json({ error: "Internal server error." });
        }
    }
})

const getOverview = asyncHandler(async (req, res) => {
    console.log(req.query.empId);
    try {
        const emp = await Overview.findOne({ empId: req.query.empId })
        if (!emp) {
            throw new ApiErrors(404, "Employee not found");
        }
        res.status(200).json(new ApiResponce(200, emp, "Fetched success."))
    } catch (error) {
        if (error instanceof ApiErrors) {
            res.status(error.statusCode).json({ error: error.message });
        } else {
            res.status(500).json({ error: "Internal server error." });
        }
    }
})
const getJoining = asyncHandler(async (req, res) => {
    try {
        const emp = await Joining.findOne({ empId: req.query.empId })
        if (!emp) {
            throw new ApiErrors(404, "Employee not found");
        }
        const date = new Date(emp.date_of_joining);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = date.toLocaleDateString('en-US', options);
        emp.date_of_joining = formattedDate
        console.log(emp);
        res.status(200).json(new ApiResponce(200, emp, "Fetched success."))
    } catch (error) {
        console.log(error.message);
        if (error instanceof ApiErrors) {
            res.status(error.statusCode).json({ error: error.message });
        } else {
            res.status(500).json({ error: "Internal server error." });
        }
    }
})

const fetchEmployeRecords = asyncHandler(async (req, res) => {

    try {
        const responce = await Overview.aggregate([
            {
                $lookup: {
                    from: "joinings",
                    localField: "empId",
                    foreignField: "empId",
                    as: "joiningDetails",
                    pipeline: [
                        {
                            $project: {
                                date_of_joining: 1,
                                active: 1,
                                department: 1,
                                designation: 1,
                            }
                        }
                    ]
                },
            },
            {
                $addFields: {
                    date_of_joining: { $first: "$joiningDetails.date_of_joining" },
                    department: { $first: "$joiningDetails.department" },
                    designation: { $first: "$joiningDetails.designation" }
                }
            },
            {
                $project: {
                    id: "$_id",
                    empId: 1,
                    first_Name: 1,
                    last_Name: 1,
                    middle_Name: 1,
                    gender: 1,
                    date_of_joining: 1,
                    department: 1,
                    designation: 1,
                    _id: 0,
                }
            }
        ])

        if (!responce) {
            throw new ApiErrors(404, "No Data found.")
        }
        res.status(200).json(new ApiResponce(200, responce, "Fetched Successfully."))
    } catch (error) {
        if (error instanceof ApiErrors) {
            res.status(error.statusCode).json({ error: error.message });
        } else {
            res.status(500).json({ error: "Internal server error." });
        }
    }
})

const popEmp = asyncHandler(async (req, res) => {
    const { id } = req.query
    const a = await Overview.findByIdAndDelete(id)
    const b = await Salary.findOneAndDelete({ empId: a.empId })
    const c = await Joining.findOneAndDelete({ empId: a.empId })
    console.log(a, b, c);
    res.status(200).json(200, {}, "EMPLOYEE DELETED")
})
export { EmployeeRegsiter, setSalary, setJoining, getJoining, getOverview, fetchEmployeRecords, popEmp }