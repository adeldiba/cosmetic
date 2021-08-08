const controller = require('./controller');
const Health = require('app/models/health');
const Comment = require('app/models/comment');
const Category= require('app/models/category_health');
const Category_Skin = require('app/models/category_Skin');
const Category_hair = require('app/models/category_hair');
const Category_limb = require('app/models/category_limb');
const Category_electric = require('app/models/category_electric');
const Category_health = require('app/models/category_health');
const Category_rosy = require('app/models/category_rosy');
const Category_decorative = require('app/models/category_decorative');
const Country = require('app/models/country');
const Gender = require('app/models/gender');
const Performance = require('app/models/performance');
const Like = require('app/models/like');
const Logo = require('app/models/logo');
const Available = require('app/models/available');

class healthController extends controller{
   async index(req,res, next){
        try {
            let title = 'لوازم آرایشی';
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
                 if(category)
                 query.categories = {$in : [category.id]}
            } 
            if(category_Skin && category_Skin != 'all'){
                category_Skin = await Category_Skin.findOne({slug: category_Skin}); 
                if(category_Skin)
                query.categories_Skin = {$in : [category_Skin.id]}
           } 
           ////////
           if(category_hair && category_hair != 'all'){
            category_hair = await Category_hair.findOne({slug: category_hair}); 
            if(category_hair)
                query.categories_hair = {$in : [category_hair.id]}
            } 
            //////
            if(category_limb && category_limb != 'all'){
                category_limb = await Category_limb.findOne({slug: category_limb}); 
                if(category_limb)
                query.categories_limb = {$in : [category_limb.id]}
            }
            /////
            if(category_electric && category_electric != 'all'){
                category_electric = await Category_electric.findOne({slug: category_electric}); 
                if(category_electric)
                query.categories_electric = {$in : [category_electric.id]}
            } 
            ////
            if(category_health && category_health != 'all'){
                category_health = await Category_health.findOne({slug: category_health}); 
                if(category_health)
                query.categories_health = {$in : [category_health.id]}
            }
            ///
            if(category_rosy && category_rosy != 'all'){
                category_rosy = await Category_rosy.findOne({slug: category_rosy}); 
                if(category_rosy)
                query.categories_rosy = {$in : [category_rosy.id]}
            }
            if(category_decorative && category_decorative != 'all'){
                category_decorative = await Category_decorative.findOne({slug: category_decorative}); 
                if(category_decorative)
                query.categories_decorative = {$in : [category_decorative.id]}
            } 
           /////////////////
            let page = req.query.page || 1; 
            let healths = await Health.paginate({...query} , { page , limit : 4 ,populate:[
                {
                    path : 'user', 
                    select : 'name'    
                } 
            ]});

            if(req.query.order) 
            healths.sort({ createdAt : -1})

            let categories = await Category.find({ parent : null }).populate('childs').exec();
            let countries = await Country.find({}).populate().exec();
            let genders = await Gender.find({}).populate().exec();
            let logos = await Logo.find({}).populate().exec();
            let performances = await Performance.find({}).populate().exec();
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
            const promises = [Health.count({...query}).exec() ];
            Promise.all(promises).then(([healthCount])=>{res.render("home/health", 
            {healthCount,healths,genders,performances,countries,
                categories,categories_limb,categories_Skin,categories_hair,categories_health,categories_rosy,categories_decorative,
             categories_electric,logos,
             title,cart: req.session.cart,
             key:'وبسایت فروشگاهی گل رو با عرضه لوازم بهداشت شخصی از جمله:بهداشت دهان و دندان وغیره با بهترین کیفیت و ارزانترین قیمت در خدمت شما عزیزان خواهد بود.'
            });})
            }
        } catch (err) {
            next(err);
        }
    }

    async single(req , res) {
        let health = await Health.findOneAndUpdate({ slug : req.params.health },{$inc : {viewCount : 1}})
        .populate([
            {
                path : 'user',
                select : 'name'
            },
            {
                path : 'gullerys_h',
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
        //return res.json(cosmetic)
        //let canUserUse = await this.canUse(req , engine);
        let likes = await Like.findOne({}).populate('health').exec();
        let available = await Available.find({}).populate('health').exec();
        let logos = await Logo.find({}).populate().exec();
        let categories = await Category.find({ parent : null }).populate('childs').exec();
        let categories_Skin = await Category_Skin.find({ parent : null }).populate('childs').exec();
        let categories_hair = await Category_hair.find({ parent : null }).populate('childs').exec();
        let categories_limb = await Category_limb.find({ parent : null }).populate('childs').exec();
        let categories_health = await Category_health.find({ parent : null }).populate('childs').exec();
        let categories_rosy = await Category_rosy.find({ parent : null }).populate('childs').exec();
        let categories_decorative = await Category_decorative.find({ parent : null }).populate('childs').exec();
        let categories_electric = await Category_electric.find({ parent : null }).populate('childs').exec();
        let healthes = await Health.paginate({} , { limit : 5 ,populate:[
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
        Promise.all(promises).then(([commentCount])=>{res.render("home/single-health", 
        {commentCount,categories,health,available,likes,healthes,categories_health,categories_Skin,categories_hair,
            categories_limb,categories_rosy,categories_decorative,categories_electric,logos,
            cart: req.session.cart,title:health.title,key:health.key
            
        });})
        
    }
}
}

module.exports = new healthController();