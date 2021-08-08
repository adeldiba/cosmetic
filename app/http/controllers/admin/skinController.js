const controller = require('app/http/controllers/controller');
const Skin = require('app/models/skin');
const Category = require('app/models/category');
const Gender = require('app/models/gender');
//const Brand = require('app/models/brand');
const Country = require('app/models/country');
//const Device = require('app/models/device');
const faker = require('faker');
const fs = require('fs');
const { isEmpty, uploadDir } = require('app/helpers/upload-helper');

class skinController extends controller {
    async index(req , res, next) {
        try {
            let page = req.query.page || 1; 
            let skins = await Skin.paginate({} , { page , sort : { createdAt : -1 } , limit : 40 });
            res.render('admin/skins/index',  { title : 'محصولات پوست' , skins });
        } catch (err) {
            next(err);
        }
    }

    async create(req , res, next) {
        let categories = await Category.find({});
        let genders = await Gender.find({});
        //let brands = await Brand.find({});
        //let devices = await Device.find({});
        let countries = await Country.find({});
        return res.render('admin/skins/create', {categories,genders,countries});            
    }

    fake(req, res, next) {
        for(let i = 0;i < req.body.amount; i++){
             let skin = new Skin();
             skin.title = faker.name.title(),
             skin.slug = faker.name.title(),
             skin.productID = faker.commerce.price(),
             skin.body = faker.lorem.words();
             skin.body2 = faker.lorem.sentence();
             skin.file = faker.image.sports();
             skin.model = faker.vehicle.model();
             skin.price = faker.commerce.price();
             skin.type = faker.name.title();
             skin.typetwo = faker.name.title();
             skin.key = faker.name.title();
             skin.save(function(err){
                 if (err) throw err;
             });
        } 
        res.redirect('/admin/skins');
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

        let newskin = new Skin({
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

        await newskin.save();
        
        return res.redirect('/admin/skins');     
    }

    async edit(req, res ,next) {
        try {
            this.isMongoId(req.params.id);
            let skin = await Skin.findById(req.params.id);
            if( ! skin ) this.error('چنین محصولی وجود ندارد' , 404);

            let categories = await Category.find({});
            let genders = await Gender.find({});
            let countries = await Country.find({});
           
            return res.render('admin/skins/edit' , { skin, categories,genders,countries});
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
       await Skin.findByIdAndUpdate( req.params.id, { $set : { ...req.body, ...objForUpdate }}) 
        .then(function(skin){
        
           
        let filename = 'http://via.placeholder.com/640x360';    
        if(!isEmpty(req.files)){
            let file = req.files.file;
             filename = Date.now() + '-' + file.name;
             skin.file = filename;
    
            file.mv('./public/uploads/' + filename, function(err){
                if(err) throw err;
        });
        }
        
        skin.save().then(function(updatedPost){
            req.flash('success_message', 'Post was successfully updated');
            return res.redirect('/admin/skins');
        });
    });  
        } catch (err) {
            next(err);
        }
        
    }
    async destroy(req , res, next) {
        try {
            this.isMongoId(req.params.id);
             await Skin.findOne({_id: req.params.id}).populate('gullery_skins').then(function (skin){
                if( ! skin ) this.error('چنین محصولی وجود ندارد' , 404);
                
                // delete gullery
                skin.gullerys_skin.forEach(gullery_skin => gullery_skin.remove());
                // delete Images
                fs.unlink(uploadDir + skin.file,(err)=>{
                    // delete skin
                    skin.remove().then(postRemoved=>{

                        req.flash('success_message', 'محصول با موفقیت حذف شد');
                        return res.redirect('/admin/skins');
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

module.exports = new skinController();