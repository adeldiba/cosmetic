const controller = require('app/http/controllers/controller');
const Category_rosy = require('app/models/category_rosy');
const fs = require('fs');
const path = require('path');

class category_rosyController extends controller {
    async index(req , res) {
        try {
            let page = req.query.page || 1;
            let categories_rosy = await Category_rosy.paginate({} , { page , sort : { createdAt : 1 } , limit : 20 , populate : 'parent' });

            res.render('admin/categories_rosy/index',  { title : 'دسته بندی های خوشبوکننده' , categories_rosy });
        } catch (err) {
            next(err);
        }
    }

    async create(req , res) {
        let categories_rosy = await Category_rosy.find({ parent : null });
        res.render('admin/categories_rosy/create' , { categories_rosy });        
    }

    async store(req , res , next) {
        
            let status = await this.validationData(req);
            if(! status) return this.back(req,res);
        
            let { name , parent } = req.body;

            let newCategory_rosy = new Category_rosy({ 
                name,
                slug : this.slug(name),
                parent : parent !== 'none' ? parent : null
             });

            await newCategory_rosy.save();

            return res.redirect('/admin/categories_rosy');    
    }

    async edit(req, res ,next) {
        try {
            this.isMongoId(req.params.id);

            let category_rosy = await Category_rosy.findById(req.params.id);
            let categories_rosy = await Category_rosy.find({ parent : null });
            if( ! category_rosy ) this.error('چنین دسته ای وجود ندارد' , 404);


            return res.render('admin/categories_rosy/edit' , { category_rosy , categories_rosy });
        } catch (err) {
            next(err);
        }
    }

    async update(req, res , next) {
        try {
            let status = await this.validationData(req);
            if(! status) return this.back(req,res);

            let { name , parent } = req.body;
            
            await Category_rosy.findByIdAndUpdate(req.params.id , { $set : { 
                name,
                slug : this.slug(name),
                parent : parent !== 'none' ? parent : null
             }})

            return res.redirect('/admin/categories_rosy');
        } catch(err) {
            next(err);
        }
    }

    async destroy(req , res , next) {
        try {
            this.isMongoId(req.params.id);

            let category_rosy = await Category_rosy.findById(req.params.id).populate('childs').exec();
            if( ! category_rosy ) this.error('چنین دسته ای وجود ندارد' , 404);

            category_rosy.childs.forEach(category_rosy => category_rosy.remove() );

            // delete category_rosy
            category_rosy.remove();

            return res.redirect('/admin/categories_rosy');
        } catch (err) {
            next(err);
        }
    }
    slug(title){
        return title.replace(/([^آ-یa-z0-9]|-)+/g , "-")
    }
}

module.exports = new category_rosyController();