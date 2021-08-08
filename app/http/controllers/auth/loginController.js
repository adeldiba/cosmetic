const controller = require('app/http/controllers/controller');
const passport = require('passport');
const Category = require('app/models/category');
const Category_Skin = require('app/models/category_Skin');
const Category_hair = require('app/models/category_hair');
const Category_limb = require('app/models/category_limb');
const Category_electric = require('app/models/category_electric');
const Category_health = require('app/models/category_health');
const Category_rosy = require('app/models/category_rosy');
const Category_decorative = require('app/models/category_decorative');
const Logo = require('app/models/logo');

class loginController extends controller {
    
   async showLoginForm(req , res, next) {
        try{
            const title = 'صفحه ورود';
            let logos = await Logo.find({ });
            let categories = await Category.find({ parent : null }).populate('childs').exec();
            let categories_Skin = await Category_Skin.find({ parent : null }).populate('childs').exec();
            let categories_hair = await Category_hair.find({ parent : null }).populate('childs').exec();
            let categories_limb = await Category_limb.find({ parent : null }).populate('childs').exec();
            let categories_health = await Category_health.find({ parent : null }).populate('childs').exec();
            let categories_rosy = await Category_rosy.find({ parent : null }).populate('childs').exec();
            let categories_decorative = await Category_decorative.find({ parent : null }).populate('childs').exec();
            let categories_electric = await Category_electric.find({ parent : null }).populate('childs').exec();
            if (req.session.cart && req.session.cart.length == 0) {
                delete req.session.cart;
                res.redirect("/cart");
            } else {
            res.render('home/auth/login' , 
            { recaptcha : this.recaptcha.render() , title,
                categories,categories_limb,categories_Skin,categories_hair,categories_health,categories_rosy,categories_decorative,
                categories_electric,logos,key:''
                });
            }
        }catch (err){
            next(err);
        }  
    }

    async loginProccess(req  ,res , next) {
        try {
            //await this.recaptchaValidation(req , res);
            let result = await this.validationData(req)
            if(result) {
                return this.login(req, res , next)
            } 
            
            this.back(req,res);
        } catch (err) {
            next(err);
        }
    }

    login(req ,res , next) {
        try {
            passport.authenticate('local.login' , (err , user) => {
                if(!user) return res.redirect('/auth/login');
    
                req.logIn(user , err => {
                    if(req.body.remember) {
                        user.setRememberToken(res);
                    }
                    return this.alertAndBack(req, res , {
                        message : 'اکانت شما با موفقیت فعال شد',
                        icon : 'success',
                        button : 'خیلی خوب'
                    });
                    
                    return res.redirect('/');
                })
    
            })(req, res , next);
        } catch (err) {
            next(err);
        }  
    }
}

module.exports = new loginController();