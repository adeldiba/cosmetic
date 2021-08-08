const controller = require('./controller');
const Cosmetic = require('app/models/cosmetic');
const Panel = require('app/models/panel');
const Payment = require('app/models/payment');
const Category = require('app/models/category');
const Category_Skin = require('app/models/category_Skin');
const Category_hair = require('app/models/category_hair');
const Category_limb = require('app/models/category_limb');
const Category_electric = require('app/models/category_electric');
const Category_health = require('app/models/category_health');
const Category_rosy = require('app/models/category_rosy');
const Category_decorative = require('app/models/category_decorative');
const User = require('app/models/user');
const Logo = require('app/models/logo');

class homeController extends controller{
   async not_success(req,res, next){
        try {
            let title = "عملیات ناموفق";

            let query = {};
            let{search , type,typetwo, category } = req.query;
            if(search) 
                query.title = new RegExp(search , 'gi');

            if(type && type != 'all')
                query.type = type;

            if(typetwo && typetwo != 'notavailable')
                query.typetwo = typetwo;

            if(category && category != 'all'){
                 category = await Category.findOne({slug: category}); 
            } 
            let cosmetics = Cosmetic.find({ ...query });

            if(req.query.order) 
            cosmetics.sort({ createdAt : -1}) 

            cosmetics = await cosmetics.exec();
            let panels = await Panel.find({ user: req.user.id }).populate('payment');
            let categories = await Category.find({ parent : null }).populate('childs').exec();
            let categories_Skin = await Category_Skin.find({ parent : null }).populate('childs').exec();
            let categories_hair = await Category_hair.find({ parent : null }).populate('childs').exec();
            let categories_limb = await Category_limb.find({ parent : null }).populate('childs').exec();
            let categories_health = await Category_health.find({ parent : null }).populate('childs').exec();
            let categories_rosy = await Category_rosy.find({ parent : null }).populate('childs').exec();
            let categories_decorative = await Category_decorative.find({ parent : null }).populate('childs').exec();
            let categories_electric = await Category_electric.find({ parent : null }).populate('childs').exec();
            let users = await User.find({}).populate().exec();
            let logos = await Logo.find({}).populate().exec();
            if (req.session.cart && req.session.cart.length == 0) {
                delete req.session.cart;
                res.redirect("/cart");
            } else {
            res.render('home/not_success', 
            {title,cosmetics,users,panels,logos,
                categories,categories_limb,categories_Skin,categories_hair,categories_health,categories_rosy,categories_decorative,
                categories_electric,
             cart: req.session.cart});
            }
            
        } catch (err) {
            next(err);
        }
    }

    async success_shop(req,res, next){
        try {
            let title = "عملیات موفق";

            let query = {};
            let{search , type,typetwo, category } = req.query;
            if(search) 
                query.title = new RegExp(search , 'gi');

            if(type && type != 'all')
                query.type = type;

            if(typetwo && typetwo != 'notavailable')
                query.typetwo = typetwo;

            if(category && category != 'all'){
                 category = await Category.findOne({slug: category}); 
            } 
            let cosmetics = Cosmetic.find({ ...query });

            if(req.query.order) 
            cosmetics.sort({ createdAt : -1}) 

            cosmetics = await cosmetics.exec();
            let panels = await Panel.find({ user: req.user.id }).populate('payment');
            let payments = await Payment.find(req.params.id).populate('user').exec(); 
            let categories = await Category.find({ parent : null }).populate('childs').exec();
            let categories_Skin = await Category_Skin.find({ parent : null }).populate('childs').exec();
            let categories_hair = await Category_hair.find({ parent : null }).populate('childs').exec();
            let categories_limb = await Category_limb.find({ parent : null }).populate('childs').exec();
            let categories_health = await Category_health.find({ parent : null }).populate('childs').exec();
            let categories_rosy = await Category_rosy.find({ parent : null }).populate('childs').exec();
            let categories_decorative = await Category_decorative.find({ parent : null }).populate('childs').exec();
            let categories_electric = await Category_electric.find({ parent : null }).populate('childs').exec();
            let users = await User.find({}).populate().exec();
            let logos = await Logo.find({}).populate().exec();
            if (req.session.cart && req.session.cart.length == 0) {
                delete req.session.cart;
                res.redirect("/cart");
            } else {
            res.render('home/success_shop', 
            {title,cosmetics,users,panels,payments,logos,
                categories,categories_limb,categories_Skin,categories_hair,categories_health,categories_rosy,categories_decorative,
                categories_electric,
                cart: req.session.cart});
            }
            
        } catch (err) {
            next(err);
        }
    }

    
}

module.exports = new homeController();