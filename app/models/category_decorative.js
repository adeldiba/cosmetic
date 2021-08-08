const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const category_decorativeSchema = Schema({
    name : { type : String , required : true},
    slug : { type : String , required : true},
    parent : { type : Schema.Types.ObjectId , ref : 'Category_decorative' , default : null },
} , { timestamps : true , toJSON : { virtuals : true } });

category_decorativeSchema.plugin(mongoosePaginate);

category_decorativeSchema.virtual('childs' , {
    ref : 'Category_decorative',
    localField : '_id',
    foreignField : 'parent'
});


module.exports = mongoose.model('Category_decorative' , category_decorativeSchema);