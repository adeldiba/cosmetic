const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const category_healthSchema = Schema({
    name : { type : String , required : true},
    slug : { type : String , required : true},
    parent : { type : Schema.Types.ObjectId , ref : 'Category_health' , default : null },
} , { timestamps : true , toJSON : { virtuals : true } });

category_healthSchema.plugin(mongoosePaginate);

category_healthSchema.virtual('childs' , {
    ref : 'Category_health',
    localField : '_id',
    foreignField : 'parent'
});


module.exports = mongoose.model('Category_health' , category_healthSchema);