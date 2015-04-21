var mongoose = require('mongoose');
var tasksScheme   = new mongoose.Schema({
  name: {type:String},
  description: String,
  pendingTasks : String,
  deadline : {type:Date},
  completed : {type:Boolean,default:false},
  assignedUser : String,
  assignedUserName : {type:String,default:"unassigned"},
  dateCreated : {type:Date,default:Date.now}
});
module.exports = mongoose.model('Tasks', tasksScheme);