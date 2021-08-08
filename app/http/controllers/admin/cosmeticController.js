const controller = require('app/http/controllers/controller');
const Cosmetic = require('app/models/cosmetic');
const Category = require('app/models/category');
const Gender = require('app/models/gender');
const Performance = require('app/models/performance');
//const Brand = require('app/models/brand');
const Country = require('app/models/country');
//const Device = require('app/models/device');
const faker = require('faker');
const fs = require('fs');
const { isEmpty, uploadDir } = require('app/helpers/upload-helper');

class cosmeticController extends controller {
    async index(req , res, next) {
        try {
            let query = {};
           let {search} = req.query;
           if(search) 
            query.title = new RegExp(search , 'gi');
            let page = req.query.page || 1; 
            let cosmetics = await Cosmetic.paginate({...query} , { page , sort : { createdAt : -1 } , limit : 40 });
            res.render('admin/cosmetics/index',  { title : 'محصولات آرایشی' , cosmetics });
        } catch (err) {
            next(err);
        }
    }

    async create(req , res, next) {
        let categories = await Category.find({});
        let genders = await Gender.find({});
        //let brands = await Brand.find({});
        let performances = await Performance.find({});
        let countries = await Country.find({});
        return res.render('admin/cosmetics/create', {categories,performances,genders,countries});            
    }

    fake(req, res, next) {
        for(let i = 0;i < req.body.amount; i++){
             let cosmetic = new Cosmetic();
             cosmetic.title = faker.name.title(),
             cosmetic.slug = faker.name.title(),
             cosmetic.productID = faker.commerce.price(),
             cosmetic.body = faker.lorem.words();
             cosmetic.body2 = faker.lorem.sentence();
             cosmetic.file = faker.image.sports();
             cosmetic.model = faker.vehicle.model();
             cosmetic.price = faker.commerce.price();
             cosmetic.type = faker.name.title();
             cosmetic.typetwo = faker.name.title();
             cosmetic.key = faker.name.title();
             cosmetic.save(function(err){
                 if (err) throw err;
             });
        } 
        res.redirect('/admin/cosmetics');
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

        let newcosmetic = new Cosmetic({
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

        await newcosmetic.save();
        
        return res.redirect('/admin/cosmetics');     
    }

    async edit(req, res ,next) {
        try {
            this.isMongoId(req.params.id);
            let cosmetic = await Cosmetic.findById(req.params.id);
            if( ! cosmetic ) this.error('چنین محصولی وجود ندارد' , 404);

            let categories = await Category.find({});
            let genders = await Gender.find({});
            let countries = await Country.find({});
            let performances = await Performance.find({});
            return res.render('admin/cosmetics/edit' , { cosmetic, categories,performances,genders,countries});
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
       await Cosmetic.findByIdAndUpdate( req.params.id, { $set : { ...req.body, ...objForUpdate }}) 
        .then(function(cosmetic){
        
           
        let filename = 'http://via.placeholder.com/640x360';    
        if(!isEmpty(req.files)){
            let file = req.files.file;
             filename = Date.now() + '-' + file.name;
             cosmetic.file = filename;
    
            file.mv('./public/uploads/' + filename, function(err){
                if(err) throw err;
        });
        }
        
        cosmetic.save().then(function(updatedPost){
            return res.redirect('/admin/cosmetics'); 
        });
    });  
        } catch (err) {
            next(err);
        }
        
    }
    async destroy(req , res, next) {
        try {
            this.isMongoId(req.params.id);
             await Cosmetic.findById(req.params.id).populate('gullerys').exec().then(function (cosmetic){
                if( ! cosmetic ) this.error('چنین محصولی وجود ندارد' , 404);
                
                // delete gullery
                cosmetic.gullerys.forEach(gullery => gullery.remove());
                // delete Images
                fs.unlink(uploadDir + cosmetic.file,(err)=>{
                    fs.unlink(uploadDir + cosmetic.file2,(err)=>{
                    // delete cosmetic
                    cosmetic.gullerys.forEach(gullery => gullery.remove());
                    cosmetic.remove().then(postRemoved=>{

                        req.flash('success_message', 'محصول با موفقیت حذف شد');
                        return res.redirect('/admin/cosmetics');
                    });
                    
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

module.exports = new cosmeticController();