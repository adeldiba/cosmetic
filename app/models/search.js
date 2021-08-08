const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const searchSchema = Schema({
    user : { type : Schema.Types.ObjectId , ref : 'User'},
    title : { type : String  },
    cosmetic : { type : Schema.Types.ObjectId , ref : 'Cosmetic', default : undefined },
    skin : { type : Schema.Types.ObjectId , ref : 'Skin', default : undefined },
    hair : { type : Schema.Types.ObjectId , ref : 'Hair' , default : undefined },
    health : { type : Schema.Types.ObjectId , ref : 'Health' , default : undefined },
    rosy : { type : Schema.Types.ObjectId , ref : 'Rosy' , default : undefined },
    decorative : { type : Schema.Types.ObjectId , ref : 'Decorative' , default : undefined },
    limb : { type : Schema.Types.ObjectId , ref : 'Limb' , default : undefined },
    electric : { type : Schema.Types.ObjectId , ref : 'Electric' , default : undefined },
    episode : { type : Schema.Types.ObjectId , ref : 'Episode' , default : undefined },
} , { timestamps : true , toJSON : { virtuals : true } });

searchSchema.plugin(mongoosePaginate);

searchSchema.virtual('searchs' , {
    ref : 'Search',
    localField : '_id',
    foreignField : 'parent'
});

const searchBelong = doc => {
    if(doc.cosmetic) 
        return 'Cosmetic';
    else if(doc.skin)
        return 'Skin';
    else if(doc.hair)
        return 'Hair';
    else if(doc.health)
        return 'Health';
    else if(doc.rosy)
        return 'Rosy';
    else if(doc.decorative)
        return 'Decorative';
    else if(doc.electric)
        return 'Electric';
    else if(doc.limb)
        return 'Limb';
}

searchSchema.virtual('belongTo' , {
    ref : searchBelong,
    localField : doc => searchBelong(doc).toLowerCase(),
    foreignField : '_id',
    justOne : true
})

module.exports = mongoose.model('Search' , searchSchema);