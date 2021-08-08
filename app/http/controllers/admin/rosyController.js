const controller = require('app/http/controllers/controller');
const Rosy = require('app/models/rosy');
const Category_rosy = require('app/models/category_rosy');
const Gender = require('app/models/gender');
const Performance = require('app/models/performance');
const Country = require('app/models/country');
//const Device = require('app/models/device');
const faker = require('faker');
const fs = require('fs');
const { isEmpty, uploadDir } = require('app/helpers/upload-helper');

class rosyController extends controller {
    async index(req , res, next) {
        try {
            let page = req.query.page || 1; 
            let rosys = await Rosy.paginate({} , { page , sort : { createdAt : -1 } , limit : 40 });
            res.render('admin/rosys/index',  { title : 'خوشبو کننده ها' , rosys });
        } catch (err) {
            next(err);
        }
    }

    async create(req , res, next) {
        let categories_rosy = await Category_rosy.find({});
        let genders = await Gender.find({});
        let performances = await Performance.find({});
        //let devices = await Device.find({});
        let countries = await Country.find({});
        return res.render('admin/rosys/create', {categories_rosy,genders,countries,performances});            
    }

    fake(req, res, next) {
        for(let i = 0;i < req.body.amount; i++){
             let rosy = new Rosy();
             rosy.title = faker.name.title(),
             rosy.slug = faker.name.title(),
             rosy.productID = faker.commerce.price(),
             rosy.body = faker.lorem.words();
             rosy.body2 = faker.lorem.sentence();
             rosy.file = faker.image.sports();
             rosy.model = faker.vehicle.model();
             rosy.price = faker.commerce.price();
             rosy.type = faker.name.title();
             rosy.typetwo = faker.name.title();
             rosy.key = faker.name.title();
             rosy.save(function(err){
                 if (err) throw err;
             });
        } 
        res.redirect('/admin/rosys');
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

        let newrosy = new Rosy({
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

        await newrosy.save();
        
        return res.redirect('/admin/rosys');     
    }

    async edit(req, res ,next) {
        try {
            this.isMongoId(req.params.id);
            let rosy = await Rosy.findById(req.params.id);
            if( ! rosy ) this.error('چنین محصولی وجود ندارد' , 404);

            let categories_rosy = await Category_rosy.find({});
            let genders = await Gender.find({});
            let countries = await Country.find({});
            let performances = await Performance.find({});
           
            return res.render('admin/rosys/edit' , { rosy, categories_rosy,genders,countries,performances});
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
       await Rosy.findByIdAndUpdate( req.params.id, { $set : { ...req.body, ...objForUpdate }}) 
        .then(function(rosy){
        
           
        let filename = 'http://via.placeholder.com/640x360';    
        if(!isEmpty(req.files)){
            let file = req.files.file;
             filename = Date.now() + '-' + file.name;
             rosy.file = filename;
    
            file.mv('./public/uploads/' + filename, function(err){
                if(err) throw err;
        });
        }
        
        rosy.save().then(function(updatedPost){
            req.flash('success_message', 'Post was successfully updated');
            return res.redirect('/admin/rosys');
        });
    });  
        } catch (err) {
            next(err);
        }
        
    }
    async destroy(req , res, next) {
        try {
            this.isMongoId(req.params.id);
             await Rosy.findOne({_id: req.params.id}).populate('gullerys_rosy').then(function (rosy){
                if( ! rosy ) this.error('چنین محصولی وجود ندارد' , 404);
                rosy.gullerys_rosy.forEach(gullery_rosy => gullery_rosy.remove());
                // delete Images
                fs.unlink(uploadDir + rosy.file,(err)=>{
                    // delete rosy
                    rosy.remove().then(postRemoved=>{

                        req.flash('success_message', 'محصول با موفقیت حذف شد');
                        return res.redirect('/admin/rosys');
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

module.exports = new rosyController();