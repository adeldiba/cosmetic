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

class forgotPasswordController extends controller {
    
   async showForgotPassword(req , res) {
       try {
        const title = 'فراموشی رمز عبور';
        let logos = await Logo.find({ });
        let categories = await Category.find({ parent : null }).populate('childs').exec();
        let categories_Skin = await Category_Skin.find({ parent : null }).populate('childs').exec();
        let categories_hair = await Category_hair.find({ parent : null }).populate('childs').exec();
        let categories_limb = await Category_limb.find({ parent : null }).populate('childs').exec();
        let categories_health = await Category_health.find({ parent : null }).populate('childs').exec();
        let categories_rosy = await Category_rosy.find({ parent : null }).populate('childs').exec();
        let categories_decorative = await Category_decorative.find({ parent : null }).populate('childs').exec();
        let categories_electric = await Category_electric.find({ parent : null }).populate('childs').exec();
        res.render('home/auth/passwords/email' , 
        {recaptcha: this.recaptcha.render(), title,
            categories,categories_limb,categories_Skin,categories_hair,categories_health,categories_rosy,categories_decorative,
            categories_electric,
            logos,key:''
        });
       } catch (error) {
           next(err);
       }
    }

    async sendPasswordResetLink(req  ,res , next) {
        try {
            await this.recaptchaValidation(req , res);
            let result = await this.validationData(req)
            if(result) {
                return this.sendResetLink(req, res)
            } 
            return this.back(req,res);
        } catch (err) {
            next(err);
        }
    }

    async sendResetLink(req ,res , next) {
        try {
            let user = await User.findOne({ email : req.body.email });
            if(! user) {
                req.flash('errors' , 'چنین کاربری وجود ندارد');
                return this.back(req, res);
            }

            const newPasswordReset = new PasswordReset({
                email : req.body.email,
                token : uniqueString()
            });
            await newPasswordReset.save();

            // Send Mail
            
            //req.flash('success', 'ایمیل بازیابی رمز عبور با موفقیت انجام شد');
            res.redirect('/');
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new forgotPasswordController();