const controller = require('app/http/controllers/controller');
const Electric = require('app/models/electric');
const Category_electric = require('app/models/category_electric');
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
            let page = req.query.page || 1; 
            let electrics = await Electric.paginate({} , { page , sort : { createdAt : -1 } , limit : 40 });
            res.render('admin/electrics/index',  { title : 'محصولات برقی' , electrics });
        } catch (err) {
            next(err);
        }
    }

    async create(req , res, next) {
        let categories_electric  = await Category_electric .find({});
        let genders = await Gender.find({});
        //let brands = await Brand.find({});
        let performances = await Performance.find({});
        let countries = await Country.find({});
        return res.render('admin/electrics/create', {categories_electric ,performances,genders,countries});            
    }

    fake(req, res, next) {
        for(let i = 0;i < req.body.amount; i++){
             let electric = new Electric();
             electric.title = faker.name.title(),
             electric.slug = faker.name.title(),
             electric.productID = faker.commerce.price(),
             electric.body = faker.lorem.words();
             electric.body2 = faker.lorem.sentence();
             electric.file = faker.image.sports();
             electric.model = faker.vehicle.model();
             electric.price = faker.commerce.price();
             electric.type = faker.name.title();
             electric.typetwo = faker.name.title();
             electric.key = faker.name.title();
             electric.save(function(err){
                 if (err) throw err;
             });
        } 
        res.redirect('/admin/electrics');
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

        let newelectric = new Electric({
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

        await newelectric.save();
        
        return res.redirect('/admin/electrics');     
    }

    async edit(req, res ,next) {
        try {
            this.isMongoId(req.params.id);
            let electric = await Electric.findById(req.params.id);
            if( ! electric ) this.error('چنین محصولی وجود ندارد' , 404);

            let categories_electric  = await Category_electric .find({});
            let genders = await Gender.find({});
            let countries = await Country.find({});
            let performances = await Performance.find({});
            return res.render('admin/electrics/edit' , { electric, categories_electric ,performances,genders,countries});
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
       await Electric.findByIdAndUpdate( req.params.id, { $set : { ...req.body, ...objForUpdate }}) 
        .then(function(electric){
        
           
        let filename = 'http://via.placeholder.com/640x360';    
        if(!isEmpty(req.files)){
            let file = req.files.file;
             filename = Date.now() + '-' + file.name;
             electric.file = filename;
    
            file.mv('./public/uploads/' + filename, function(err){
                if(err) throw err;
        });
        }
        
        electric.save().then(function(updatedPost){
            req.flash('success_message', 'Post was successfully updated');
            return res.redirect('/admin/electrics');
        });
    });  
        } catch (err) {
            next(err);
        }
        
    }
    async destroy(req , res, next) {
        try {
            this.isMongoId(req.params.id);
             await Electric.findOne({_id: req.params.id}).populate('gullerys_is').then(function (electric){
                if( ! electric ) this.error('چنین محصولی وجود ندارد' , 404);
                electric.gullerys_is.forEach(gullery_is => gullery_is.remove());
                // delete Images
                fs.unlink(uploadDir + electric.file,(err)=>{
                    // delete electric
                    electric.remove().then(postRemoved=>{

                        req.flash('success_message', 'محصول با موفقیت حذف شد');
                        return res.redirect('/admin/electrics');
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