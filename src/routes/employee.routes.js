import { Router } from "express";
import { EmployeeRegsiter, setSalary, setJoining, getJoining, getOverview, fetchEmployeRecords, popEmp } from "../controller/employee.controller.js";
import { upload } from "../middlewares/multer.js";
const router = Router()

router.route('/register').post(upload.fields(
    [
        { name: 'addhar', maxCount: 1 },
        { name: 'pan', maxCount: 1 }
    ]
), EmployeeRegsiter)

router.route('/joining').post(upload.single('profile_picture'), setJoining)

router.route('/salary').post(setSalary)

router.route("/getJoinning").get(getJoining)
router.route("/getOverview").get(getOverview)
router.route("/table-deitails").get(fetchEmployeRecords)
router.route("/popEmp").get(popEmp)
export default router 