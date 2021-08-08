const controller = require('./controller');
const Search = require('app/models/search');
const Cosmetic = require('app/models/cosmetic');
const Skin = require('app/models/skin');
const Hair = require('app/models/hair');
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
const Logo = require('app/models/logo');


class searchController extends controller{
   async index(req,res, next){
        try {
            let query = {};
           let {search} = req.query;
           if(search) 
            query.title = new RegExp(search , 'gi');
            let title = 'جستجو';
           let categories = await Category.find({ parent : null }).populate('childs').exec();
           let categories_Skin = await Category_Skin.find({ parent : null }).populate('childs').exec();
           let categories_hair = await Category_hair.find({ parent : null }).populate('childs').exec();
           let categories_limb = await Category_limb.find({ parent : null }).populate('childs').exec();
           let categories_health = await Category_health.find({ parent : null }).populate('childs').exec();
           let categories_rosy = await Category_rosy.find({ parent : null }).populate('childs').exec();
           let categories_decorative = await Category_decorative.find({ parent : null }).populate('childs').exec();
           let categories_electric = await Category_electric.find({ parent : null }).populate('childs').exec();
           let countries = await Country.find({}).populate().exec();
           let genders = await Gender.find({}).populate().exec();
           let logos = await Logo.find({}).populate().exec();
           let performances = await Performance.find({}).populate().exec();  
           let page = req.query.page || 1; 
           
        //    let searchs =  await Search.paginate({...query},{ page , limit : 4,populate: 'skin' })
        // res.render("home/search", 
        //     {genders,performances,countries,searchs,
        //         categories,categories_limb,categories_Skin,categories_hair,categories_health,categories_rosy,categories_decorative,
        //         categories_electric,logos,
        //         title,cart: req.session.cart,
        //         key:''});

           
           let cosmetics =  await Cosmetic.paginate({...query} , { page , limit : 4 })
           let skins = await Skin.paginate({...query}, { page , limit : 4 });
           if(!cosmetics ){
                //return res.json(search);
                res.render("home/search_cosmetic", 
            {genders,performances,countries,cosmetics,//searchs,
                categories,categories_limb,categories_Skin,categories_hair,categories_health,categories_rosy,categories_decorative,
                categories_electric,logos,
                title,cart: req.session.cart,
                key:''});
          
            }else if(!skins){
                const promises = [Cosmetic.count({...query})];
            Promise.all(promises).then(([cosmeticCount])=>{
               //return res.json(search);
                res.render("home/search_skin", 
            {cosmeticCount,genders,performances,countries,skins,//searchs,
                categories,categories_limb,categories_Skin,categories_hair,categories_health,categories_rosy,categories_decorative,
                categories_electric,logos,
                title,cart: req.session.cart,
                key:''});})
            } 
            //return res.json(skins)
            //return res.render('home/search',searchs);
           
            
            
           
        
          // let cosmetics =  await Cosmetic.paginate({...query} , { page , limit : 4 })
          //  const promises = [Cosmetic.count({...query}).exec() ];
          ///  Promise.all(promises).then(([cosmeticCount])=>{res.render("home/cosmetics", 
          //  {cosmeticCount,cosmetics,genders,performances,countries,
          //      categories,categories_limb,categories_Skin,categories_hair,categories_health,categories_rosy,categories_decorative,
          //      categories_electric,logos,
          ///      title,cart: req.session.cart,
         //       key:''});})
        

        //await Skin.paginate({...Op} , { page , limit : 4 })
        // [Skin.count({...query}).exec() ];
        //    Promise.all(promises).then(([skinCount])=>{res.render("home/skins", 
        //    {skinCount,skins,countries,cosmetics,
        //        categories,categories_limb,categories_Skin,categories_hair,categories_health,categories_rosy,categories_decorative,
         //       categories_electric,logos,
        //        performances,title,cart: req.session.cart,
       //         key:''
        //    });})
            
        } catch (err) {
            next(err);
        }
    }

    async store(req, res , next) {
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


module.exports = new searchController();
