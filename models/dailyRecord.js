const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/*
  notice there is no ID. That's because Mongoose will assign
  an ID by default to all schemas
*/

const DailyRecordSchema = new Schema({
  date: Date,
  count: Number,
});

module.exports = mongoose.model("DailyRecord", DailyRecordSchema);
