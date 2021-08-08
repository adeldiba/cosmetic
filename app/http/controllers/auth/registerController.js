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
const User = require('app/models/user');

class registerController extends controller{
    
    async showMobileForm(req, res) {
        const title = "صفحه عضویت";

        let query = {};
        let { search, type, category } = req.query;
        if (search) query.title = new RegExp(req.query.search, "gi");

        if (type && type != "all") query.type = type;

        if (category && category != "all") {
            category = await Category.findOne({ slug: category });
            if (category) query.categories = { $in: [category.id] };
        }
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
            res.redirect("/auth/mobile");
        } else {
            res.render("home/auth/mobile", {
                recaptcha: this.recaptcha.render(),
                cart: req.session.cart,
                title,
                categories,categories_limb,categories_Skin,categories_hair,categories_health,categories_rosy,categories_decorative,
                categories_electric,
                logos,key:''
            });
        }
    }

async sendSMS(req, res, next) {
        
        req.session.ok = false;
        let { mobile } = req.body;
        const now = Math.floor(new Date().getTime() / 1000);
        if (req.session.mobile && now - (req.session.time || 0) < 300) {
            req.flash("errors", "کد تایید ارسال شده است");
            return res.redirect("/auth/register/validate");
        }
        if ("" === mobile) {
            req.flash("errors", "شماره تلفن همراه اجباری است");
            return res.redirect("/auth/register/mobile");
        }
        mobile = "0" + mobile.substr(-10);
        let user = await User.findOne({ phone: mobile });
        if (user) {
            req.flash("errors", "شماره تلفن تکراری است");
            return res.redirect("/auth/register/mobile");
        }
        req.session.mobile = mobile;
        req.session.time = Math.floor(new Date().getTime() / 1000);
        req.session.code = Math.floor(
            Math.random() * (999999 - 100000) + 100000
        );
        // const TrezSmsClient = require("trez-sms-client");
        // const client = new TrezSmsClient("omidkeyri", "node300px300px");

        // await client.sendMessage(
        //     "5000248351",
        //     "09301234567",
        //     `کد تایید شما ${req.session._code} است`,
        //     client.getRandomGroupId()
        // );

        const Kavenegar = require("kavenegar");
        const api = Kavenegar.KavenegarApi({
            apikey:
                "5539675A746F587A7473533539684A526B3867684167414F644B6C615461577370337033664247373330303D"
        });

        api.VerifyLookup(
            {
                receptor: mobile,
                token: req.session.code,
                template: "register"
            },
            function(response, status) {
                console.log(response);
                console.log(status);
            }
        );
        res.redirect("/auth/register/validate");
}

async showValidateForm(req, res) {
    const title = "صفحه عضویت";

    let query = {};
    let { search, type, category } = req.query;
    if (search) query.title = new RegExp(req.query.search, "gi");

    if (type && type != "all") query.type = type;

    if (category && category != "all") {
        category = await Category.findOne({ slug: category });
        if (category) query.categories = { $in: [category.id] };
    }
    let logos = await Logo.find({ });
    let categories = await Category.find({ parent: null }).populate("childs").exec();
    let categories_Skin = await Category_Skin.find({ parent : null }).populate('childs').exec();
        let categories_hair = await Category_hair.find({ parent : null }).populate('childs').exec();
        let categories_limb = await Category_limb.find({ parent : null }).populate('childs').exec();
        let categories_health = await Category_health.find({ parent : null }).populate('childs').exec();
        let categories_rosy = await Category_rosy.find({ parent : null }).populate('childs').exec();
        let categories_decorative = await Category_decorative.find({ parent : null }).populate('childs').exec();
        let categories_electric = await Category_electric.find({ parent : null }).populate('childs').exec();
    if (req.session.cart && req.session.cart.length == 0) {
        delete req.session.cart;
        res.redirect("/auth/validate");
    } else {
        res.render("home/auth/validate", {
            recaptcha: this.recaptcha.render(),
            cart: req.session.cart,
            title,
            key: "",
            categories,categories_limb,categories_Skin,categories_hair,categories_health,categories_rosy,categories_decorative,
            categories_electric,
            mobile: req.session.mobile,
            logos,
            key:''
        });
    }
}
async validate(req, res) {
    //await this.recaptchaValidation(req , res); 
    const { mobile, code } = req.body;
    if (mobile !== req.session.mobile) {
        req.flash("errors", "شماره تلفن همراه نامعتبر است");
        return res.redirect("/auth/register/mobile");
    }
    const now = Math.floor(new Date().getTime() / 1000);
    if (
        Number(code) !== Number(req.session.code) ||
        (now - req.session.time || 0) > 300
    ) {
        req.flash("errors", "کد تایید نامعتبر است");
        return res.redirect("/auth/register/validate");
    }
    
    const user = await User.find({phone: mobile});
    if(user.length > 0) {
        req.flash("errors", "با این شماره تلفن قبلا ثبت نام کردند.");
        return res.redirect("/auth/register/mobile");
    }

    req.session.ok = true;

    return res.redirect("/auth/register");
}
async showRegsitrationForm(req, res, next) {
    if (!req.session.ok) {
        req.flash("errors", "لطفا شماره تلفن خود را وارد کنید.");
        return redirect("/auth/register/mobile");
    }
    try {
        const title = "صفحه عضویت";

        let query = {};
        let { search, type, category } = req.query;
        if (search) query.title = new RegExp(req.query.search, "gi");

        if (type && type != "all") query.type = type;

        if (category && category != "all") {
            category = await Category.findOne({ slug: category });
            if (category) query.categories = { $in: [category.id] };
        }
        let logos = await Logo.find({ });
        let categories = await Category.find({ parent: null }).populate("childs").exec();
        let categories_hair = await Category_hair.find({ parent : null }).populate('childs').exec();
        let categories_limb = await Category_limb.find({ parent : null }).populate('childs').exec();
        let categories_health = await Category_health.find({ parent : null }).populate('childs').exec();
        let categories_rosy = await Category_rosy.find({ parent : null }).populate('childs').exec();
        let categories_decorative = await Category_decorative.find({ parent : null }).populate('childs').exec();
        let categories_electric = await Category_electric.find({ parent : null }).populate('childs').exec();
        
        if (req.session.cart && req.session.cart.length == 0) {
            delete req.session.cart;
            res.redirect("/auth/register");
        } else {
            res.render("home/auth/register", {
                recaptcha: this.recaptcha.render(),
                cart: req.session.cart,
                title,
                key: "",
                logos,
                categories,categories_limb,categories_Skin,categories_hair,categories_health,categories_rosy,categories_decorative,
                categories_electric,
                mobile: req.session.mobile,
                key:''
            });
        }
    } catch (error) {
        next(error);
    }
}

    async registerProccess(req ,res , next) {
        try {
            
            let result = await this.validationData(req)
            if(result) {
                return this.register(req, res, next)
            } 
            this.alert(req , {
                message : 'کاربر گرامی اکانت شما با موفقیت فعال شد',
                icon : 'success',
            })
            return this.back(req, res);
        } catch (err) {
            next(err);
        }  
    }

    async showRegsitrationForm(req, res, next) {
        if (!req.session.ok) {
            req.flash("errors", "لطفا شماره تلفن خود را وارد کنید.");
            return redirect("/auth/register/mobile");
        }
        try {
            const title = "صفحه عضویت";

            let query = {};
            let { search, type, category } = req.query;
            if (search) query.title = new RegExp(req.query.search, "gi");

            if (type && type != "all") query.type = type;

            if (category && category != "all") {
                category = await Category.findOne({ slug: category });
                if (category) query.categories = { $in: [category.id] };
            }
            let logos = await Logo.find({ });
            let categories = await Category.find({ parent: null }).populate("childs").exec();
            let categories_hair = await Category_hair.find({ parent : null }).populate('childs').exec();
            let categories_limb = await Category_limb.find({ parent : null }).populate('childs').exec();
            let categories_health = await Category_health.find({ parent : null }).populate('childs').exec();
            let categories_rosy = await Category_rosy.find({ parent : null }).populate('childs').exec();
            let categories_decorative = await Category_decorative.find({ parent : null }).populate('childs').exec();
            let categories_electric = await Category_electric.find({ parent : null }).populate('childs').exec();
            
            if (req.session.cart && req.session.cart.length == 0) {
                delete req.session.cart;
                res.redirect("/auth/register");
            } else {
                res.render("home/auth/register", {
                    recaptcha: this.recaptcha.render(),
                    cart: req.session.cart,
                    title,
                    key: "",
                    logos,
                    categories,categories_limb,categories_Skin,categories_hair,categories_health,categories_rosy,categories_decorative,
                    categories_electric,
                    mobile: req.session.mobile
                });
            }
        } catch (error) {
            next(error);
        }
    }
    register(req , res , next) {
        try {
            passport.authenticate('local.register' , { 
                successRedirect : '/',
                failureRedirect : '/auth/register',
                failureFlash : true
            })(req, res , next);
        } catch (err) {
           next(err) 
        }
    }
}

module.exports = new registerController();