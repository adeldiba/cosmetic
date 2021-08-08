const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const likeSchema = Schema({
    user : { type : Schema.Types.ObjectId , ref : 'User' },
    cosmetic: { type: Schema.Types.ObjectId, ref: "Cosmetic", default : undefined},
    skin: { type: Schema.Types.ObjectId, ref: "Skin", default : undefined},
    bywhom :String,
    totalcount:{
    	type    : Number,
    	default : 0
    }
} , { timestamps : true , toJSON : { virtuals : true } });

likeSchema.plugin(mongoosePaginate);

likeSchema.virtual('likes' , {
    ref : 'Like',
    localField : '_id',
    foreignField : 'parent'
});

const likeBelong = doc => {
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

likeSchema.virtual('belongTo' , {
    ref : likeBelong,
    localField : doc => likeBelong(doc).toLowerCase(),
    foreignField : '_id',
    justOne : true
})

module.exports = mongoose.model('Like' , likeSchema);