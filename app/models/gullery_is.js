const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const gullery_isSchema = Schema({
    electric : { type : Schema.Types.ObjectId , ref : 'Electric'},
    image : { type : String },
} , { timestamps : true });

gullery_isSchema.plugin(mongoosePaginate);


module.exports = mongoose.model('Gullery_is' , gullery_isSchema);