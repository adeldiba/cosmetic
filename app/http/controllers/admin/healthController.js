const controller = require('app/http/controllers/controller');
const Health = require('app/models/health');
const Category_health = require('app/models/category_health');
const Gender = require('app/models/gender');
const Performance = require('app/models/performance');
//const Brand = require('app/models/brand');
const Country = require('app/models/country');
//const Device = require('app/models/device');
const faker = require('faker');
const fs = require('fs');
const { isEmpty, uploadDir } = require('app/helpers/upload-helper');

class healthController extends controller {
    async index(req , res, next) {
        try {
            let page = req.query.page || 1; 
            let healths = await Health.paginate({} , { page , sort : { createdAt : -1 } , limit : 40 });
            res.render('admin/healths/index',  { title : 'محصولات بهداشتی' , healths });
        } catch (err) {
            next(err);
        }
    }

    async create(req , res, next) {
        let categories_health = await Category_health.find({});
        let genders = await Gender.find({});
        //let brands = await Brand.find({});
        let performances = await Performance.find({});
        let countries = await Country.find({});
        return res.render('admin/healths/create', {categories_health,performances,genders,countries});            
    }

    fake(req, res, next) {
        for(let i = 0;i < req.body.amount; i++){
             let health = new Health();
             health.title = faker.name.title(),
             health.slug = faker.name.title(),
             health.productID = faker.commerce.price(),
             health.body = faker.lorem.words();
             health.body2 = faker.lorem.sentence();
             health.file = faker.image.sports();
             health.model = faker.vehicle.model();
             health.price = faker.commerce.price();
             health.type = faker.name.title();
             health.typetwo = faker.name.title();
             health.key = faker.name.title();
             health.save(function(err){
                 if (err) throw err;
             });
        } 
        res.redirect('/admin/healths');
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

        let newhealth = new Health({
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

        await newhealth.save();
        
        return res.redirect('/admin/healths');     
    }

    async edit(req, res ,next) {
        try {
            this.isMongoId(req.params.id);
            let health = await Health.findById(req.params.id);
            if( ! health ) this.error('چنین محصولی وجود ندارد' , 404);

            let categories_health = await Category_health.find({});
            let genders = await Gender.find({});
            let countries = await Country.find({});
            let performances = await Performance.find({});
            return res.render('admin/healths/edit' , { health, categories_health,performances,genders,countries});
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
       await Health.findByIdAndUpdate( req.params.id, { $set : { ...req.body, ...objForUpdate }}) 
        .then(function(health){
        
           
        let filename = 'http://via.placeholder.com/640x360';    
        if(!isEmpty(req.files)){
            let file = req.files.file;
             filename = Date.now() + '-' + file.name;
             health.file = filename;
    
            file.mv('./public/uploads/' + filename, function(err){
                if(err) throw err;
        });
        }
        
        health.save().then(function(updatedPost){
            req.flash('success_message', 'Post was successfully updated');
            return res.redirect('/admin/healths');
        });
    });  
        } catch (err) {
            next(err);
        }
        
    }
    async destroy(req , res, next) {
        try {
            this.isMongoId(req.params.id);
             await Health.findOne({_id: req.params.id}).populate('gullerys_h').then(function (health){
                if( ! health ) this.error('چنین محصولی وجود ندارد' , 404);
                health.gullerys_h.forEach(gullerys_h => gullerys_h.remove());
                // delete Images
                fs.unlink(uploadDir + health.file,(err)=>{
                    // delete health
                    health.remove().then(postRemoved=>{

                        req.flash('success_message', 'محصول با موفقیت حذف شد');
                        return res.redirect('/admin/healths');
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

module.exports = new healthController();