import { Router } from "express";
import { getShiftDetails, setShiftDetails,popShift, addHoliday,getHoliDayDetails, popHoliday } from "../controller/timeAttendence.controller.js";

var router = Router()
router.route('/setShift').post(setShiftDetails)
router.route('/addHoliday').post(addHoliday)
router.route('/getShift').get(getShiftDetails)
router.route('/getHoliday').get(getHoliDayDetails)
router.route('/popShift').get(popShift)
router.route('/popHoliday').get(popHoliday)
export default router