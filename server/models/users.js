var mongoose = require('mongoose');
var usersScheme   = new mongoose.Schema({
  name: {type:String},
  email: {type:String,index: { unique: true }},
  pendingTasks : [String],
  dateCreated : {type:Date,default:Date.now}
});
module.exports = mongoose.model('Users', usersScheme);
module.exports.on('index', function (err) {
  if (err) console.error(err);
})
/*module.exports.validate(function (err) {
    console.log("ERROR: ", err); // Error for Name Field because its marked as Required.
});*/


/*ValidationError(function (err) {
  if (err) console.error(err);
})*/