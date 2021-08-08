const controller = require('app/http/controllers/controller');
const Performance = require('app/models/performance');

class performanceController extends controller {
    async index(req , res) {
        try {
            let page = req.query.page || 1;
            let performances = await Performance.paginate({} , { page , sort : { createdAt : 1 } , limit : 20 , populate : 'parent' });

            res.render('admin/performances/index',  { title : 'کارایی محصول' , performances });
        } catch (err) {
            next(err);
        }
    }

    async create(req , res) {
        let performances = await Performance.find({ parent : null });
        res.render('admin/performances/create' , { performances });        
    }

    async store(req , res , next) {
        
            let status = await this.validationData(req);
            if(! status) return this.back(req,res);
        
            let { name , parent, lang } = req.body;

            let newperformance = new Performance({ 
                name,
                slug : this.slug(name),
                lang,
                parent : parent !== 'none' ? parent : null
             });

            await newperformance.save();

            return res.redirect('/admin/performances');    
    }

    async edit(req, res ,next) {
        try {
            this.isMongoId(req.params.id);

            let performance = await Performance.findById(req.params.id);
            let performances = await Performance.find({ parent : null });
            if( ! performance ) this.error('چنین کشوری وجود ندارد' , 404);

            return res.render('admin/performances/edit' , { performance , performances });
        } catch (err) {
            next(err);
        }
    }

    async update(req, res , next) {
        try {
            let status = await this.validationData(req);
            if(! status) return this.back(req,res);

            let { name , parent } = req.body;
            
            await Performance.findByIdAndUpdate(req.params.id , { $set : { 
                name,
                slug : this.slug(name),
                parent : parent !== 'none' ? parent : null
             }})

            return res.redirect('/admin/performances');
        } catch(err) {
            next(err);
        }
    }

    async destroy(req , res , next) {
        try {
            this.isMongoId(req.params.id);

            let performance = await Performance.findById(req.params.id).populate('childs').exec();
            if( ! performance ) this.error('چنین کشوری وجود ندارد' , 404);

            performance.childs.forEach(performance => performance.remove() );

            // delete performance
            performance.remove();

            return res.redirect('/admin/performances');
        } catch (err) {
            next(err);
        }
    }
    slug(title){
        return title.replace(/([^آ-یa-z0-9]|-)+/g , "-")
    }
}

module.exports = new performanceController();