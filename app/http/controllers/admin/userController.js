const controller = require('app/http/controllers/controller');
const User = require('app/models/user');

class userController extends controller {
    async index(req , res) {
        try {
            let page = req.query.page || 1;
            let users = await User.paginate({} , { page , sort : { createdAt : 1 } , limit : 20 });

            res.render('admin/users/index',  { title : 'کاربران سایت' , users });
        } catch (err) {
            next(err);
        }
    }

    async toggleadmin(req , res , next) {
        try {
            this.isMongoId(req.params.id);

            let user = await User.findById(req.params.id);
            user.set({ admin : ! user.admin});
            await user.save();

            return this.back(req , res);
        } catch (err) {
            next(err)
        }
    }

    async create(req , res) {
        res.render('admin/users/create');        
    }

    async store(req , res , next) {
        try {
            let status = await this.validationData(req);
            if(! status) return this.back(req,res);
        
            let { name , email , password } = req.body;

            let newUser = new User({ 
                name,
                email,
                password
             });

            await newUser.save();

            return res.redirect('/admin/users');  
        } catch(err) {
            next(err);
        }
    }

    async edit(req, res ,next) {
        try {
            this.isMongoId(req.params.id);
            let user = await User.findById(req.params.id);
            if( ! user ) this.error('چنین محصولی وجود ندارد' , 404);

            return res.render('admin/users/edit' , { user});
        } catch (err) {
            next(err);
        }
    }

    async update(req, res , next) {
        try {
            let status = await this.validationData(req);
            if(! status) return this.back(req,res);


        await User.findByIdAndUpdate(req.params.id , { $set : { ...req.body }})
        return res.redirect('/admin/users');
        } catch (err) {
            next(err);
        }
    }

    async destroy(req , res , next) {
        try {
            this.isMongoId(req.params.id);

            let user = await User.findById(req.params.id).populate({ path : 'courses' , populate : [ 'episodes' ]}).exec();
            if( ! user ) this.error('چنین کاربری وجود ندارد' , 404);

            user.courses.forEach(course => {
                course.episodes.forEach(episode => episode.remove());
                course.remove();
            })

            // delete user
            user.remove();

            return res.redirect('/admin/users');
        } catch (err) {
            next(err);
        }
    }

}

module.exports = new userController();