const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const gullery_hSchema = Schema({
    health : { type : Schema.Types.ObjectId , ref : 'Health'},
    image : { type : String },
} , { timestamps : true });

gullery_hSchema.plugin(mongoosePaginate);


module.exports = mongoose.model('Gullery_h' , gullery_hSchema);