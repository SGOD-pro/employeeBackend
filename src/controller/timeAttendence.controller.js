import shiftModel from '../models/shift.js'
import { ApiErrors } from '../utils/ApiErrors.js'
import { asyncHandler } from '../utils/asyncHandeler.js'
import { ApiResponce } from '../utils/ApiResponce.js'
import Mongoose from 'mongoose'
import holidayModel from '../models/holiday.model.js'

const setShiftDetails = asyncHandler(async (req, res) => {
    const { TSD,
        checkInAfter,
        checkInBefore,
        endTime,
        entryGP,
        exitGP,
        minHour_FullDay,
        shiftName,
        startTime,
        threshhold_HalfDay } = req.body
    console.log(req.body);
    if ([TSD, endTime, shiftName, startTime].some(item => item && item.trim() === "")) {
        throw new ApiErrors(400, "Fill up properly")
    }
    const shift = await shiftModel.create({
        TSD,
        checkInAfter,
        checkInBefore,
        endTime,
        entryGP,
        exitGP,
        minHour_FullDay,
        shiftName,
        startTime,
        threshhold_HalfDay
    })

    const responseData = await shiftModel.aggregate(
        [
            {
                $match: { _id: shift._id }
            },
            {
                $lookup: {
                    from: "joinings",
                    localField: "shiftName",
                    foreignField: "default_shift",
                    as: "employee",
                }
            },
            {
                $addFields: {
                    empCount: { $size: "$employee" },
                    id: shift._id
                }
            },
            {
                $project: {
                    shiftName: 1,
                    id: 1,
                    startTime: 1,
                    endTime: 1,
                    entryGP: 1,
                    exitGP: 1,
                    empCount: 1
                }
            }
        ]
    )
    console.log(responseData);
    res.status(200).json(new ApiResponce(200, responseData[0], "Shift added."))
})

const getShiftDetails = asyncHandler(async (req, res) => {
    let query = (req.query.query)
    console.log(query);
    if ((query !== "Morning" && query !== "Night" && query !== "Evening") || query === "null") {
        query = false
    }
    const response = await shiftModel.aggregate(
        [
            {
                $match: {
                    $and: [
                        query ? { shiftName: query } : { shiftName: { $exists: true } }
                    ]
                }
            },
            {
                $lookup: {
                    from: "joinings",
                    localField: "shiftName",
                    foreignField: "default_shift",
                    as: "employee",
                }
            },
            {
                $addFields: {
                    empCount: { $size: "$employee" },
                    id: "$_id"
                }
            },
            {
                $project: {
                    shiftName: 1,
                    id: 1,
                    startTime: 1,
                    endTime: 1,
                    entryGP: 1,
                    exitGP: 1,
                    empCount: 1
                }
            }
        ]
    )
    res.status(200).json(new ApiResponce(200, response, "Shift fetched."))
})

const popShift = asyncHandler(async (req, res) => {
    const query = new Mongoose.Types.ObjectId(req.query.query);
    await shiftModel.findByIdAndDelete(query)
    res.status(200).json(new ApiResponce(200, {}, "Deleted."))
})

const addHoliday = asyncHandler(async (req, res) => {
    const { listName, holidayName, holidayType, date, departments, designations } = req.body
    console.log(req.body);
    if ([listName, holidayName, holidayType, date].some(item => item && item.trim() === "")) {
        throw new ApiErrors(401, "Field empty")
    }

    let result = await holidayModel.create({ listName, holidayName, holidayType, date, departments, designations })
    const newDate = new Date(result.date);
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    let formattedDate = newDate.toLocaleDateString('en-GB', options);
    formattedDate = formattedDate.split(' ')
    formattedDate = formattedDate.join('/')

    console.log(formattedDate);
    res.status(200).json(new ApiResponce(200, { ...result.toJSON(), id: result._id, date: formattedDate }, "Holiday Added."))
})

const getHoliDayDetails = asyncHandler(async (req, res) => {
    let { year, status } = req.query
    if (status === "null") {
        status = null
    }
    const startDate = new Date(+year, 0, 1);
    const endDate = new Date(+year + 1, 0, 1);
    console.log(startDate, endDate);
    const response = await holidayModel.aggregate(
        [
            {
                $match: {
                    $and: [
                        status ? { holidayType: status } : { holidayType: { $exists: true } },
                        {
                            date: {
                                $gte: startDate,
                                $lt: endDate
                            }
                        }
                    ]
                }
            },
            {
                $addFields: {
                    id: "$_id",
                    date: {
                        $dateToString: {
                            format: "%d/%b/%Y",
                            date: "$date",
                        }
                    }
                }
            },
            {
                $project: {
                    listName: 1,
                    holidayName: 1,
                    holidayType: 1,
                    date: 1,
                    departments: 1,
                    designations: 1,
                    id: 1,
                }
            }
        ]
    )
    console.log(response);
    res.status(200).json(new ApiResponce(200, response, "holiday fetched"))
})
const popHoliday = asyncHandler(async (req, res) => {
    const query = new Mongoose.Types.ObjectId(req.query.id);
    await holidayModel.findByIdAndDelete(query)
    res.status(200).json(new ApiResponce(200, {}, "Holiday Deleted."))
})
export { setShiftDetails, getShiftDetails, popShift, addHoliday, getHoliDayDetails, popHoliday }