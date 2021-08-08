const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const gullerySchema = Schema({
    cosmetic : { type : Schema.Types.ObjectId , ref : 'Cosmetic'},
    image : { type : String },
} , { timestamps : true });

gullerySchema.plugin(mongoosePaginate);


module.exports = mongoose.model('Gullery' , gullerySchema);