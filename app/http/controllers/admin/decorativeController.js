const controller = require('app/http/controllers/controller');
const Decorative = require('app/models/decorative');
const Category_decorative = require('app/models/category_decorative');
const Gender = require('app/models/gender');
const Performance = require('app/models/performance');
//const Brand = require('app/models/brand');
const Country = require('app/models/country');
//const Device = require('app/models/device');
const faker = require('faker');
const fs = require('fs');
const { isEmpty, uploadDir } = require('app/helpers/upload-helper');

class decorativeController extends controller {
    async index(req , res, next) {
        try {
            let page = req.query.page || 1; 
            let decoratives = await Decorative.paginate({} , { page , sort : { createdAt : -1 } , limit : 40 });
            res.render('admin/decoratives/index',  { title : 'محصولات آرایشی' , decoratives });
        } catch (err) {
            next(err);
        }
    }

    async create(req , res, next) {
        let categories_decorative = await Category_decorative.find({});
        let genders = await Gender.find({});
        //let brands = await Brand.find({});
        let performances = await Performance.find({});
        let countries = await Country.find({});
        return res.render('admin/decoratives/create', {categories_decorative,performances,genders,countries});            
    }

    fake(req, res, next) {
        for(let i = 0;i < req.body.amount; i++){
             let decorative = new Decorative();
             decorative.title = faker.name.title(),
             decorative.slug = faker.name.title(),
             decorative.productID = faker.commerce.price(),
             decorative.body = faker.lorem.words();
             decorative.body2 = faker.lorem.sentence();
             decorative.file = faker.image.sports();
             decorative.model = faker.vehicle.model();
             decorative.price = faker.commerce.price();
             decorative.type = faker.name.title();
             decorative.typetwo = faker.name.title();
             decorative.key = faker.name.title();
             decorative.save(function(err){
                 if (err) throw err;
             });
        } 
        res.redirect('/admin/decoratives');
     }
    async store(req , res, next) {
        
        let status = await this.validationData(req);
        if(! status) {
            if(req.file) 
                fs.unlinkSync(req.file.path);
            return this.back(req,res);
        }

        // create engine
        let filename = 'http://via.placeholder.com/640x360';

            if(!isEmpty(req.files)){
                let file = req.files.file;
                 filename = Date.now() + '-' + file.name;
                

                file.mv('./public/uploads/' + filename, function(err){
                    if(err) throw err;
            });
            }
        let { title,notprice, body,body2,productID,model, type ,typetwo, price ,discount,lang, key} = req.body;

        let newdecorative = new Decorative({
            user : req.user._id,
            title,
            slug : this.slug(title), 
            body,
            body2,
            model,
            productID,
            type,
            typetwo,
            price,
            notprice,
            lang,
            discount,
            file: filename,
            key,
            likes : 0
        });

        await newdecorative.save();
        
        return res.redirect('/admin/decoratives');     
    }

    async edit(req, res ,next) {
        try {
            this.isMongoId(req.params.id);
            let decorative = await Decorative.findById(req.params.id);
            if( ! decorative ) this.error('چنین محصولی وجود ندارد' , 404);

            let categories_decorative = await Category_decorative.find({});
            let genders = await Gender.find({});
            let countries = await Country.find({});
            let performances = await Performance.find({});
            return res.render('admin/decoratives/edit' , { decorative, categories_decorative,performances,genders,countries});
        } catch (err) {
            next(err);
        }
    }

    async update(req, res , next) {
        try {
            let status = await this.validationData(req);
        if(! status) {
            if(req.file) 
                fs.unlinkSync(req.file.path);
            return this.back(req,res);
        }
        let objForUpdate = {};
        objForUpdate.slug = this.slug(req.body.title);
       await Decorative.findByIdAndUpdate( req.params.id, { $set : { ...req.body, ...objForUpdate }}) 
        .then(function(decorative){
        
           
        let filename = 'http://via.placeholder.com/640x360';    
        if(!isEmpty(req.files)){
            let file = req.files.file;
             filename = Date.now() + '-' + file.name;
             decorative.file = filename;
    
            file.mv('./public/uploads/' + filename, function(err){
                if(err) throw err;
        });
        }
        
        decorative.save().then(function(updatedPost){
            req.flash('success_message', 'Post was successfully updated');
            return res.redirect('/admin/decoratives');
        });
    });  
        } catch (err) {
            next(err);
        }
        
    }
    async destroy(req , res, next) {
        try {
            this.isMongoId(req.params.id);
             await Decorative.findOne({_id: req.params.id}).populate('episodes').then(function (decorative){
                if( ! decorative ) this.error('چنین محصولی وجود ندارد' , 404);
                
                // delete Images
                fs.unlink(uploadDir + decorative.file,(err)=>{
                    // delete decorative
                    decorative.remove().then(postRemoved=>{

                        req.flash('success_message', 'محصول با موفقیت حذف شد');
                        return res.redirect('/admin/decoratives');
                    });
                    
                }); 

            });      
        } catch (err) {
            next(err)
        }        
    }
    
    getUrlImage(dir) {
        return dir.substring(8);
    }

    slug(title) {
        return title.replace(/([^۰-۹آ-یa-z0-9]|-)+/g , "-")
    }
}

module.exports = new decorativeController();