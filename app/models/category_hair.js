const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const category_hairSchema = Schema({
    name : { type : String , required : true},
    slug : { type : String , required : true},
    parent : { type : Schema.Types.ObjectId , ref : 'Category_hair' , default : null },
} , { timestamps : true , toJSON : { virtuals : true } });

category_hairSchema.plugin(mongoosePaginate);

category_hairSchema.virtual('childs' , {
    ref : 'Category_hair',
    localField : '_id',
    foreignField : 'parent'
});


module.exports = mongoose.model('Category_hair' , category_hairSchema);