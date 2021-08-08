const controller = require('app/http/controllers/controller');
const Category_decorative = require('app/models/category_decorative');
const fs = require('fs');
const path = require('path');

class category_decorativeController extends controller {
    async index(req , res) {
        try {
            let page = req.query.page || 1;
            let categories_decorative = await Category_decorative.paginate({} , { page , sort : { createdAt : 1 } , limit : 20 , populate : 'parent' });

            res.render('admin/categories_decorative/index',  { title : 'دسته بندی های دکوراتیو' , categories_decorative });
        } catch (err) {
            next(err);
        }
    }

    async create(req , res) {
        let categories_decorative = await Category_decorative.find({ parent : null });
        res.render('admin/categories_decorative/create' , { categories_decorative });        
    }

    async store(req , res , next) {
        
            let status = await this.validationData(req);
            if(! status) return this.back(req,res);
        
            let { name , parent } = req.body;

            let newCategory_decorative = new Category_decorative({ 
                name,
                slug : this.slug(name),
                parent : parent !== 'none' ? parent : null
             });

            await newCategory_decorative.save();

            return res.redirect('/admin/categories_decorative');    
    }

    async edit(req, res ,next) {
        try {
            this.isMongoId(req.params.id);

            let category_decorative = await Category_decorative.findById(req.params.id);
            let categories_decorative = await Category_decorative.find({ parent : null });
            if( ! category_decorative ) this.error('چنین دسته ای وجود ندارد' , 404);


            return res.render('admin/categories_decorative/edit' , { category_decorative , categories_decorative });
        } catch (err) {
            next(err);
        }
    }

    async update(req, res , next) {
        try {
            let status = await this.validationData(req);
            if(! status) return this.back(req,res);

            let { name , parent } = req.body;
            
            await Category_decorative.findByIdAndUpdate(req.params.id , { $set : { 
                name,
                slug : this.slug(name),
                parent : parent !== 'none' ? parent : null
             }})

            return res.redirect('/admin/categories_decorative');
        } catch(err) {
            next(err);
        }
    }

    async destroy(req , res , next) {
        try {
            this.isMongoId(req.params.id);

            let category_decorative = await Category_decorative.findById(req.params.id).populate('childs').exec();
            if( ! category_decorative ) this.error('چنین دسته ای وجود ندارد' , 404);

            category_decorative.childs.forEach(category_decorative => category_decorative.remove() );

            // delete category_decorativ
            category_decorative.remove();

            return res.redirect('/admin/categories_decorative');
        } catch (err) {
            next(err);
        }
    }
    slug(title){
        return title.replace(/([^آ-یa-z0-9]|-)+/g , "-")
    }
}

module.exports = new category_decorativeController();