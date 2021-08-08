const controller = require('app/http/controllers/controller');
const Category = require('app/models/category');
const fs = require('fs');
const path = require('path');

class categoryController extends controller {
    async index(req , res) {
        try {
            let page = req.query.page || 1;
            let categories = await Category.paginate({} , { page , sort : { createdAt : 1 } , limit : 20 , populate : 'parent' });

            res.render('admin/categories/index',  { title : 'دسته بندی های آرایشی' , categories });
        } catch (err) {
            next(err);
        }
    }

    async create(req , res) {
        let categories = await Category.find({ parent : null });
        res.render('admin/categories/create' , { categories });        
    }

    async store(req , res , next) {
        
            let status = await this.validationData(req);
            if(! status) return this.back(req,res);
        
            let { name , parent } = req.body;

            let newCategory = new Category({ 
                name,
                slug : this.slug(name),
                parent : parent !== 'none' ? parent : null
             });

            await newCategory.save();

            return res.redirect('/admin/categories');    
    }

    async edit(req, res ,next) {
        try {
            this.isMongoId(req.params.id);

            let category = await Category.findById(req.params.id);
            let categories = await Category.find({ parent : null });
            if( ! category ) this.error('چنین دسته ای وجود ندارد' , 404);


            return res.render('admin/categories/edit' , { category , categories });
        } catch (err) {
            next(err);
        }
    }

    async update(req, res , next) {
        try {
            let status = await this.validationData(req);
            if(! status) return this.back(req,res);

            let { name , parent } = req.body;
            
            await Category.findByIdAndUpdate(req.params.id , { $set : { 
                name,
                slug : this.slug(name),
                parent : parent !== 'none' ? parent : null
             }})

            return res.redirect('/admin/categories');
        } catch(err) {
            next(err);
        }
    }

    async destroy(req , res , next) {
        try {
            this.isMongoId(req.params.id);

            let category = await Category.findById(req.params.id).populate('childs').exec();
            if( ! category ) this.error('چنین دسته ای وجود ندارد' , 404);

            category.childs.forEach(category => category.remove() );

            // delete category
            category.remove();

            return res.redirect('/admin/categories');
        } catch (err) {
            next(err);
        }
    }
    slug(title){
        return title.replace(/([^آ-یa-z0-9]|-)+/g , "-")
    }
}

module.exports = new categoryController();