  const mongoose = require('mongoose');

  const Schema = mongoose.Schema;

  // const collaboratorSchema = new Schema({

  //   //Todo change the useId name to gigsterId for confusion purposes

  //   userId: {
  //     type: Schema.Types.ObjectId,
  //     ref: "User"
  //   },
  //   approved: false,
  //   notifications :[ {
  //     type: String,
  //     trim: true
  
  //   }],
  // });

  var ProjectSchema = new Schema({

    // mongoose creates and Id automatically if specified you must create it before passing it to the model
    // through new user mongoose.Types.objectId
  // _id : mongoose.Schema.Types.ObjectId,

  title: {
    type: String,
    trim: true,
    // required: "Title is required",
    // validate: [
    //   function (input) {
    //     return input.length > 0;
    //   },
    //   "A title is required"
    // ]
  },
  //based on postal code  7 characters 6 characters plus space
  location: {
    type: String,
    trim: true,
    // required: "Address is required",


    // validate: [

    //   function (input) {
    //     return input.length <= 7;
    //   },

    //   "Location is required"
    // ]
  },

  imageUrl: {

    type: String,
    // required: "src is required",
  },

  // default gigmaker 
  userId:
  {
    type: Schema.Types.ObjectId,
    ref: "User"
  },



  // 0 to many gigsters
  gigster: [{type: mongoose.Schema.Types.ObjectId, ref: 'Collaborator'}],
// [{user_id: 1, approved: false}, {user_id: 2, approved: true}]


  description: {
    type: String,
    trim: true,
    // required: "Description is required",
    // validate: [

    //   function (input) {
    //     return input.length <= 400;
    //   },

    //   "Location is required"
    // ]
  },

  // iso format date
  startDate: {
    type: Date
  },

  // iso format date
  endDate: {
    type: Date,
  },


  duration: {
    start: Date
  },

  amount: Number


})

ProjectSchema.pre('remove', function(next) {
  // Remove all the assignment docs that reference the removed person.
      this.model('gigster').remove({ projectId: this._id }, next);


});


  var Project = mongoose.model("Project", ProjectSchema);
  // var Collaborator = mongoose.model("Collaborators", collaboratorSchema);
 



  module.exports =  Project;