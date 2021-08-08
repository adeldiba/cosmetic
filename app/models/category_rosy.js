const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const category_rosySchema = Schema({
    name : { type : String , required : true},
    slug : { type : String , required : true},
    parent : { type : Schema.Types.ObjectId , ref : 'Category_rosy' , default : null },
} , { timestamps : true , toJSON : { virtuals : true } });

category_rosySchema.plugin(mongoosePaginate);

category_rosySchema.virtual('childs' , {
    ref : 'Category_rosy',
    localField : '_id',
    foreignField : 'parent'
});


module.exports = mongoose.model('Category_rosy' , category_rosySchema);