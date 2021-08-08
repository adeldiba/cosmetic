const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const availableSchema = Schema({
    user : { type : Schema.Types.ObjectId , ref : 'User' },
    cosmetic: { type: Schema.Types.ObjectId, ref: "Cosmetic" , default : undefined},
    skin: { type: Schema.Types.ObjectId, ref: "Skin", default : undefined},
    bywhom :String,
    totalcount:{
    	type    : Number,
    	default : 0
    }
} , { timestamps : true , toJSON : { virtuals : true } });

availableSchema.plugin(mongoosePaginate);

availableSchema.virtual('availables' , {
    ref : 'Available',
    localField : '_id',
    foreignField : 'parent'
});

const availableBelong = doc => {
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

availableSchema.virtual('belongTo' , {
    ref : availableBelong,
    localField : doc => availableBelong(doc).toLowerCase(),
    foreignField : '_id',
    justOne : true
})

module.exports = mongoose.model('Available' , availableSchema);