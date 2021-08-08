const controller = require('app/http/controllers/controller');
const Category_limb = require('app/models/category_limb');
const fs = require('fs');
const path = require('path');

class category_limbController extends controller {
    async index(req , res) {
        try {
            let page = req.query.page || 1;
            let categories_limb = await Category_limb.paginate({} , { page , sort : { createdAt : 1 } , limit : 20 , populate : 'parent' });

            res.render('admin/categories_limb/index',  { title : 'دسته بندی های بدن' , categories_limb });
        } catch (err) {
            next(err);
        }
    }

    async create(req , res) {
        let categories_limb = await Category_limb.find({ parent : null });
        res.render('admin/categories_limb/create' , { categories_limb });        
    }

    async store(req , res , next) {
        
            let status = await this.validationData(req);
            if(! status) return this.back(req,res);
        
            let { name , parent } = req.body;

            let newCategory_limb = new Category_limb({ 
                name,
                slug : this.slug(name),
                parent : parent !== 'none' ? parent : null
             });

            await newCategory_limb.save();

            return res.redirect('/admin/categories_limb');    
    }

    async edit(req, res ,next) {
        try {
            this.isMongoId(req.params.id);

            let category_limb = await Category_limb.findById(req.params.id);
            let categories_limb = await Category_limb.find({ parent : null });
            if( ! category_limb ) this.error('چنین دسته ای وجود ندارد' , 404);


            return res.render('admin/categories_limb/edit' , { category_limb , categories_limb });
        } catch (err) {
            next(err);
        }
    }

    async update(req, res , next) {
        try {
            let status = await this.validationData(req);
            if(! status) return this.back(req,res);

            let { name , parent } = req.body;
            
            await Category_limb.findByIdAndUpdate(req.params.id , { $set : { 
                name,
                slug : this.slug(name),
                parent : parent !== 'none' ? parent : null
             }})

            return res.redirect('/admin/categories_limb');
        } catch(err) {
            next(err);
        }
    }

    async destroy(req , res , next) {
        try {
            this.isMongoId(req.params.id);

            let category_limb = await Category_limb.findById(req.params.id).populate('childs').exec();
            if( ! category_limb ) this.error('چنین دسته ای وجود ندارد' , 404);

            category_limb.childs.forEach(category_limb => category_limb.remove() );

            // delete category
            category_limb.remove();

            return res.redirect('/admin/categories_limb');
        } catch (err) {
            next(err);
        }
    }
    slug(title){
        return title.replace(/([^آ-یa-z0-9]|-)+/g , "-")
    }
}

module.exports = new category_limbController();