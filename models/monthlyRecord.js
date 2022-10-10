const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MonthlyRecordSchema = new Schema({
  date: Date,
  count: Number,
});

module.exports = mongoose.model("MonthlyRecord", MonthlyRecordSchema);
