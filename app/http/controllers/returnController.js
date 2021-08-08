const controller = require('./controller');
const Return_p = require('app/models/return_p');
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

class returnController extends controller{
   async index(req,res, next){
        try {
            let title = "قوانین و مقررات";

            let query = {};
            let{search , type,typetwo, category, category_Skin,category_hair,category_limb,category_electric,
                category_health,category_rosy,category_decorative} = req.query;
            if(search) 
                query.title = new RegExp(search , 'gi');

            if(type && type != 'all')
                query.type = type;

            if(typetwo && typetwo != 'notavailable')
                query.typetwo = typetwo;

            if(category && category != 'all'){
                 category = await Category.findOne({slug: category}); 
            }
            if(category_Skin && category_Skin != 'all'){
                category_Skin = await Category_Skin.findOne({slug: category_Skin}); 
           } 
           if(category_hair && category_hair != 'all'){
            category_hair = await Category_hair.findOne({slug: category_hair}); 
            } 
            if(category_limb && category_limb != 'all'){
                category_limb = await Category_limb.findOne({slug: category_limb}); 
            } 
            if(category_electric && category_electric != 'all'){
                category_electric = await Category_electric.findOne({slug: category_electric}); 
            } 
            if(category_health && category_health != 'all'){
                category_health = await Category_health.findOne({slug: category_health}); 
            }
            if(category_rosy && category_rosy != 'all'){
                category_rosy = await Category_rosy.findOne({slug: category_rosy}); 
            }
            if(category_decorative && category_decorative != 'all'){
                category_decorative = await Category_decorative.findOne({slug: category_decorative}); 
            } 
           ///////////////////////////////////// 
            let return_p = Return_p.find({ ...query });

            if(req.query.order) 
            return_p.sort({ createdAt : -1}) 

            return_p = await return_p.exec();
           
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
            res.render('home/return_product', 
            {title,return_p,users,logos,
             categories,categories_limb,categories_Skin,categories_hair,categories_health,categories_rosy,categories_decorative,
             categories_electric,
             cart: req.session.cart});
            }
            
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new returnController();