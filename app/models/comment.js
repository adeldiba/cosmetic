const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const commentSchema = Schema({
    user : { type : Schema.Types.ObjectId , ref : 'User'},
    parent : { type : Schema.Types.ObjectId , ref : 'Comment' , default : null },
    approved : { type : Boolean , default : false },
    cosmetic : { type : Schema.Types.ObjectId , ref : 'Cosmetic' , default : undefined },
    skin : { type : Schema.Types.ObjectId , ref : 'Skin' , default : undefined },
    hair : { type : Schema.Types.ObjectId , ref : 'Hair' , default : undefined },
    health : { type : Schema.Types.ObjectId , ref : 'Health' , default : undefined },
    rosy : { type : Schema.Types.ObjectId , ref : 'Rosy' , default : undefined },
    decorative : { type : Schema.Types.ObjectId , ref : 'Decorative' , default : undefined },
    limb : { type : Schema.Types.ObjectId , ref : 'Limb' , default : undefined },
    electric : { type : Schema.Types.ObjectId , ref : 'Electric' , default : undefined },
    episode : { type : Schema.Types.ObjectId , ref : 'Episode' , default : undefined },
    comment : { type : String , required  : true}
} , { timestamps : true , toJSON : { virtuals : true } });

commentSchema.plugin(mongoosePaginate);

commentSchema.virtual('comments' , {
    ref : 'Comment',
    localField : '_id',
    foreignField : 'parent'
});

const commentBelong = doc => {
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

commentSchema.virtual('belongTo' , {
    ref : commentBelong,
    localField : doc => commentBelong(doc).toLowerCase(),
    foreignField : '_id',
    justOne : true
})

module.exports = mongoose.model('Comment' , commentSchema);