const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const genderSchema = Schema({
    name : { type : String , required : true},
    slug : { type : String , required : true},
    parent : { type : Schema.Types.ObjectId , ref : 'Gender' , default : null },
} , { timestamps : true , toJSON : { virtuals : true } });

genderSchema.plugin(mongoosePaginate);

genderSchema.virtual('childs' , {
    ref : 'Gender',
    localField : '_id',
    foreignField : 'parent'
});

module.exports = mongoose.model('Gender' , genderSchema);