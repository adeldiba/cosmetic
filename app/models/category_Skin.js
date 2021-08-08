const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const category_SkinSchema = Schema({
    name : { type : String , required : true},
    slug : { type : String , required : true},
    parent : { type : Schema.Types.ObjectId , ref : 'Category_Skin' , default : null },
} , { timestamps : true , toJSON : { virtuals : true } });

category_SkinSchema.plugin(mongoosePaginate);

category_SkinSchema.virtual('childs' , {
    ref : 'Category_Skin',
    localField : '_id',
    foreignField : 'parent'
});


module.exports = mongoose.model('Category_Skin' , category_SkinSchema);