const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const skinSchema = Schema({
    user : { type : Schema.Types.ObjectId , ref : 'User'},
    categories_Skin : [{type : Schema.Types.ObjectId, ref : 'Category_Skin'}],
    genders : [{type : Schema.Types.ObjectId, ref : 'Gender'}],
    countries : [{type : Schema.Types.ObjectId, ref : 'Country'}],
    cosmetics : [{type : Schema.Types.ObjectId, ref : 'Cosmetic'}],
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

skinSchema.plugin(mongoosePaginate);

skinSchema.methods.path = function(){
    return `/skins/${this.slug}`
}

skinSchema.methods.typeToPersian = function() {
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
skinSchema.methods.typetwoToPersian = function() {
    switch (this.typetwo) {
        case 'available':
                return 'موجود'
            break;
        case 'notavailable':
            return 'موجود نیست'
        break;    
    }
}

skinSchema.methods.inc = async function(field , num = 1) {
    this[field] += num;
    await this.save();
} 

skinSchema.virtual('gullerys_skin' , {
    ref : 'Gullery_skin',
    localField : '_id',
    foreignField : 'skin'
});
skinSchema.virtual('searchs' , {
    ref : 'Search',
    localField : '_id',
    foreignField : 'skin'
})

skinSchema.virtual('comments', {
    ref : 'Comment',
    localField : '_id',
    foreignField : 'skin'
})

module.exports = mongoose.model('Skin' , skinSchema);