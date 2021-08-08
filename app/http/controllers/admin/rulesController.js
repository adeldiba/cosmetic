const controller = require('app/http/controllers/controller');
const Rules = require('app/models/rules');

class rulesController extends controller {
    async index(req , res, next) {
        try {
            let page = req.query.page || 1;
            let rules = await Rules.paginate({} , { page , sort : { createdAt : 1 } , limit : 10 });
            res.render('admin/rules/index',  { title : 'قوانین و مقررات' , rules });
        } catch (err) {
            next(err);
        }
    }

    async create(req , res, next) {
        res.render('admin/rules/create');        
        
    }

    async store(req , res, next) {
        
            let status = await this.validationData(req);
        if(! status) {
            return this.back(req,res);
        }
        
        let { title, body} = req.body;

        let newRules = new Rules({
            title,
            slug : this.slug(title), 
            body
        });

        await newRules.save();

        return res.redirect('/admin/rules');
          
    }

    async edit(req, res ,next) {
        try {
            this.isMongoId(req.params.id);
            let rules = await Rules.findById(req.params.id);
            if( ! rules ) this.error('چنین قوانینی وجود ندارد' , 404);

            return res.render('admin/rules/edit' , { rules});
        } catch (err) {
            next(err);
        }
    }

    async update(req, res , next) {
        try {
            let status = await this.validationData(req);
        if(! status) {
            return this.back(req,res);
        }

        objForUpdate.slug = this.slug(req.body.title);
        
        await Rules.findByIdAndUpdate(req.params.id , { $set : { ...req.body , ...objForUpdate }})
        return res.redirect('/admin/rules');
        } catch (err) {
            next(err);
        }
        
    }

    async destroy(req , res, next) {
        try {
            this.isMongoId(req.params.id);
            let rules = await Rules.findById(req.params.id); 
            if( ! rules ) this.error('چنین قوانینی وجود ندارد' , 404);

            // delete rules
            rules.remove();

            return res.redirect('/admin/rules'); 
        } catch (err) {
            next(err)
        }        
    }

    slug(title) {
        return title.replace(/([^۰-۹آ-یa-z0-9]|-)+/g , "-")
    }
}

module.exports = new rulesController();