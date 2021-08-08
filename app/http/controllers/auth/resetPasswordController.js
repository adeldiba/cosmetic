const controller = require('app/http/controllers/controller');
const passport = require('passport');
const PasswordReset = require('app/models/password-reset');
const User = require('app/models/user');
const uniqueString = require('unique-string');
const Logo = require('app/models/logo');
const Category = require('app/models/category');
const Category_Skin = require('app/models/category_Skin');
const Category_hair = require('app/models/category_hair');
const Category_limb = require('app/models/category_limb');
const Category_electric = require('app/models/category_electric');
const Category_health = require('app/models/category_health');
const Category_rosy = require('app/models/category_rosy');
const Category_decorative = require('app/models/category_decorative');


class resetPasswordController extends controller {
    
   async showResetPassword(req , res, next) {
       try {
            const title = 'بازیابی رمز عبور';
            let logos = await Logo.find({ });
            let categories = await Category.find({ parent : null }).populate('childs').exec();
            let categories_Skin = await Category_Skin.find({ parent : null }).populate('childs').exec();
            let categories_hair = await Category_hair.find({ parent : null }).populate('childs').exec();
            let categories_limb = await Category_limb.find({ parent : null }).populate('childs').exec();
            let categories_health = await Category_health.find({ parent : null }).populate('childs').exec();
            let categories_rosy = await Category_rosy.find({ parent : null }).populate('childs').exec();
            let categories_decorative = await Category_decorative.find({ parent : null }).populate('childs').exec();
            let categories_electric = await Category_electric.find({ parent : null }).populate('childs').exec();
            res.render('home/auth/passwords/reset' , { 
            recaptcha: this.recaptcha.render(), title,
                token : req.params.token,
                categories,categories_limb,categories_Skin,categories_hair,categories_health,categories_rosy,categories_decorative,
                categories_electric,
                logos,key:''
            });
       } catch (error) {
           next(err);
       } 
    }

    async resetPasswordProccess(req  ,res , next) {
        try {
            await this.recaptchaValidation(req , res);
            let result = await this.validationData(req)
            if(result) {
                return this.resetPassword(req, res)
            } 
            this.back(req,res);
        } catch (error) {
            next(err);
        }
    }


    async resetPassword(req ,res, next) {
        try {
            let field = await PasswordReset.findOne({ $and : [ { email : req.body.email } , { token : req.body.token } ]});
            if(! field) {
                req.flash('errors' , 'اطلاعات وارد شده صحیح نیست لطفا دقت کنید');
                return this.back(req,res);
            }
    
            if(field.use) {
                req.flash('errors' , 'از این لینک برای بازیابی پسورد قبلا استفاده شده است');
                return this.back(req, res);
            }
    
            let user = await User.findOne({ email : field.email });
            user.$set({ password : user.hashPassword(req.body.password) })
            await user.save();
            if(! user) {
                req.flash('errors' , 'اپدیت شدن انجام نشد');
                return this.back();
            }
    
           await field.update({ use : true}); 
           return res.redirect('/auth/login');
        } catch (error) {
            next(err);
        }
       
    }

}

module.exports = new resetPasswordController();