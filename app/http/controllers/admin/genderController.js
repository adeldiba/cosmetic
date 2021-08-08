const controller = require('app/http/controllers/controller');
const Gender = require('app/models/gender');
const fs = require('fs');
const path = require('path');

class genderController extends controller {
    async index(req , res) {
        try {
            let page = req.query.page || 1;
            let genders = await Gender.paginate({} , { page , sort : { createdAt : 1 } , limit : 20 , populate : 'parent' });

            res.render('admin/genders/index',  { title : 'جنسیت' , genders });
        } catch (err) {
            next(err);
        }
    }

    async create(req , res) {
        let genders = await Gender.find({ parent : null });
        res.render('admin/genders/create' , { genders });        
    }

    async store(req , res , next) {
        
            let status = await this.validationData(req);
            if(! status) return this.back(req,res);
        
            let { name , parent } = req.body;

            let newGender= new Gender({ 
                name,
                slug : this.slug(name),
                parent : parent !== 'none' ? parent : null
             });

            await newGender.save();

            return res.redirect('/admin/genders');    
    }

    async edit(req, res ,next) {
        try {
            this.isMongoId(req.params.id);

            let gender = await Gender.findById(req.params.id);
            let genders = await Gender.find({ parent : null });
            if( ! genders ) this.error('چنین دسته ای وجود ندارد' , 404);


            return res.render('admin/genders/edit' , { gender , genders });
        } catch (err) {
            next(err);
        }
    }

    async update(req, res , next) {
        try {
            let status = await this.validationData(req);
            if(! status) return this.back(req,res);

            let { name , parent } = req.body;
            
            await Gender.findByIdAndUpdate(req.params.id , { $set : { 
                name,
                slug : this.slug(name),
                parent : parent !== 'none' ? parent : null
             }})

            return res.redirect('/admin/genders');
        } catch(err) {
            next(err);
        }
    }

    async destroy(req , res , next) {
        try {
            this.isMongoId(req.params.id);

            let gender = await Gender.findById(req.params.id).populate('childs').exec();
            if( ! gender ) this.error('چنین دسته ای وجود ندارد' , 404);

            gender.childs.forEach(gender => gender.remove() );

            // delete gender
            gender.remove();

            return res.redirect('/admin/genders');
        } catch (err) {
            next(err);
        }
    }
    slug(title){
        return title.replace(/([^آ-یa-z0-9]|-)+/g , "-")
    }
}
module.exports = new genderController();