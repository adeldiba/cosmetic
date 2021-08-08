const controller = require('app/http/controllers/controller');
const Category_health = require('app/models/category_health');
const fs = require('fs');
const path = require('path');

class category_healthController extends controller {
    async index(req , res) {
        try {
            let page = req.query.page || 1;
            let categories_health = await Category_health.paginate({} , { page , sort : { createdAt : 1 } , limit : 20 , populate : 'parent' });

            res.render('admin/categories_health/index',  { title : 'دسته بندی بهداشت شخصی' , categories_health });
        } catch (err) {
            next(err);
        }
    }

    async create(req , res) {
        let categories_health = await Category_health.find({ parent : null });
        res.render('admin/categories_health/create' , { categories_health });        
    }

    async store(req , res , next) {
        
            let status = await this.validationData(req);
            if(! status) return this.back(req,res);
        
            let { name , parent } = req.body;

            let newCategory_health = new Category_health({ 
                name,
                slug : this.slug(name),
                parent : parent !== 'none' ? parent : null
             });

            await newCategory_health.save();

            return res.redirect('/admin/categories_health');    
    }

    async edit(req, res ,next) {
        try {
            this.isMongoId(req.params.id);

            let category_health = await Category_health.findById(req.params.id);
            let categories_health = await Category_health.find({ parent : null });
            if( ! category_health ) this.error('چنین دسته ای وجود ندارد' , 404);


            return res.render('admin/categories_health/edit' , { category_health , categories_health });
        } catch (err) {
            next(err);
        }
    }

    async update(req, res , next) {
        try {
            let status = await this.validationData(req);
            if(! status) return this.back(req,res);

            let { name , parent } = req.body;
            
            await Category_health.findByIdAndUpdate(req.params.id , { $set : { 
                name,
                slug : this.slug(name),
                parent : parent !== 'none' ? parent : null
             }})

            return res.redirect('/admin/categories_health');
        } catch(err) {
            next(err);
        }
    }

    async destroy(req , res , next) {
        try {
            this.isMongoId(req.params.id);

            let category_health = await Category_health.findById(req.params.id).populate('childs').exec();
            if( ! category_health ) this.error('چنین دسته ای وجود ندارد' , 404);

            category_health.childs.forEach(category_health => category_health.remove() );

            // delete category
            category_health.remove();

            return res.redirect('/admin/categories_health');
        } catch (err) {
            next(err);
        }
    }
    slug(title){
        return title.replace(/([^آ-یa-z0-9]|-)+/g , "-")
    }
}

module.exports = new category_healthController();