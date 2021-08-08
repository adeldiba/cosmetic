const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const gullery_skinSchema = Schema({
    skin : { type : Schema.Types.ObjectId , ref : 'Skin'},
    image : { type : String },
} , { timestamps : true });

gullery_skinSchema.plugin(mongoosePaginate);


module.exports = mongoose.model('Gullery_skin' , gullery_skinSchema);