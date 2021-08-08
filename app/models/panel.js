const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const panelSchema = Schema({
    user : [{ type : Schema.Types.ObjectId , ref : 'User'}],
    name_family : { type : String, requred: true },
    phone : { type : String, requred: true },
    codeM: { type : String , requred: true },
    state : { type : String , requred: true },
    city : { type : String , requred: true },
    address : { type : String, required : true  },
    postal_code : { type : String , required : true}
} , { timestamps : true, toJSON : { virtuals : true } });

panelSchema.plugin(mongoosePaginate); 

panelSchema.virtual('payment', {
    ref: 'Payment',
    localField : '_id',
    foreignField : 'panel'
})

module.exports = mongoose.model('Panel' , panelSchema);