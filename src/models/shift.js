import mongoose from "mongoose"
const Schema = mongoose.Schema;

const yourSchemaName = new Schema({
  TSD: { type: String, required: true },
  checkInAfter: { type: String },
  checkInBefore: { type: String },
  endTime: { type: String ,required:true},
  entryGP: { type: String },
  exitGP: { type: String },
  minHour_FullDay: { type: Number },
  shiftName: { type: String ,required:true},
  startTime: { type: String ,required:true},
  threshhold_HalfDay: { type: Number }
});

const shiftModel = mongoose.model('shift', yourSchemaName);

export default shiftModel;