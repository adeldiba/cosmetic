const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const gullery_limbSchema = Schema({
    limb : { type : Schema.Types.ObjectId , ref : 'Limb'},
    image : { type : String },
} , { timestamps : true });

gullery_limbSchema.plugin(mongoosePaginate);


module.exports = mongoose.model('Gullery_limb' , gullery_limbSchema);