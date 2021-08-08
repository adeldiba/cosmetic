const controller = require('./controller');
const Engine = require('app/models/engine');
const Contact = require('app/models/contact');
const Logo = require('app/models/logo');
const Category = require('app/models/category');
const Category_Skin = require('app/models/category_Skin');
const Category_hair = require('app/models/category_hair');
const Category_limb = require('app/models/category_limb');
const Category_electric = require('app/models/category_electric');
const Category_health = require('app/models/category_health');
const Category_rosy = require('app/models/category_rosy');
const Category_decorative = require('app/models/category_decorative');

class contactController extends controller{
   async index(req,res, next){
        try {
            let title = "تماس با ما";

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
            
            let categories = await Category.find({ parent : null }).populate('childs').exec();
            let categories_Skin = await Category_Skin.find({ parent : null }).populate('childs').exec();
            let categories_hair = await Category_hair.find({ parent : null }).populate('childs').exec();
            let categories_limb = await Category_limb.find({ parent : null }).populate('childs').exec();
            let categories_health = await Category_health.find({ parent : null }).populate('childs').exec();
            let categories_rosy = await Category_rosy.find({ parent : null }).populate('childs').exec();
            let categories_decorative = await Category_decorative.find({ parent : null }).populate('childs').exec();
            let categories_electric = await Category_electric.find({ parent : null }).populate('childs').exec();
            let logos = await Logo.find({ }).exec();
            res.render('home/contact', {title,logos,
                categories,categories_limb,categories_Skin,categories_hair,categories_health,categories_rosy,categories_decorative,
                categories_electric,});
        } catch (err) {
            next(err);
        }
    }

    async store(req , res, next) {
        
        let status = await this.validationData(req);
    if(! status) {
        return this.back(req,res);
    }
    
    let { name_family,email, phone,topic,body} = req.body;

    let newContact = new Contact({
        name_family,
        email,
        body,
        phone,
        topic,
    });

    await newContact.save();

    return res.redirect('/contact');
      
}
}

module.exports = new contactController();