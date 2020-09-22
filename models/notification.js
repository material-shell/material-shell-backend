const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/*
  notice there is no ID. That's because Mongoose will assign
  an ID by default to all schemas
*/

const NotificationSchema = new Schema({
  title: String,
  content: String,
  icon: String,
  action: {
    label: String,
    url: String,
  },
  date: Date,
});

module.exports = mongoose.model("Notification", NotificationSchema);
