const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const rosySchema = Schema({
    user : { type : Schema.Types.ObjectId , ref : 'User'},
    categories_rosy : [{type : Schema.Types.ObjectId, ref : 'Category_rosy'}],
    genders : [{type : Schema.Types.ObjectId, ref : 'Gender'}],
    countries : [{type : Schema.Types.ObjectId, ref : 'Country'}],
    performances : [{type : Schema.Types.ObjectId, ref : 'Performance'}],
    title : { type : String , required : true },
    slug : { type : String , required : true },
    type : { type : String , required : true },
    typetwo : { type : String , required : true },
    body : { type : String , required : true },
    body2 : { type : String , required : true },
    productID : {type : String },
    model : { type : String , required : true },
    notprice : { type : String },
    discount : { type : String},
    price : { type : String , required : true },
    file : { type : String },
    key : { type : String , required : true },
    viewCount : { type : Number , default : 0 },
    likeCount : { type : Number , default : 0 },
    commentCount : { type : Number , default : 0 },
} , { timestamps : true , toJSON : {virtuals : true}});

rosySchema.plugin(mongoosePaginate);

rosySchema.methods.path = function(){
    return `/rosy/${this.slug}`
}

rosySchema.methods.typeToPersian = function() {
    switch (this.type) {
        case 'bestsellers':
                return 'پرفروش ها'
            break;
        case 'popular':
            return 'محبوب ترین ها'
        break;
        case 'new':
            return 'جدید ترین ها'
        break;    
    }
}
rosySchema.methods.typetwoToPersian = function() {
    switch (this.typetwo) {
        case 'available':
                return 'موجود'
            break;
        case 'notavailable':
            return 'موجود نیست'
        break;    
    }
}

rosySchema.methods.inc = async function(field , num = 1) {
    this[field] += num;
    await this.save();
} 
rosySchema.virtual('gullerys_rosy' , {
    ref : 'Gullery_rosy',
    localField : '_id',
    foreignField : 'rosy'
})
rosySchema.virtual('comments', {
    ref : 'Comment',
    localField : '_id',
    foreignField : 'rosy'
})

module.exports = mongoose.model('Rosy' , rosySchema);