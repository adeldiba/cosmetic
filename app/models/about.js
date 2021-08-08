const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const aboutSchema = Schema({
    title : { type : String , required : true},
    slug : { type : String , required : true }, 
    body : { type : String, required : true},
    
} , { timestamps : true, toJSON : { virtuals : true }  });

aboutSchema.plugin(mongoosePaginate); 

module.exports = mongoose.model('About' , aboutSchema); 