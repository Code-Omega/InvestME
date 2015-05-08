var mongoose = require('mongoose');
var portfolioScheme   = new mongoose.Schema({
  name: {type:String},
  description: String,
  stock_list: [String],
  assignedUser : String,
  assignedUserName : {type:String,default:"unassigned"},
  dateCreated : {type:Date,default:Date.now}
});
module.exports = mongoose.model('port', portfolioScheme);
