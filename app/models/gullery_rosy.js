const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const gullery_rosySchema = Schema({
    rosy : { type : Schema.Types.ObjectId , ref : 'Rosy'},
    image : { type : String },
} , { timestamps : true });

gullery_rosySchema.plugin(mongoosePaginate);


module.exports = mongoose.model('Gullery_rosy' , gullery_rosySchema);