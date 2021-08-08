const controller = require('./controller');
const Hair = require('app/models/hair');
const Comment = require('app/models/comment');
const Category = require('app/models/category');
const Country = require('app/models/country');
const Category_Skin = require('app/models/category_Skin');
const Category_hair = require('app/models/category_hair');
const Category_limb = require('app/models/category_limb');
const Category_electric = require('app/models/category_electric');
const Category_health = require('app/models/category_health');
const Category_rosy = require('app/models/category_rosy');
const Category_decorative = require('app/models/category_decorative');
const Like = require('app/models/like');
const Logo = require('app/models/logo');
const Available = require('app/models/available');

class hairController extends controller{
   async index(req,res, next){
        try {
            let title = 'محصولات مو';
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
                 if(category)
                 query.categories = {$in : [category.id]}
            } 
            let page = req.query.page || 1; 
            let hairs = await Hair.paginate({...query} , { page , limit : 4 ,populate:[
                {
                    path : 'user', 
                    select : 'name'    
                } 
            ]});

            if(req.query.order) 
            hairs.sort({ createdAt : -1})

            let categories = await Category.find({ parent : null }).populate('childs').exec();
            let countries = await Country.find({}).populate().exec();  
            let logos = await Logo.find({}).populate().exec();  
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
            const promises = [Hair.count({...query}).exec() ];
            Promise.all(promises).then(([hairCount])=>{res.render("home/hairs", 
            {hairCount,hairs,countries,logos,
                categories,categories_limb,categories_Skin,categories_hair,categories_health,categories_rosy,categories_decorative,
                categories_electric,
                title,cart: req.session.cart,
                key:'وبسایت فروشگاهی گل رو با عرضه لوازم مو از جمله:رنگ مو،بهداشت و مراقبت مو،حالت دهنده مو وغیره با بهترین کیفیت و ارزانترین قیمت در خدمت شما عزیزان خواهد بود.'
            });})
            }
        } catch (err) {
            next(err);
        }
    }

    async single(req , res) {
        let hair = await Hair.findOneAndUpdate({ slug : req.params.hair },{$inc : {viewCount : 1}})
        .populate([
            {
                path : 'user',
                select : 'name'
            },
            {
                path : 'gullerys_hair',
                options : { sort : { number : 1} }
            }
        ])
        .populate([
            {
                path : 'comments',
                match : {
                    parent : null,
                    approved : true
                },
                populate : [
                    {
                        path : 'user',
                        select : 'name'
                    },
                    {
                        path : 'comments',
                        match : {
                            approved : true
                        },
                        populate : { path : 'user' , select : 'name'}
                    }   
                ]
            }
        ])
        .populate([
            {
                path : 'like'
            }
        ]);
        //return res.json(hair)
        //let canUserUse = await this.canUse(req , engine);
        let likes = await Like.findOne({}).populate('hair').exec();
        let available = await Available.find({}).populate('hair').exec();
        let logos = await Logo.find({}).populate().exec();
        let categories = await Category.find({ parent : null }).populate('childs').exec();
        let categories_Skin = await Category_Skin.find({ parent : null }).populate('childs').exec();
            let categories_hair = await Category_hair.find({ parent : null }).populate('childs').exec();
            let categories_limb = await Category_limb.find({ parent : null }).populate('childs').exec();
            let categories_health = await Category_health.find({ parent : null }).populate('childs').exec();
            let categories_rosy = await Category_rosy.find({ parent : null }).populate('childs').exec();
            let categories_decorative = await Category_decorative.find({ parent : null }).populate('childs').exec();
            let categories_electric = await Category_electric.find({ parent : null }).populate('childs').exec();
            let hairs = await Hair.paginate({} , { limit : 5 ,populate:[
                {
                    path : 'user', 
                    select : 'name'    
                } 
            ]});
            if (req.session.cart && req.session.cart.length == 0) {
                delete req.session.cart;
                res.redirect("/cart");
            } else {
        const promises = [Comment.count().exec() ];
        Promise.all(promises).then(([commentCount])=>{res.render("home/single-hair", 
        {commentCount,hair,hairs,available,likes,logos,
        categories,categories_limb,categories_Skin,categories_hair,categories_health,categories_rosy,categories_decorative,
            categories_electric,title:hair.title,key:hair.key,cart: req.session.cart});})  
    }
}
}

module.exports = new hairController();