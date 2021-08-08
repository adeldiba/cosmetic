const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const category_electricSchema = Schema({
    name : { type : String , required : true},
    slug : { type : String , required : true},
    parent : { type : Schema.Types.ObjectId , ref : 'Category_electric' , default : null },
} , { timestamps : true , toJSON : { virtuals : true } });

category_electricSchema.plugin(mongoosePaginate);

category_electricSchema.virtual('childs' , {
    ref : 'Category_electric',
    localField : '_id',
    foreignField : 'parent'
});


module.exports = mongoose.model('Category_electric' , category_electricSchema);