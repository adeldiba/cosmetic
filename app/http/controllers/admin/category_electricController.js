const controller = require('app/http/controllers/controller');
const Category_electric = require('app/models/category_electric');
const fs = require('fs');
const path = require('path');

class category_electricController extends controller {
    async index(req , res) {
        try {
            let page = req.query.page || 1;
            let categories_electric = await Category_electric.paginate({} , { page , sort : { createdAt : 1 } , limit : 20 , populate : 'parent' });

            res.render('admin/categories_electric/index',  { title : 'دسته بندی های برقی' , categories_electric });
        } catch (err) {
            next(err);
        }
    }

    async create(req , res) {
        let categories_electric = await Category_electric.find({ parent : null });
        res.render('admin/categories_electric/create' , { categories_electric });        
    }

    async store(req , res , next) {
        
            let status = await this.validationData(req);
            if(! status) return this.back(req,res);
        
            let { name , parent } = req.body;

            let newCategory_electric = new Category_electric({ 
                name,
                slug : this.slug(name),
                parent : parent !== 'none' ? parent : null
             });

            await newCategory_electric.save();

            return res.redirect('/admin/categories_electric');    
    }

    async edit(req, res ,next) {
        try {
            this.isMongoId(req.params.id);

            let category_electric = await Category_electric.findById(req.params.id);
            let categories_electric = await Category_electric.find({ parent : null });
            if( ! category_electric ) this.error('چنین دسته ای وجود ندارد' , 404);


            return res.render('admin/categories_electric/edit' , { category_electric , categories_electric });
        } catch (err) {
            next(err);
        }
    }

    async update(req, res , next) {
        try {
            let status = await this.validationData(req);
            if(! status) return this.back(req,res);

            let { name , parent } = req.body;
            
            await Category_electric.findByIdAndUpdate(req.params.id , { $set : { 
                name,
                slug : this.slug(name),
                parent : parent !== 'none' ? parent : null
             }})

            return res.redirect('/admin/categories_electric');
        } catch(err) {
            next(err);
        }
    }

    async destroy(req , res , next) {
        try {
            this.isMongoId(req.params.id);

            let category_electric = await Category_electric.findById(req.params.id).populate('childs').exec();
            if( ! category_electric ) this.error('چنین دسته ای وجود ندارد' , 404);

            category_electric.childs.forEach(category_electric => category_electric.remove() );

            // delete category_electric
            category_electric.remove();

            return res.redirect('/admin/categories_electric');
        } catch (err) {
            next(err);
        }
    }
    slug(title){
        return title.replace(/([^آ-یa-z0-9]|-)+/g , "-")
    }
}

module.exports = new category_electricController();