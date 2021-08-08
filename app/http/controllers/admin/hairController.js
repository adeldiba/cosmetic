const controller = require('app/http/controllers/controller');
const Hair = require('app/models/hair');
const Category_hair = require('app/models/category_hair');
const Gender = require('app/models/gender');
const Performance = require('app/models/performance');
const Country = require('app/models/country');
//const Device = require('app/models/device');
const faker = require('faker');
const fs = require('fs');
const { isEmpty, uploadDir } = require('app/helpers/upload-helper');

class hairController extends controller {
    async index(req , res, next) {
        try {
            let page = req.query.page || 1; 
            let hairs = await Hair.paginate({} , { page , sort : { createdAt : -1 } , limit : 40 });
            res.render('admin/hairs/index',  { title : 'محصولات مو' , hairs });
        } catch (err) {
            next(err);
        }
    }

    async create(req , res, next) {
        let categories_hair = await Category_hair.find({});
        let genders = await Gender.find({});
        let performances = await Performance.find({});
        //let devices = await Device.find({});
        let countries = await Country.find({});
        return res.render('admin/hairs/create', {categories_hair,performances,genders,countries});            
    }

    fake(req, res, next) {
        for(let i = 0;i < req.body.amount; i++){
             let hair = new Hair();
             hair.title = faker.name.title(),
             hair.slug = faker.name.title(),
             hair.productID = faker.commerce.price(),
             hair.body = faker.lorem.words();
             hair.body2 = faker.lorem.sentence();
             hair.file = faker.image.sports();
             hair.model = faker.vehicle.model();
             hair.price = faker.commerce.price();
             hair.type = faker.name.title();
             hair.typetwo = faker.name.title();
             hair.key = faker.name.title();
             hair.save(function(err){
                 if (err) throw err;
             });
        } 
        res.redirect('/admin/hairs');
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

        let newhair = new Hair({
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

        await newhair.save();
        
        return res.redirect('/admin/hairs');     
    }

    async edit(req, res ,next) {
        try {
            this.isMongoId(req.params.id);
            let hair = await Hair.findById(req.params.id);
            if( ! hair ) this.error('چنین محصولی وجود ندارد' , 404);

            let categories_hair = await Category_hair.find({});
            let genders = await Gender.find({});
            let countries = await Country.find({});
            let performances = await Performance.find({});
            return res.render('admin/hairs/edit' , { hair, categories_hair,performances,genders,countries});
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
       await Hair.findByIdAndUpdate( req.params.id, { $set : { ...req.body, ...objForUpdate }}) 
        .then(function(hair){
        
           
        let filename = 'http://via.placeholder.com/640x360';    
        if(!isEmpty(req.files)){
            let file = req.files.file;
             filename = Date.now() + '-' + file.name;
             hair.file = filename;
    
            file.mv('./public/uploads/' + filename, function(err){
                if(err) throw err;
        });
        }
        
        hair.save().then(function(updatedPost){
            req.flash('success_message', 'Post was successfully updated');
            return res.redirect('/admin/hairs');
        });
    });  
        } catch (err) {
            next(err);
        }
        
    }
    async destroy(req , res, next) {
        try {
            this.isMongoId(req.params.id);
             await Hair.findOne({_id: req.params.id}).populate('gullerys_hair').then(function (hair){
                if( ! hair ) this.error('چنین محصولی وجود ندارد' , 404);
                hair.gullerys_hair.forEach(gullery_hair => gullery_hair.remove());
                // delete Images
                fs.unlink(uploadDir + hair.file,(err)=>{
                    // delete hair
                    hair.remove().then(postRemoved=>{

                        req.flash('success_message', 'محصول با موفقیت حذف شد');
                        return res.redirect('/admin/hairs');
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

module.exports = new hairController();