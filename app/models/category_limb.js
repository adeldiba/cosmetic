const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const category_limbSchema = Schema({
    name : { type : String , required : true},
    slug : { type : String , required : true},
    parent : { type : Schema.Types.ObjectId , ref : 'Category_limb' , default : null },
} , { timestamps : true , toJSON : { virtuals : true } });

category_limbSchema.plugin(mongoosePaginate);

category_limbSchema.virtual('childs' , {
    ref : 'Category_limb',
    localField : '_id',
    foreignField : 'parent'
});


module.exports = mongoose.model('Category_limb' , category_limbSchema);