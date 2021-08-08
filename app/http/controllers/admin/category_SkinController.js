const controller = require('app/http/controllers/controller');
const Category_Skin = require('app/models/category_Skin');
const fs = require('fs');
const path = require('path');

class category_SkinController extends controller {
    async index(req , res,next) {
        try {
            let page = req.query.page || 1;
            let categories_Skin = await Category_Skin.paginate({} , { page , sort : { createdAt : 1 } , limit : 20 , populate : 'parent' });

            res.render('admin/categories_Skin/index',  { title : 'دسته بندی های پوست' , categories_Skin });
        } catch (err) { 
            next(err);
        }
    }

    async create(req , res) {
        let categories_Skin = await Category_Skin.find({ parent : null });
        res.render('admin/categories_Skin/create' , { categories_Skin });        
    }

    async store(req , res , next) {
        try {
            let status = await this.validationData(req);
            if(! status) return this.back(req,res);
        
            let { name , parent } = req.body;

            let newCategory_Skin = new Category_Skin({ 
                name,
                slug : this.slug(name),
                parent : parent !== 'none' ? parent : null
             });

            await newCategory_Skin.save();

            return res.redirect('/admin/categories_Skin');   
        } catch (err) {
            next(err);
        } 
    }

    async edit(req, res ,next) {
        try {
            this.isMongoId(req.params.id);

            let category_Skin = await Category_Skin.findById(req.params.id);
            let categories_Skin = await Category_Skin.find({ parent : null });
            if( ! category_Skin ) this.error('چنین دسته ای وجود ندارد' , 404);


            return res.render('admin/categories_Skin/edit' , { category_Skin , categories_Skin });
        } catch (err) {
            next(err);
        }
    }

    async update(req, res , next) {
        try {
            let status = await this.validationData(req);
            if(! status) return this.back(req,res);

            let { name , parent } = req.body;
            
            await Category_Skin.findByIdAndUpdate(req.params.id , { $set : { 
                name,
                slug : this.slug(name),
                parent : parent !== 'none' ? parent : null
             }})

            return res.redirect('/admin/categories_Skin');
        } catch(err) {
            next(err);
        }
    }

    async destroy(req , res , next) {
        try {
            this.isMongoId(req.params.id);

            let category_Skin = await Category_Skin.findById(req.params.id).populate('childs').exec();
            if( ! category_Skin ) this.error('چنین دسته ای وجود ندارد' , 404);

            category_Skin.childs.forEach(category_Skin => category_Skin.remove() );

            // delete category
            category_Skin.remove();

            return res.redirect('/admin/categories_Skin');
        } catch (err) {
            next(err);
        }
    }
    slug(title){
        return title.replace(/([^آ-یa-z0-9]|-)+/g , "-")
    }
}

module.exports = new category_SkinController();