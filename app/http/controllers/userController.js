const controller = require('app/http/controllers/controller');
const Payment = require('app/models/payment');
const Panel = require('app/models/panel');
const Cosmetic = require('app/models/cosmetic'); 
const Engine = require('app/models/engine');
const Logo = require('app/models/logo');
const Category = require('app/models/category');
const Category_Skin = require('app/models/category_Skin');
const Category_hair = require('app/models/category_hair');
const Category_limb = require('app/models/category_limb');
const Category_electric = require('app/models/category_electric');
const Category_health = require('app/models/category_health');
const Category_rosy = require('app/models/category_rosy');
const Category_decorative = require('app/models/category_decorative');
const Comment = require('app/models/comment');
//const Message = require('app/models/message');
const Like = require('app/models/like');
//const ActivationCode = require('app/models/activationCode');
const Available = require('app/models/available');

class userController extends controller {
   
    async index(req , res , next) {
        try {
            let title = "پنل کاربری";

            let query = {};
            let{search, type,typetwo, category } = req.query;
            if(search) 
                query.title = new RegExp(search , 'gi');

            if(type && type != 'all')
                query.type = type;

            if(typetwo && typetwo != 'notavailable')
                query.typetwo = typetwo;

            if(category && category != 'all'){
                 category = await Category.findOne({slug: category}); 
            } 
            let engines = Engine.find({ ...query }).populate([{
                path : 'episodes',
                options : {
                    sort : { number : 1}
                }
            }]);

            if(req.query.order) 
                engines.sort({ createdAt : -1})

            engines = await engines.exec();
            let categories = await Category.find({ parent : null }).populate('childs').exec();
            let categories_Skin = await Category_Skin.find({ parent : null }).populate('childs').exec();
            let categories_hair = await Category_hair.find({ parent : null }).populate('childs').exec();
            let categories_limb = await Category_limb.find({ parent : null }).populate('childs').exec();
            let categories_health = await Category_health.find({ parent : null }).populate('childs').exec();
            let categories_rosy = await Category_rosy.find({ parent : null }).populate('childs').exec();
            let categories_decorative = await Category_decorative.find({ parent : null }).populate('childs').exec();
            let categories_electric = await Category_electric.find({ parent : null }).populate('childs').exec();
            let panels = await Panel.find({user: req.user.id});
            let logos = await Logo.find({});
            if (req.session.cart && req.session.cart.length == 0) {
                delete req.session.cart;
                res.redirect("/panel/index");
            } else {
                res.render("home/panel/index", {
                    recaptcha: this.recaptcha.render(),
                    title,
                    cart: req.session.cart,
                    engines,
                    categories,categories_Skin,categories_hair,categories_limb,categories_health,categories_rosy,categories_decorative,
                    categories_electric,
                    panels,logos,
                    key: ""
                });
            }
        } catch (err) {
            next(err);
        }
    }

    async store(req , res , next){
        //await this.recaptchaValidation(req , res);
        let status = await this.validationData(req);
        if(! status) {
            return this.back(req,res);
        }
        
        let {name_family ,phone , codeM ,state , city , address, postal_code  } = req.body;

        let newPanel = new Panel({
            user : req.user._id,
            name_family,
            phone ,
            codeM,
            state ,
            city ,
            address,
            postal_code
        });

        await newPanel.save();
        return res.redirect('/user/panel');   
    }

    async editAddress(req , res , next){
        try {
            let title = 'ویرایش پروفایل';
            let query = {};
            let{search, type,typetwo, category } = req.query;
            if(search) 
                query.title = new RegExp(search , 'gi');

            if(type && type != 'all')
                query.type = type;

            if(typetwo && typetwo != 'notavailable')
                query.typetwo = typetwo;

            if(category && category != 'all'){
                 category = await Category.findOne({slug: category}); 
            } 
            
            let categories = await Category.find({ parent : null }).populate('childs').exec();
            let categories_Skin = await Category_Skin.find({ parent : null }).populate('childs').exec();
            let categories_hair = await Category_hair.find({ parent : null }).populate('childs').exec();
            let categories_limb = await Category_limb.find({ parent : null }).populate('childs').exec();
            let categories_health = await Category_health.find({ parent : null }).populate('childs').exec();
            let categories_rosy = await Category_rosy.find({ parent : null }).populate('childs').exec();
            let categories_decorative = await Category_decorative.find({ parent : null }).populate('childs').exec();
            let categories_electric = await Category_electric.find({ parent : null }).populate('childs').exec();
            let logos = await Logo.find({});
            this.isMongoId(req.params.id);
            let panel = await Panel.findById(req.params.id);
            if( ! panel ) this.error('چنین پروفایلی وجود ندارد' , 404);

            return res.render('home/panel/editAddress' , {title,key:'', 
            recaptcha: this.recaptcha.render(),panel, logos,  
            categories,categories_Skin,categories_hair,categories_limb,categories_health,categories_rosy,
            categories_decorative,categories_electric,
            key:""
        });
        } catch (err) {
            next(err);
        }
    }

    async update(req, res , next) {
        try {
            let status = await this.validationData(req);
            if(! status) return this.back(req,res);

            
            let panel =  await Panel.findByIdAndUpdate(req.params.id , { $set : { ...req.body }})
            
            // prev engine time update
            //this.updateEngineTime(episode.engine);
            // now engine time update
            //this.updateEngineTime(req.body.engine);


            return res.redirect('/user/panel');
        } catch(err) {
            next(err);
        }
    }


async profile(req, res, next){
        try {
            let title = "آدرس های من";

            let query = {};
            let{search, type,typetwo, category } = req.query;
            if(search) 
                query.title = new RegExp(search , 'gi');

            if(type && type != 'all')
                query.type = type;

            if(typetwo && typetwo != 'notavailable')
                query.typetwo = typetwo;

            if(category && category != 'all'){
                 category = await Category.findOne({slug: category}); 
            } 
            let engines = Engine.find({ ...query }).populate([{
                path : 'episodes',
                options : {
                    sort : { number : 1}
                }
            }]);

            let episodes = await Episode.find({ ...query }).populate([{
                path : 'engines',
                options : {
                    sort : { number : 1}
                }
            }]);

            if(req.query.order) 
                engines.sort({ createdAt : -1})

            engines = await engines.exec();
            let categories = await Category.find({ parent : null }).populate('childs').exec();
            let categories_Skin = await Category_Skin.find({ parent : null }).populate('childs').exec();
            let categories_hair = await Category_hair.find({ parent : null }).populate('childs').exec();
            let categories_limb = await Category_limb.find({ parent : null }).populate('childs').exec();
            let categories_health = await Category_health.find({ parent : null }).populate('childs').exec();
            let categories_rosy = await Category_rosy.find({ parent : null }).populate('childs').exec();
            let categories_decorative = await Category_decorative.find({ parent : null }).populate('childs').exec();
            let categories_electric = await Category_electric.find({ parent : null }).populate('childs').exec();
            let panels = await Panel.find({user:req.user.id }).populate('user').exec();
            let logos = await Logo.find({});

            if (req.session.cart && req.session.cart.length == 0) {
                delete req.session.cart;
                res.redirect("/panel/profile");
            } else {
                res.render("home/panel/profile", {
                    recaptcha: this.recaptcha.render(),
                    title,
                    cart: req.session.cart,
                    engines,
                    categories,categories_Skin,categories_hair,categories_limb,categories_health,categories_rosy,categories_decorative,
                    categories_electric,
                    episodes,
                    panels,
                    logos,
                    key: ""
                });
            }
        } catch (err) {
            next(err);
        }
    }
    async comment(req, res, next){
        try {
            let title = "نظرات";

            let query = {};
            let{search, type,typetwo, category } = req.query;
            if(search) 
                query.title = new RegExp(search , 'gi');

            if(type && type != 'all')
                query.type = type;

            if(typetwo && typetwo != 'notavailable')
                query.typetwo = typetwo;

            if(category && category != 'all'){
                 category = await Category.findOne({slug: category}); 
            } 
            let cosmetics = Cosmetic.find({ ...query }).populate();

            if(req.query.order) 
            cosmetics.sort({ createdAt : -1})

            cosmetics = await cosmetics.exec();
            let logos = await Logo.find({});
            let categories = await Category.find({ parent : null }).populate('childs').exec();
            let categories_Skin = await Category_Skin.find({ parent : null }).populate('childs').exec();
            let categories_hair = await Category_hair.find({ parent : null }).populate('childs').exec();
            let categories_limb = await Category_limb.find({ parent : null }).populate('childs').exec();
            let categories_health = await Category_health.find({ parent : null }).populate('childs').exec();
            let categories_rosy = await Category_rosy.find({ parent : null }).populate('childs').exec();
            let categories_decorative = await Category_decorative.find({ parent : null }).populate('childs').exec();
            let categories_electric = await Category_electric.find({ parent : null }).populate('childs').exec();
            let comments = await Comment.find({ user:req.user.id }).populate([
                {
                    path : 'user', 
                    select : 'name'   
                } 
            ]).populate([
                {
                    path : 'comments',
                    match : {
                        parent : null,
                        approved : true
                    },
                    populate : [
                        {
                            path : 'user',
                            select : 'name'
                        },
                        {
                            path : 'comments',
                            match : {
                                approved : true
                            },
                            populate : { path : 'user' , select : 'name'}
                        }   
                    ]
                }
            ]).exec();

            if (req.session.cart && req.session.cart.length == 0) {
                delete req.session.cart;
                res.redirect("/panel/comment");
            } else {
                res.render("home/panel/comment", {
                    recaptcha: this.recaptcha.render(),
                    title,
                    cart: req.session.cart,
                    cosmetics,
                    categories,categories_Skin,categories_hair,categories_limb,categories_health,categories_rosy,categories_decorative,
                    categories_electric,
                    comments,
                    logos,
                    key: ""
                });
            }
        } catch (err) {
            next(err);
        }
    }

async destroy(req , res, next) {
        try {
            this.isMongoId(req.params.id);
            let panel = await Panel.findById(req.params.id).populate('user').exec(); 
            if( ! panel ) this.error('چنین آدرسی وجود ندارد' , 404);
            
            // delete panel
            panel.remove();

            return res.redirect('/user/panel'); 
        } catch (err) {
            next(err)
        }        
}

    async message(req , res, next) {
        let title = "پیغام از طرف سایت";

            let query = {};
            let{search, type,typetwo, category } = req.query;
            if(search) 
                query.title = new RegExp(search , 'gi');

            if(type && type != 'all')
                query.type = type;

            if(typetwo && typetwo != 'notavailable')
                query.typetwo = typetwo;

            if(category && category != 'all'){
                 category = await Category.findOne({slug: category}); 
            } 
            
            let logos = await Logo.find({});
            let categories = await Category.find({ parent : null }).populate('childs').exec();
            let categories_Skin = await Category_Skin.find({ parent : null }).populate('childs').exec();
            let categories_hair = await Category_hair.find({ parent : null }).populate('childs').exec();
            let categories_limb = await Category_limb.find({ parent : null }).populate('childs').exec();
            let categories_health = await Category_health.find({ parent : null }).populate('childs').exec();
            let categories_rosy = await Category_rosy.find({ parent : null }).populate('childs').exec();
            let categories_decorative = await Category_decorative.find({ parent : null }).populate('childs').exec();
            let categories_electric = await Category_electric.find({ parent : null }).populate('childs').exec();
            let messages = await Message.find({}).populate().exec();

            if (req.session.cart && req.session.cart.length == 0) {
                delete req.session.cart;
                res.redirect("/panel/messages");
            } else {
                res.render("home/panel/messages", {
                    title,
                    cart: req.session.cart,
                    categories,categories_Skin,categories_hair,categories_limb,categories_health,categories_rosy,categories_decorative,
                    categories_electric,
                    messages,
                    logos,
                    key: ""
                });
            }       
    }
  
    async favorites(req , res, next) {
        let title = "لیست علاقه مندی ها";

            let query = {};
            let{search, type,typetwo, category } = req.query;
            if(search) 
                query.title = new RegExp(search , 'gi');

            if(type && type != 'all')
                query.type = type;

            if(typetwo && typetwo != 'notavailable')
                query.typetwo = typetwo;

            if(category && category != 'all'){
                 category = await Category.findOne({slug: category}); 
            } 
            let cosmetics = Cosmetic.find({ ...query }).populate([{
                path: 'payment'
            }]);

            if(req.query.order) 
            cosmetics.sort({ createdAt : -1})

            cosmetics = await cosmetics.exec();
            //let logo = await Logo.find({});
            let cosmetic = await Cosmetic.findOneAndUpdate({ slug : req.params.cosmetic }).populate([
                {
                    path : 'user', 
                    select : 'name'    
                }]);
            let categories = await Category.find({ parent : null }).populate('childs').exec();
            let categories_Skin = await Category_Skin.find({ parent : null }).populate('childs').exec();
            let categories_hair = await Category_hair.find({ parent : null }).populate('childs').exec();
            let categories_limb = await Category_limb.find({ parent : null }).populate('childs').exec();
            let categories_health = await Category_health.find({ parent : null }).populate('childs').exec();
            let categories_rosy = await Category_rosy.find({ parent : null }).populate('childs').exec();
            let categories_decorative = await Category_decorative.find({ parent : null }).populate('childs').exec();
            let categories_electric = await Category_electric.find({ parent : null }).populate('childs').exec();
            let page = req.query.page || 1;
            let likes = await Like.paginate({ user : req.user.id },{ page , sort : { createdAt : -1 } , limit : 20 ,
                populate : [
                    {
                        path : 'user',
                        select : 'name'
                    },
                    'cosmetic' ,
                    {
                        path : 'episode',
                        populate : [
                            {
                                path : 'cosmetic' , 
                                select : 'slug'
                            }
                        ]
                    },
                    'skin' ,
                    {
                        path : 'episode',
                        populate : [{path : 'skin' ,select : 'slug'}]},
                    'hair' ,
                        {
                            path : 'episode',
                            populate : [{path : 'hair' ,select : 'slug'}]},
                    'health' ,
                            {
                                path : 'episode',
                                populate : [{path : 'health' ,select : 'slug'}]},
                    'decorative' ,
                                {
                                    path : 'episode',
                                    populate : [{path : 'decorative' ,select : 'slug'}]},
                    'limb' ,
                                    {
                                        path : 'episode',
                                        populate : [{path : 'limb' ,select : 'slug'}]},
                    'rosy' ,
                                        {
                                            path : 'episode',
                                            populate : [{path : 'rosy' ,select : 'slug'}]},
                    'electric' ,
                                            {
                                                path : 'episode',
                                                populate : [{path : 'electric' ,select : 'slug'}]},
                ],
                
            });
            //return res.json(likes)
            let available = await Available.find({}).populate('cosmetic').exec();
            let logos = await Logo.find({});

            if (req.session.cart && req.session.cart.length == 0) {
                delete req.session.cart;
                res.redirect("/cart");
            } else {
                res.render("home/panel/favorites", {
                    title,
                    cart: req.session.cart,
                    cosmetics,
                    categories,categories_Skin,categories_hair,categories_limb,categories_health,categories_rosy,categories_decorative,
                    categories_electric,
                    likes,
                    cosmetic,
                    available,
                    logos,
                    key: ""
                });
            }       
    }
    async history(req , res , next) {
        let title = "سفارش ها";

            let query = {};
            let{search, type,typetwo, category } = req.query;
            if(search) 
                query.title = new RegExp(search , 'gi');

            if(type && type != 'all')
                query.type = type;

            if(typetwo && typetwo != 'notavailable')
                query.typetwo = typetwo;

            if(category && category != 'all'){
                 category = await Category.findOne({slug: category}); 
            } 
            let cosmetics = Cosmetic.find({ ...query }).populate('payment');

            if(req.query.order) 
            cosmetics.sort({ createdAt : -1})

            cosmetics = await cosmetics.exec();
            let logos = await Logo.find({});
            let categories = await Category.find({ parent : null }).populate('childs').exec();
            let categories_Skin = await Category_Skin.find({ parent : null }).populate('childs').exec();
            let categories_hair = await Category_hair.find({ parent : null }).populate('childs').exec();
            let categories_limb = await Category_limb.find({ parent : null }).populate('childs').exec();
            let categories_health = await Category_health.find({ parent : null }).populate('childs').exec();
            let categories_rosy = await Category_rosy.find({ parent : null }).populate('childs').exec();
            let categories_decorative = await Category_decorative.find({ parent : null }).populate('childs').exec();
            let categories_electric = await Category_electric.find({ parent : null }).populate('childs').exec();
            let page = req.query.page || 1;
            let payments = await Payment.paginate({ user : req.user.id } , { page , sort : { createdAt : -1} , limit : 10 , populate : 'engine'});

            if (req.session.cart && req.session.cart.length == 0) {
                delete req.session.cart;
                res.redirect("/panel/history");
            } else {
                res.render("home/panel/history", {
                    title,
                    cart: req.session.cart,
                    cosmetics,
                    categories,categories_Skin,categories_hair,categories_limb,categories_health,categories_rosy,categories_decorative,
                    categories_electric,
                    payments,
                    logos,
                    key: ""
                });
            }
        }
}

module.exports = new userController();