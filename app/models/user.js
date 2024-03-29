const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const uniqueString = require('unique-string');
const mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;

const userSchema = Schema({
    name : { type : String , required : true },
    phone : { type : String , required : true },
    admin : { type : Boolean ,  default : 0 },
    email : { type : String , unique : true  ,required : true},
    password : { type : String ,  required : true },
    rememberToken : { type : String , default : null },
} , { timestamps : true, toJSON : {virtuals : true} });

userSchema.plugin(mongoosePaginate);

userSchema.methods.hashPassword = function(password) {
  let salt = bcrypt.genSaltSync(15);
  let hash = bcrypt.hashSync(password , salt);

  return hash;
}

userSchema.methods.comparePassword = function(password) {
  return bcrypt.compareSync(password , this.password);
}

userSchema.methods.hasRole = function(roles) { 
  let result = roles.filter(role => {
      return this.roles.indexOf(role) > -1;
  })

  return !! result.length;
}

userSchema.methods.setRememberToken = function(res) {
    const token = uniqueString();
    res.cookie('remember_token' , token , { maxAge : 1000 * 60 * 60 * 24 * 30 , httpOnly : true , signed :true});
    this.update({ rememberToken : token } , err => {
        if(err) console.log(err);
    });
}


module.exports = mongoose.model('User' , userSchema);