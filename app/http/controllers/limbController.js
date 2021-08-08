const controller = require('./controller');
const Limb = require('app/models/limb');
const Comment = require('app/models/comment');
const Category = require('app/models/category');
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

class rosyController extends controller{
   async index(req,res, next){
        try {
            let title = 'خوشبو کننده ها';
            let query = {};
            let{search , type,typetwo, category,category_limb } = req.query;
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
            if(category_limb && category_limb != 'all'){
                category_limb = await Category_limb.findOne({slug: category_limb}); 
                if(category)
                query.categories_limb = {$in : [category_limb.id]}
           } 
           /////////////////
            let page = req.query.page || 1; 
            let limbs = await Limb.paginate({...query} , { page , limit : 4 ,populate:[
                {
                    path : 'user', 
                    select : 'name'    
                } 
            ]});

            if(req.query.order) 
            limbs.sort({ createdAt : -1})

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
            const promises = [Limb.count({...query}).exec() ];
            Promise.all(promises).then(([limbCount])=>{res.render("home/limb", 
            {limbCount,limbs,genders,performances,countries,
                categories,categories_limb,categories_Skin,categories_hair,categories_health,categories_rosy,categories_decorative,
                categories_electric,logos,
                title,cart: req.session.cart,
                key:'وبسایت فروشگاهی گل رو با عرضه لوازم بدن از جمله:مراقبت بدن،بهداشت بدن،اصلاح بدن وغیره با بهترین کیفیت و ارزانترین قیمت در خدمت شما عزیزان خواهد بود.'
            });})
            }
        } catch (err) {
            next(err);
        }
    }

    async single(req , res) {
        let limb = await Limb.findOneAndUpdate({ slug : req.params.limb },{$inc : {viewCount : 1}})
        .populate([
            {
                path : 'user',
                select : 'name'
            },
            {
                path : 'gullerys_limb',
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
        let likes = await Like.findOne({}).populate('limb').exec();
        let available = await Available.find({}).populate('limb').exec();
        let logos = await Logo.find({}).populate().exec();
        let categories = await Category.find({ parent : null }).populate('childs').exec();
        let categories_Skin = await Category_Skin.find({ parent : null }).populate('childs').exec();
        let categories_hair = await Category_hair.find({ parent : null }).populate('childs').exec();
        let categories_limb = await Category_limb.find({ parent : null }).populate('childs').exec();
        let categories_health = await Category_health.find({ parent : null }).populate('childs').exec();
        let categories_rosy = await Category_rosy.find({ parent : null }).populate('childs').exec();
        let categories_decorative = await Category_decorative.find({ parent : null }).populate('childs').exec();
        let categories_electric = await Category_electric.find({ parent : null }).populate('childs').exec();
        let limbs = await Limb.paginate({} , { limit : 5 ,populate:[
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
        Promise.all(promises).then(([commentCount])=>{res.render("home/single-limb", 
        {commentCount,limb,available,likes,logos,limbs,
            categories,categories_limb,categories_Skin,categories_hair,categories_health,categories_rosy,categories_decorative,
            categories_electric,cart: req.session.cart,title:limb.title,key:limb.key
        });
    })
}
        
    }
}

module.exports = new rosyController();