const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const gullery_hairSchema = Schema({
    hair : { type : Schema.Types.ObjectId , ref : 'Hair'},
    image : { type : String },
} , { timestamps : true });

gullery_hairSchema.plugin(mongoosePaginate);


module.exports = mongoose.model('Gullery_hair' , gullery_hairSchema);