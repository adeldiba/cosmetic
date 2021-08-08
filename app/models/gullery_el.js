const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const gullery_elSchema = Schema({
    electric : { type : Schema.Types.ObjectId , ref : 'Electric'},
    image : { type : String },
} , { timestamps : true });

gullery_elSchema.plugin(mongoosePaginate);


module.exports = mongoose.model('Gullery_el' , gullery_elSchema);