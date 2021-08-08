const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const limbSchema = Schema({
    user : { type : Schema.Types.ObjectId , ref : 'User'},
    categories_limb : [{type : Schema.Types.ObjectId, ref : 'Category_limb'}],
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

limbSchema.plugin(mongoosePaginate);

limbSchema.methods.path = function(){
    return `/limb/${this.slug}`
}

limbSchema.methods.typeToPersian = function() {
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
limbSchema.methods.typetwoToPersian = function() {
    switch (this.typetwo) {
        case 'available':
                return 'موجود'
            break;
        case 'notavailable':
            return 'موجود نیست'
        break;    
    }
}

limbSchema.methods.inc = async function(field , num = 1) {
    this[field] += num;
    await this.save();
} 

limbSchema.virtual('gullerys_limb' , {
    ref : 'Gullery_limb',
    localField : '_id',
    foreignField : 'limb'
})

limbSchema.virtual('comments', {
    ref : 'Comment',
    localField : '_id',
    foreignField : 'limb'
})

module.exports = mongoose.model('Limb' , limbSchema);