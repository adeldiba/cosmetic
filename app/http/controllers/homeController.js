const controller = require('./controller');
const Cosmetic = require('app/models/cosmetic');
const Skin = require('app/models/skin');
const Hair = require('app/models/hair');
const Limb = require('app/models/limb');
const Comment = require('app/models/comment');
const Search = require('app/models/search');
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
   async index(req,res, next){
        try {
            let title = "وبسایت فروشگاهی";

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
            let cosmetics = Cosmetic.find({ ...query });

            if(req.query.order) 
            cosmetics.sort({ createdAt : -1}) 

            cosmetics = await cosmetics.exec();
            //////
            let searchs = Search.find({ ...query });

            if(req.query.order) 
            searchs.sort({ createdAt : -1}) 

            searchs = await searchs.exec();
            //return res.json(searchs);
            //skins
            let skins = Skin.find({ ...query });
            if(req.query.order) 
            skins.sort({ createdAt : -1}) 
            skins = await skins.exec();
            // hair
            let hairs = Hair.find({ ...query });
            if(req.query.order) 
            hairs.sort({ createdAt : -1}) 
            hairs = await hairs.exec();
            //limb
            let limbs = Limb.find({ ...query });
            if(req.query.order) 
            limbs.sort({ createdAt : -1}) 
            limbs = await limbs.exec();
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
            res.render('home/index', 
            {title,cosmetics,skins,hairs,users,limbs,logos,
             categories,categories_limb,categories_Skin,categories_hair,categories_health,categories_rosy,categories_decorative,
             categories_electric,
             cart: req.session.cart,
             key:'هر آنچه برای زیبایی و خانه تان میخواهید از به روز ترین و باکیفیت ترین محصولات را با ارزانتراز هر جایی از ما بخرید.عرضه انواع لوازم آرایشی،بهداشتی وبرقی با مارک های اصلی ومعتبر وادکلن های اورجینال و غیره'});
            }
            
        } catch (err) {
            next(err);
        }
    }

    async comment(req, res , next) {
        try {
            let status = await this.validationData(req);
            if(! status) return this.back(req,res);
        
            let newComment = new Comment({
                user : req.user.id,
                ...req.body
            });

            await newComment.save();
            this.alert(req , {
                message : 'دیدگاه شما با موفقیت ارسال شد و پس از تایید در وبسایت نمایش داده میشود',
                icon : 'success',
            })
            return this.back(req, res);
        } catch (err) {
            next(err);
        }
    }
   
}

module.exports = new homeController();
