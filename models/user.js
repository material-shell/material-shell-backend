const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/*
  notice there is no ID. That's because Mongoose will assign
  an ID by default to all schemas
*/

const UserSchema = new Schema({
  ip: String,
  uuid: String,
  githubAccess: Date,
  websiteAccess: Date,
  shellAccess: Date,
  gnomeVersion: String,
  version: String,
  commit: String,
});

module.exports = mongoose.model("User", UserSchema);
