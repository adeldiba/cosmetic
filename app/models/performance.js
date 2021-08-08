const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const performanceSchema = Schema({
    name : { type : String , required : true},
    slug : { type : String , required : true},
    parent : { type : Schema.Types.ObjectId , ref : 'Performance' , default : null },
} , { timestamps : true , toJSON : { virtuals : true } });

performanceSchema.plugin(mongoosePaginate);

performanceSchema.virtual('childs' , {
    ref : 'Performance',
    localField : '_id',
    foreignField : 'parent'
});

module.exports = mongoose.model('Performance' , performanceSchema);