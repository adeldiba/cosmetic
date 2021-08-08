const controller = require('app/http/controllers/controller');
const Limb = require('app/models/limb');
const Category_limb = require('app/models/category_limb');
const Gender = require('app/models/gender');
const Performance = require('app/models/performance');
//const Brand = require('app/models/brand');
const Country = require('app/models/country');
//const Device = require('app/models/device');
const faker = require('faker');
const fs = require('fs');
const { isEmpty, uploadDir } = require('app/helpers/upload-helper');

class limbController extends controller {
    async index(req , res, next) {
        try {
            let page = req.query.page || 1; 
            let limbs = await Limb.paginate({} , { page , sort : { createdAt : -1 } , limit : 40 });
            res.render('admin/limbs/index',  { title : 'محصولات بدن' , limbs });
        } catch (err) {
            next(err);
        }
    }

    async create(req , res, next) {
        let categories_limb = await Category_limb.find({});
        let genders = await Gender.find({});
        //let brands = await Brand.find({});
        let performances = await Performance.find({});
        let countries = await Country.find({});
        return res.render('admin/limbs/create', {categories_limb,performances,genders,countries});            
    }

    fake(req, res, next) {
        for(let i = 0;i < req.body.amount; i++){
             let limb = new Limb();
             limb.title = faker.name.title(),
             limb.slug = faker.name.title(),
             limb.productID = faker.commerce.price(),
             limb.body = faker.lorem.words();
             limb.body2 = faker.lorem.sentence();
             limb.file = faker.image.sports();
             limb.model = faker.vehicle.model();
             limb.price = faker.commerce.price();
             limb.type = faker.name.title();
             limb.typetwo = faker.name.title();
             limb.key = faker.name.title();
             limb.save(function(err){
                 if (err) throw err;
             });
        } 
        res.redirect('/admin/limbs');
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

        let newlimb = new Limb({
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

        await newlimb.save();
        
        return res.redirect('/admin/limbs');     
    }

    async edit(req, res ,next) {
        try {
            this.isMongoId(req.params.id);
            let limb = await Limb.findById(req.params.id);
            if( ! limb ) this.error('چنین محصولی وجود ندارد' , 404);

            let categories_limb = await Category_limb.find({});
            let genders = await Gender.find({});
            let countries = await Country.find({});
            let performances = await Performance.find({});
            return res.render('admin/limbs/edit' , { limb, categories_limb,performances,genders,countries});
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
       await Limb.findByIdAndUpdate( req.params.id, { $set : { ...req.body, ...objForUpdate }}) 
        .then(function(limb){
        
           
        let filename = 'http://via.placeholder.com/640x360';    
        if(!isEmpty(req.files)){
            let file = req.files.file;
             filename = Date.now() + '-' + file.name;
             limb.file = filename;
    
            file.mv('./public/uploads/' + filename, function(err){
                if(err) throw err;
        });
        }
        
        limb.save().then(function(updatedPost){
            req.flash('success_message', 'Post was successfully updated');
            return res.redirect('/admin/limbs');
        });
    });  
        } catch (err) {
            next(err);
        }
        
    }
    async destroy(req , res, next) {
        try {
            this.isMongoId(req.params.id);
             await Limb.findOne({_id: req.params.id}).populate('gullerys_limb').then(function (limb){
                if( ! limb ) this.error('چنین محصولی وجود ندارد' , 404);
                hair.gullerys_limb.forEach(gullery_limb => gullery_limb.remove());
                // delete Images
                fs.unlink(uploadDir + limb.file,(err)=>{
                    // delete limb
                    limb.remove().then(postRemoved=>{

                        req.flash('success_message', 'محصول با موفقیت حذف شد');
                        return res.redirect('/admin/limbs');
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

module.exports = new limbController();