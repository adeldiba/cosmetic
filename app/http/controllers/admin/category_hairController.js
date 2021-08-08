const controller = require('app/http/controllers/controller');
const Category_hair = require('app/models/category_hair');
const fs = require('fs');
const path = require('path');

class category_hairController extends controller {
    async index(req , res) {
        try {
            let page = req.query.page || 1;
            let categories_hair = await Category_hair.paginate({} , { page , sort : { createdAt : 1 } , limit : 20 , populate : 'parent' });

            res.render('admin/categories_hair/index',  { title : 'دسته بندی های آرایشی' , categories_hair });
        } catch (err) {
            next(err);
        }
    }

    async create(req , res) {
        let categories_hair = await Category_hair.find({ parent : null });
        res.render('admin/categories_hair/create' , { categories_hair });        
    }

    async store(req , res , next) {
        
            let status = await this.validationData(req);
            if(! status) return this.back(req,res);
        
            let { name , parent } = req.body;

            let newCategory_hair = new Category_hair({ 
                name,
                slug : this.slug(name),
                parent : parent !== 'none' ? parent : null
             });

            await newCategory_hair.save();

            return res.redirect('/admin/categories_hair');    
    }

    async edit(req, res ,next) {
        try {
            this.isMongoId(req.params.id);

            let category_hair = await Category_hair.findById(req.params.id);
            let categories_hair = await Category_hair.find({ parent : null });
            if( ! category_hair ) this.error('چنین دسته ای وجود ندارد' , 404);


            return res.render('admin/categories_hair/edit' , { category_hair , categories_hair });
        } catch (err) {
            next(err);
        }
    }

    async update(req, res , next) {
        try {
            let status = await this.validationData(req);
            if(! status) return this.back(req,res);

            let { name , parent } = req.body;
            
            await Category_hair.findByIdAndUpdate(req.params.id , { $set : { 
                name,
                slug : this.slug(name),
                parent : parent !== 'none' ? parent : null
             }})

            return res.redirect('/admin/categories_hair');
        } catch(err) {
            next(err);
        }
    }

    async destroy(req , res , next) {
        try {
            this.isMongoId(req.params.id);

            let category_hair = await Category_hair.findById(req.params.id).populate('childs').exec();
            if( ! category_hair ) this.error('چنین دسته ای وجود ندارد' , 404);

            category_hair.childs.forEach(category_hair => category_hair.remove() );

            // delete category
            category_hair.remove();

            return res.redirect('/admin/categories_hair');
        } catch (err) {
            next(err);
        }
    }
    slug(title){
        return title.replace(/([^آ-یa-z0-9]|-)+/g , "-")
    }
}

module.exports = new category_hairController();