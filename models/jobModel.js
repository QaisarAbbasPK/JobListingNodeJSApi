const mongoose = require('mongoose');

const JobSchema = mongoose.Schema({
    title : {
        required : [true, 'title is required'],
        type : String,
        lowercase: true,
        trim:true,
    },
    company : {
        required : [true, 'company name is required'],
        type :  String,
        lowercase: true,
        trim:true,
    },
    location : {
        required : [true, 'location is required'],
        type :  String,
        lowercase: true,
        trim:true,
    },
    date: { 
        type: Date,
        default: Date.now
    },
    email: {
        required: [true, 'email is required'],
        type: String,
        lowercase: true,
        trim: true,
    },
    leave_type: {
        type: String,
        required: [true, 'select leave type monthly, weekly, or seldom'],
        lowercase: true,
        trim:true,
   },
   trending:{
       type:Boolean,
       default: false
   },
           
});



module.exports = mongoose.model('joblisting', JobSchema);