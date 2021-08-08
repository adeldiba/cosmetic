const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const contactSchema = Schema({
    name_family : { type : String , required : true},
    email : { type : String , required : true},
    topic : { type : String , required : true},
    phone : { type : String , required : true},
    body : { type : String , required : true},
} , { timestamps : true , toJSON : { virtuals : true } });

contactSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Contact' , contactSchema);