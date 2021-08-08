const controller = require('./controller');
const Cosmetic = require('app/models/cosmetic');
const Skin = require('app/models/skin');
const Hair = require('app/models/hair');
const Health = require('app/models/health');
const Rosy = require('app/models/rosy');
const Limb = require('app/models/limb');
const Electric = require('app/models/electric');
const Decorative = require('app/models/decorative');
const Panel = require('app/models/panel');
const Logo = require('app/models/logo');
const Category = require('app/models/category');
const Category_Skin = require('app/models/category_Skin');
const Category_hair = require('app/models/category_hair');
const Category_limb = require('app/models/category_limb');
const Category_electric = require('app/models/category_electric');
const Category_health = require('app/models/category_health');
const Category_rosy = require('app/models/category_rosy');
const Category_decorative = require('app/models/category_decorative');
const Payment = require('app/models/payment');
const fs = require('fs');
const path = require('path');
const _ = require("lodash");
//const PDFDocument = require('pdfkit');
//const stripe = require('stripe')('sk_test_FkQY2fYPRs5EqvcI04x7Hts100VoxLP4fe');

class cartController extends controller{
  async index(req,res, next){
    try {
                                               
        let cosmetics = Cosmetic.find({}).populate('cart');
        if(req.query.order) 
        cosmetics.sort({ createdAt : 1})

        cosmetics = await cosmetics.exec();
        //return res.json(cosmetics) 
        let skins = await Skin.find({}).populate("cart").exec();
        let hairs = await Hair.find({}).populate("cart").exec();
        let healths = await Health.find({}).populate("cart").exec();
        let rosys = await Rosy.find({}).populate("cart").exec();
        let electrics = await Electric.find({}).populate("cart").exec();
        let limbs = await Limb.find({}).populate("cart").exec();
        let decorative = await Decorative.find({}).populate("cart").exec();
        let categories = await Category.find({ parent : null }).populate('childs').exec();
        let categories_Skin = await Category_Skin.find({ parent : null }).populate('childs').exec();
        let categories_hair = await Category_hair.find({ parent : null }).populate('childs').exec();
        let categories_limb = await Category_limb.find({ parent : null }).populate('childs').exec();
        let categories_health = await Category_health.find({ parent : null }).populate('childs').exec();
        let categories_rosy = await Category_rosy.find({ parent : null }).populate('childs').exec();
        let categories_decorative = await Category_decorative.find({ parent : null }).populate('childs').exec();
        let categories_electric = await Category_electric.find({ parent : null }).populate('childs').exec();
        let panels = await Panel.find({user:req.user.id }).populate('user').exec();
        let logos = await Logo.find({}).populate().exec();
        if (req.session.cart && req.session.cart.length == 0) {
            delete req.session.cart;
            res.redirect("/cart");
        } else {

            res.render("home/cart", {
                title: "سبد خرید شما",
                cart: req.session.cart,
                cosmetics,
                categories,categories_Skin,categories_hair,categories_limb,categories_health,categories_rosy,categories_decorative,
                categories_electric,
                panels,
                skins,
                hairs,
                healths,rosys,electrics,decorative,limbs,
                logos,
                key: "",
            });
        }
    } catch (err) {
        next(err);
    }
}

async add(req,res, next){
    try {
        let categories = await Category.find({ parent : null }).populate('childs').exec();
        var slug = req.params.cosmetic;
        
       await Cosmetic.findOne({slug: slug}, (err, cosmetic)=>{ 
         
            if(err)
               console.log(err);
          
            if (typeof req.session.cart == "undefined") {
                req.session.cart = [];
                req.session.cart.push({
                    _id: cosmetic._id,
                    title: cosmetic.title,
                    notprice: cosmetic.notprice,
                    is_skin: false,
                    model: cosmetic.model,
                    //typetwo: cosmetic.typetwo,
                    qty: 1,
                     price: parseInt(
                      cosmetic.price.toString().replace(/,/g, ""),
                    10
                ),
                    file: cosmetic.file         
              });
            }else{
                var cart = req.session.cart;
                var newItem = true;
      
                for (var i = 0; i < cart.length; i++){
                    if (cart[i].title == slug){
                        cart[i].qty++;
                        newItem = false;
                        break;
                    }
                }
                if (newItem) {
                    cart.push({
                        title: cosmetic.title,
                        _id: cosmetic._id,
                        notprice: cosmetic.notprice,
                        is_skin: false,
                        model: cosmetic.model,
                        //typetwo: cosmetic.typetwo,
                        qty: 1,
                        price: parseInt(
                          cosmetic.price.toString().replace(/,/g, ""),
                            10
                        ),
                        file:  cosmetic.file ,      
                    });
                }
            }
            this.alert(req , {
                message : 'محصول مورد نظر با موفقیت به سبد خرید اضافه شد',
                icon : 'success'
            })  
            //return this.back(req, res);
            res.redirect('/cart', cosmetic,categories);
         }).populate();
    } catch (err) {
        next(err)
    }
}
async addItem(req,res, next){
    try {
        let categories = await Category.find({ parent : null }).populate('childs').exec();
        var slug = req.params.cosmetic;
        
       await Cosmetic.findOne({slug: slug}, (err, cosmetic)=>{ 
         
            if(err)
               console.log(err);
          
            if (typeof req.session.cart == "undefined") {
                req.session.cart = [];
                req.session.cart.push({
                    _id: cosmetic._id,
                    title: cosmetic.title,
                    notprice: cosmetic.notprice,
                    is_skin: false,
                    model: cosmetic.model,
                    //typetwo: cosmetic.typetwo,
                    qty: 1,
                     price: parseInt(
                      cosmetic.price.toString().replace(/,/g, ""),
                    10
                ),
                    file: cosmetic.file         
              });
            }else{
                var cart = req.session.cart;
                var newItem = true;
      
                for (var i = 0; i < cart.length; i++){
                    if (cart[i].title == slug){
                        cart[i].qty++;
                        newItem = false;
                        break;
                    }
                }
                if (newItem) {
                    cart.push({
                        title: cosmetic.title,
                        _id: cosmetic._id,
                        notprice: cosmetic.notprice,
                        is_skin: false,
                        model: cosmetic.model,
                        //typetwo: cosmetic.typetwo,
                        qty: 1,
                        price: parseInt(
                          cosmetic.price.toString().replace(/,/g, ""),
                            10
                        ),
                        file:  cosmetic.file ,      
                    });
                }
            }
            this.alert(req , {
                message : 'محصول مورد نظر با موفقیت به سبد خرید اضافه شد',
                icon : 'success'
            })  
            return this.back(req, res);
            //res.redirect('/cart', cosmetic,categories);
         }).populate();
    } catch (err) {
        next(err)
    }
}
async adds(req, res) {
    let categories = await Category.find({parent: null}).populate("childs").exec();
    //let logo = await Logo.find({});

    let slug = req.params.skin;
    Skin.findOne({ slug: slug }, function(err, skin) {
        if (err) console.log(err);
        if (typeof req.session.cart == "undefined") {
            req.session.cart = [];
            req.session.cart.push({ 
                title: slug,
                _id: skin._id,
                is_skin: true,
                model: skin.model,
                qty: 1,
                price: parseInt(skin.price.toString().replace(/,/g, ""),10),
                file: skin.file 
            });
        } else {
            var cart = req.session.cart;
            var newItem = true;

            for (var i = 0; i < cart.length; i++) {
                if (cart[i].title == slug) {
                    cart[i].qty++;
                    newItem = false;
                    break;
                }
            }
            if (newItem) {
                cart.push({
                    title: slug,
                    model: skin.model,
                    _id: skin._id,
                    is_skin: true,
                    qty: 1,
                    price: parseInt(
                        skin.price.toString().replace(/,/g, ""),
                        10
                    ),
                    file: skin.file
                });
            }
        }

        res.redirect("/cart", skin, categories);
    });
}
// helth
async add_health(req,res, next){
    try {
        let categories = await Category.find({ parent : null }).populate('childs').exec();
        var slug = req.params.health;
        
       await Health.findOne({slug: slug}, (err, health)=>{ 
         
            if(err)
               console.log(err);
          
            if (typeof req.session.cart == "undefined") {
                req.session.cart = [];
                req.session.cart.push({
                    _id: health._id,
                    title: slug,
                    notprice: health.notprice,
                    is_special: false,
                    model: health.model,
                    //typetwo: cosmetic.typetwo,
                    qty: 1,
                     price: parseInt(
                        health.price.toString().replace(/,/g, ""),
                    10
                ),
                    file: health.file         
              });
            }else{
                var cart = req.session.cart;
                var newItem = true;
      
                for (var i = 0; i < cart.length; i++){
                    if (cart[i].title == slug){
                        cart[i].qty++;
                        newItem = false;
                        break;
                    }
                }
                if (newItem) {
                    cart.push({
                        title: slug,
                        _id: health._id,
                        notprice: health.notprice,
                        is_special: false,
                        model: health.model,
                        //typetwo: cosmetic.typetwo,
                        qty: 1,
                        price: parseInt(
                            health.price.toString().replace(/,/g, ""),
                            10
                        ),
                        file:  health.file ,      
                    });
                }
            }
           
            res.redirect('/cart', health,categories);
         }).populate();
    } catch (err) {
        next(err)
    }
}
async addItem_health(req,res, next){
    try {
        let categories = await Category.find({ parent : null }).populate('childs').exec();
        var slug = req.params.health;
        
       await Health.findOne({slug: slug}, (err, health)=>{ 
         
            if(err)
               console.log(err);
          
            if (typeof req.session.cart == "undefined") {
                req.session.cart = [];
                req.session.cart.push({
                    _id: health._id,
                    title: health.title,
                    notprice: health.notprice,
                    is_skin: false,
                    model: health.model,
                    //typetwo: cosmetic.typetwo,
                    qty: 1,
                     price: parseInt(
                        health.price.toString().replace(/,/g, ""),
                    10
                ),
                    file: health.file         
              });
            }else{
                var cart = req.session.cart;
                var newItem = true;
      
                for (var i = 0; i < cart.length; i++){
                    if (cart[i].title == slug){
                        cart[i].qty++;
                        newItem = false;
                        break;
                    }
                }
                if (newItem) {
                    cart.push({
                        title: health.title,
                        _id: health._id,
                        notprice: health.notprice,
                        is_skin: false,
                        model: health.model,
                        //typetwo: cosmetic.typetwo,
                        qty: 1,
                        price: parseInt(
                            health.price.toString().replace(/,/g, ""),
                            10
                        ),
                        file:  health.file ,      
                    });
                }
            }
            this.alert(req , {
                message : 'محصول مورد نظر با موفقیت به سبد خرید اضافه شد',
                icon : 'success'
            })  
            return this.back(req, res);
            //res.redirect('/cart', cosmetic,categories);
         }).populate();
    } catch (err) {
        next(err)
    }
}
// end health
// rosy
async add_rosy(req,res, next){
    try {
        let categories = await Category.find({ parent : null }).populate('childs').exec();
        var slug = req.params.rosy;
        
       await Rosy.findOne({slug: slug}, (err, rosy)=>{ 
         
            if(err)
               console.log(err);
          
            if (typeof req.session.cart == "undefined") {
                req.session.cart = [];
                req.session.cart.push({
                    _id: rosy._id,
                    title: slug,
                    notprice: rosy.notprice,
                    is_special: false,
                    model: rosy.model,
                    //typetwo: cosmetic.typetwo,
                    qty: 1,
                     price: parseInt(
                        rosy.price.toString().replace(/,/g, ""),
                    10
                ),
                    file: rosy.file         
              });
            }else{
                var cart = req.session.cart;
                var newItem = true;
      
                for (var i = 0; i < cart.length; i++){
                    if (cart[i].title == slug){
                        cart[i].qty++;
                        newItem = false;
                        break;
                    }
                }
                if (newItem) {
                    cart.push({
                        title: slug,
                        _id: rosy._id,
                        notprice: rosy.notprice,
                        is_special: false,
                        model: rosy.model,
                        //typetwo: cosmetic.typetwo,
                        qty: 1,
                        price: parseInt(
                            rosy.price.toString().replace(/,/g, ""),
                            10
                        ),
                        file: rosy.file ,      
                    });
                }
            }
           
            res.redirect('/cart', rosy,categories);
         }).populate();
    } catch (err) {
        next(err)
    }
}
async addItem_rosy(req,res, next){
    try {
        let categories = await Category.find({ parent : null }).populate('childs').exec();
        var slug = req.params.rosy;
        
       await Rosy.findOne({slug: slug}, (err, rosy)=>{ 
         
            if(err)
               console.log(err);
          
            if (typeof req.session.cart == "undefined") {
                req.session.cart = [];
                req.session.cart.push({
                    _id: rosy._id,
                    title: rosy.title,
                    notprice: rosy.notprice,
                    is_skin: false,
                    model: rosy.model,
                    //typetwo: cosmetic.typetwo,
                    qty: 1,
                     price: parseInt(
                        rosy.price.toString().replace(/,/g, ""),
                    10
                ),
                    file: rosy.file         
              });
            }else{
                var cart = req.session.cart;
                var newItem = true;
      
                for (var i = 0; i < cart.length; i++){
                    if (cart[i].title == slug){
                        cart[i].qty++;
                        newItem = false;
                        break;
                    }
                }
                if (newItem) {
                    cart.push({
                        title: rosy.title,
                        _id: rosy._id,
                        notprice: rosy.notprice,
                        is_skin: false,
                        model: rosy.model,
                        //typetwo: cosmetic.typetwo,
                        qty: 1,
                        price: parseInt(
                            rosy.price.toString().replace(/,/g, ""),
                            10
                        ),
                        file:  rosy.file ,      
                    });
                }
            }
            this.alert(req , {
                message : 'محصول مورد نظر با موفقیت به سبد خرید اضافه شد',
                icon : 'success'
            })  
            return this.back(req, res);
            //res.redirect('/cart', cosmetic,categories);
         }).populate();
    } catch (err) {
        next(err)
    }
}
// end rosy
// electric
async add_electric(req,res, next){
    try {
        let categories = await Category.find({ parent : null }).populate('childs').exec();
        var slug = req.params.electric;
        
       await Electric.findOne({slug: slug}, (err, electric)=>{ 
         
            if(err)
               console.log(err);
          
            if (typeof req.session.cart == "undefined") {
                req.session.cart = [];
                req.session.cart.push({
                    _id: electric._id,
                    title: slug,
                    notprice: electric.notprice,
                    is_special: false,
                    model: electric.model,
                    //typetwo: cosmetic.typetwo,
                    qty: 1,
                     price: parseInt(
                        electric.price.toString().replace(/,/g, ""),
                    10
                ),
                    file: electric.file         
              });
            }else{
                var cart = req.session.cart;
                var newItem = true;
      
                for (var i = 0; i < cart.length; i++){
                    if (cart[i].title == slug){
                        cart[i].qty++;
                        newItem = false;
                        break;
                    }
                }
                if (newItem) {
                    cart.push({
                        title: slug,
                        _id: electric._id,
                        notprice: electric.notprice,
                        is_special: false,
                        model: electric.model,
                        //typetwo: cosmetic.typetwo,
                        qty: 1,
                        price: parseInt(
                            electric.price.toString().replace(/,/g, ""),
                            10
                        ),
                        file: electric.file ,      
                    });
                }
            }
           
            res.redirect('/cart', electric,categories);
         }).populate();
    } catch (err) {
        next(err)
    }
}
async addItem_electric(req,res, next){
    try {
        let categories = await Category.find({ parent : null }).populate('childs').exec();
        var slug = req.params.electric;
        
       await Electric.findOne({slug: slug}, (err, electric)=>{ 
         
            if(err)
               console.log(err);
          
            if (typeof req.session.cart == "undefined") {
                req.session.cart = [];
                req.session.cart.push({
                    _id: electric._id,
                    title: electric.title,
                    notprice: electric.notprice,
                    is_skin: false,
                    model: electric.model,
                    //typetwo: cosmetic.typetwo,
                    qty: 1,
                     price: parseInt(
                        electric.price.toString().replace(/,/g, ""),
                    10
                ),
                    file: electric.file         
              });
            }else{
                var cart = req.session.cart;
                var newItem = true;
      
                for (var i = 0; i < cart.length; i++){
                    if (cart[i].title == slug){
                        cart[i].qty++;
                        newItem = false;
                        break;
                    }
                }
                if (newItem) {
                    cart.push({
                        title: electric.title,
                        _id: electric._id,
                        notprice: electric.notprice,
                        is_skin: false,
                        model: electric.model,
                        //typetwo: cosmetic.typetwo,
                        qty: 1,
                        price: parseInt(
                            electric.price.toString().replace(/,/g, ""),
                            10
                        ),
                        file:  electric.file ,      
                    });
                }
            }
            this.alert(req , {
                message : 'محصول مورد نظر با موفقیت به سبد خرید اضافه شد',
                icon : 'success'
            })  
            return this.back(req, res);
            //res.redirect('/cart', cosmetic,categories);
         }).populate();
    } catch (err) {
        next(err)
    }
}
// end electric
// decorative
async add_decorative(req,res, next){
    try {
        let categories = await Category.find({ parent : null }).populate('childs').exec();
        var slug = req.params.decorative;
        
       await Decorative.findOne({slug: slug}, (err, decorative)=>{ 
         
            if(err)
               console.log(err);
          
            if (typeof req.session.cart == "undefined") {
                req.session.cart = [];
                req.session.cart.push({
                    _id: decorative._id,
                    title: slug,
                    notprice: decorative.notprice,
                    is_special: false,
                    model: decorative.model,
                    //typetwo: cosmetic.typetwo,
                    qty: 1,
                     price: parseInt(
                        decorative.price.toString().replace(/,/g, ""),
                    10
                ),
                    file: decorative.file         
              });
            }else{
                var cart = req.session.cart;
                var newItem = true;
      
                for (var i = 0; i < cart.length; i++){
                    if (cart[i].title == slug){
                        cart[i].qty++;
                        newItem = false;
                        break;
                    }
                }
                if (newItem) {
                    cart.push({
                        title: slug,
                        _id: decorative._id,
                        notprice: decorative.notprice,
                        is_special: false,
                        model: decorative.model,
                        //typetwo: cosmetic.typetwo,
                        qty: 1,
                        price: parseInt(
                            decorative.price.toString().replace(/,/g, ""),
                            10
                        ),
                        file: decorative.file ,      
                    });
                }
            }
           
            res.redirect('/cart', decorative,categories);
         }).populate();
    } catch (err) {
        next(err)
    }
}
async addItem_decorative(req,res, next){
    try {
        let categories = await Category.find({ parent : null }).populate('childs').exec();
        var slug = req.params.decorative;
        
       await Decorative.findOne({slug: slug}, (err, decorative)=>{ 
         
            if(err)
               console.log(err);
          
            if (typeof req.session.cart == "undefined") {
                req.session.cart = [];
                req.session.cart.push({
                    _id: decorative._id,
                    title: decorative.title,
                    notprice: decorative.notprice,
                    is_skin: false,
                    model: decorative.model,
                    //typetwo: cosmetic.typetwo,
                    qty: 1,
                     price: parseInt(
                        decorative.price.toString().replace(/,/g, ""),
                    10
                ),
                    file: decorative.file         
              });
            }else{
                var cart = req.session.cart;
                var newItem = true;
      
                for (var i = 0; i < cart.length; i++){
                    if (cart[i].title == slug){
                        cart[i].qty++;
                        newItem = false;
                        break;
                    }
                }
                if (newItem) {
                    cart.push({
                        title: decorative.title,
                        _id: decorative._id,
                        notprice: decorative.notprice,
                        is_skin: false,
                        model: decorative.model,
                        //typetwo: cosmetic.typetwo,
                        qty: 1,
                        price: parseInt(
                            decorative.price.toString().replace(/,/g, ""),
                            10
                        ),
                        file:  decorative.file ,      
                    });
                }
            }
            this.alert(req , {
                message : 'محصول مورد نظر با موفقیت به سبد خرید اضافه شد',
                icon : 'success'
            })  
            return this.back(req, res);
            //res.redirect('/cart', cosmetic,categories);
         }).populate();
    } catch (err) {
        next(err)
    }
}
// end decorative
// limb
async add_limb(req,res, next){
    try {
        let categories = await Category.find({ parent : null }).populate('childs').exec();
        var slug = req.params.limb;
        
       await Limb.findOne({slug: slug}, (err, limb)=>{ 
         
            if(err)
               console.log(err);
          
            if (typeof req.session.cart == "undefined") {
                req.session.cart = [];
                req.session.cart.push({
                    _id: limb._id,
                    title: slug,
                    notprice: limb.notprice,
                    is_special: false,
                    model: limb.model,
                    //typetwo: cosmetic.typetwo,
                    qty: 1,
                     price: parseInt(
                        limb.price.toString().replace(/,/g, ""),
                    10
                ),
                    file: limb.file         
              });
            }else{
                var cart = req.session.cart;
                var newItem = true;
      
                for (var i = 0; i < cart.length; i++){
                    if (cart[i].title == slug){
                        cart[i].qty++;
                        newItem = false;
                        break;
                    }
                }
                if (newItem) {
                    cart.push({
                        title: slug,
                        _id: limb._id,
                        notprice: limb.notprice,
                        is_special: false,
                        model: limb.model,
                        //typetwo: cosmetic.typetwo,
                        qty: 1,
                        price: parseInt(
                            limb.price.toString().replace(/,/g, ""),
                            10
                        ),
                        file: limb.file ,      
                    });
                }
            }
           
            res.redirect('/cart', limb,categories);
         }).populate();
    } catch (err) {
        next(err)
    }
}
async addItem_limb(req,res, next){
    try {
        let categories = await Category.find({ parent : null }).populate('childs').exec();
        var slug = req.params.limb;
        
       await Limb.findOne({slug: slug}, (err, limb)=>{ 
         
            if(err)
               console.log(err);
          
            if (typeof req.session.cart == "undefined") {
                req.session.cart = [];
                req.session.cart.push({
                    _id: limb._id,
                    title: limb.title,
                    notprice: limb.notprice,
                    is_skin: false,
                    model: limb.model,
                    //typetwo: cosmetic.typetwo,
                    qty: 1,
                     price: parseInt(
                        limb.price.toString().replace(/,/g, ""),
                    10
                ),
                    file: limb.file         
              });
            }else{
                var cart = req.session.cart;
                var newItem = true;
      
                for (var i = 0; i < cart.length; i++){
                    if (cart[i].title == slug){
                        cart[i].qty++;
                        newItem = false;
                        break;
                    }
                }
                if (newItem) {
                    cart.push({
                        title: limb.title,
                        _id: limb._id,
                        notprice: limb.notprice,
                        is_skin: false,
                        model: limb.model,
                        //typetwo: cosmetic.typetwo,
                        qty: 1,
                        price: parseInt(
                            limb.price.toString().replace(/,/g, ""),
                            10
                        ),
                        file:  limb.file ,      
                    });
                }
            }
            this.alert(req , {
                message : 'محصول مورد نظر با موفقیت به سبد خرید اضافه شد',
                icon : 'success'
            })  
            return this.back(req, res);
            //res.redirect('/cart', cosmetic,categories);
         }).populate();
    } catch (err) {
        next(err)
    }
}
// end limb
//skin

async addItem_skin(req,res, next){
    try {
        let categories = await Category.find({ parent : null }).populate('childs').exec();
        var slug = req.params.skin;
        
       await Skin.findOne({slug: slug}, (err, skin)=>{ 
         
            if(err)
               console.log(err);
          
            if (typeof req.session.cart == "undefined") {
                req.session.cart = [];
                req.session.cart.push({
                    _id: skin._id,
                    title: skin.title,
                    notprice: skin.notprice,
                    is_skin: true,
                    model: skin.model,
                    //typetwo: cosmetic.typetwo,
                    qty: 1,
                     price: parseInt(
                        skin.price.toString().replace(/,/g, ""),
                    10
                ),
                    file: skin.file         
              });
            }else{
                var cart = req.session.cart;
                var newItem = true;
      
                for (var i = 0; i < cart.length; i++){
                    if (cart[i].title == slug){
                        cart[i].qty++;
                        newItem = false;
                        break;
                    }
                }
                if (newItem) {
                    cart.push({
                        title: skin.title,
                        _id: skin._id,
                        notprice: skin.notprice,
                        is_skin: true,
                        model: skin.model,
                        //typetwo: cosmetic.typetwo,
                        qty: 1,
                        price: parseInt(
                            skin.price.toString().replace(/,/g, ""),
                            10
                        ),
                        file:  skin.file ,      
                    });
                }
            }
            this.alert(req , {
                message : 'محصول مورد نظر با موفقیت به سبد خرید اضافه شد',
                icon : 'success'
            })  
            return this.back(req, res);
            //res.redirect('/cart', cosmetic,categories);
         }).populate();
    } catch (err) {
        next(err)
    }
}
//end skin
async addh(req, res) {
    let categories = await Category.find({parent: null}).populate("childs").exec();
    //let logo = await Logo.find({});

    let slug = req.params.hair;
    Hair.findOne({ slug: slug }, function(err, hair) {
        if (err) console.log(err);
        if (typeof req.session.cart == "undefined") {
            req.session.cart = [];
            req.session.cart.push({ 
                title: slug,
                _id: hair._id,
                is_skin: false,
                model: hair.model,
                qty: 1,
                price: parseInt(hair.price.toString().replace(/,/g, ""),10),
                file: hair.file 
            });
        } else {
            var cart = req.session.cart;
            var newItem = true;

            for (var i = 0; i < cart.length; i++) {
                if (cart[i].title == slug) {
                    cart[i].qty++;
                    newItem = false;
                    break;
                }
            }
            if (newItem) {
                cart.push({
                    title: slug,
                    model: hair.model,
                    _id: hair._id,
                    is_skin: false,
                    qty: 1,
                    price: parseInt(
                        hair.price.toString().replace(/,/g, ""),
                        10
                    ),
                    file: hair.file
                });
            }
        }

        res.redirect("/cart", hair, categories);
    });
}
async addItemh(req,res, next){
    try {
        let categories = await Category.find({ parent : null }).populate('childs').exec();
        var slug = req.params.hair;
        
       await Hair.findOne({slug: slug}, (err, hair)=>{ 
         
            if(err)
               console.log(err);
          
            if (typeof req.session.cart == "undefined") {
                req.session.cart = [];
                req.session.cart.push({
                    _id: hair._id,
                    title: hair.title,
                    notprice: hair.notprice,
                    is_skin: false,
                    model: hair.model,
                    //typetwo: cosmetic.typetwo,
                    qty: 1,
                     price: parseInt(
                        hair.price.toString().replace(/,/g, ""),
                    10
                ),
                    file: hair.file         
              });
            }else{
                var cart = req.session.cart;
                var newItem = true;
      
                for (var i = 0; i < cart.length; i++){
                    if (cart[i].title == slug){
                        cart[i].qty++;
                        newItem = false;
                        break;
                    }
                }
                if (newItem) {
                    cart.push({
                        title: hair.title,
                        _id: hair._id,
                        notprice: hair.notprice,
                        is_skin: false,
                        model: hair.model,
                        //typetwo: cosmetic.typetwo,
                        qty: 1,
                        price: parseInt(
                            hair.price.toString().replace(/,/g, ""),
                            10
                        ),
                        file:  hair.file ,      
                    });
                }
            }
            this.alert(req , {
                message : 'محصول مورد نظر با موفقیت به سبد خرید اضافه شد',
                icon : 'success'
            })  
            return this.back(req, res);
            //res.redirect('/cart', cosmetic,categories);
         }).populate();
    } catch (err) {
        next(err)
    }
}
async addItem(req,res, next){
    try {
        let categories = await Category.find({ parent : null }).populate('childs').exec();
        var slug = req.params.cosmetic;
        
       await Cosmetic.findOne({slug: slug}, (err, cosmetic)=>{ 
         
            if(err)
               console.log(err);
          
            if (typeof req.session.cart == "undefined") {
                req.session.cart = [];
                req.session.cart.push({
                    _id: cosmetic._id,
                    title: cosmetic.title,
                    notprice: cosmetic.notprice,
                    is_skin: false,
                    model: cosmetic.model,
                    //typetwo: cosmetic.typetwo,
                    qty: 1,
                     price: parseInt(
                      cosmetic.price.toString().replace(/,/g, ""),
                    10
                ),
                    file: cosmetic.file         
              });
            }else{
                var cart = req.session.cart;
                var newItem = true;
      
                for (var i = 0; i < cart.length; i++){
                    if (cart[i].title == slug){
                        cart[i].qty++;
                        newItem = false;
                        break;
                    }
                }
                if (newItem) {
                    cart.push({
                        title: cosmetic.title,
                        _id: cosmetic._id,
                        notprice: cosmetic.notprice,
                        is_skin: false,
                        model: cosmetic.model,
                        //typetwo: cosmetic.typetwo,
                        qty: 1,
                        price: parseInt(
                          cosmetic.price.toString().replace(/,/g, ""),
                            10
                        ),
                        file:  cosmetic.file ,      
                    });
                }
            }
            this.alert(req , {
                message : 'محصول مورد نظر با موفقیت به سبد خرید اضافه شد',
                icon : 'success'
            })  
            return this.back(req, res);
            //res.redirect('/cart', cosmetic,categories);
         }).populate();
    } catch (err) {
        next(err)
    }
}

async update(req, res) {
    var slug = req.params.cosmetic;
    var cart = req.session.cart;
    var action = req.query.action;

    for (var i = 0; i < cart.length; i++) {
        if (cart[i].title == slug) {
            switch (action) {
                case "add":
                    cart[i].qty++;
                    break;
                case "remove":
                    cart[i].qty--;
                    if (cart[i].qty < 1) cart.splice(i, 1);
                    break;
                case "clear":
                    cart.splice(i, 1);
                    if (cart.length == 0) delete req.session.cart;
                    break;
                default:
                    console.log("update problem");
                    break;
            }
            break;
        }
    }
    res.redirect("/cart");
}


async clear(req, res, next) { 
    delete req.session.cart;
    res.redirect("/cart");
}

async address(req,res, next){
    try {
        if (!req.session.cart || req.session.cart.length == 0) {
            delete req.session.cart;
            res.redirect("/shopping"); 
            return;
        }
        const carts = req.session.cart;
        const cosmetic_ids = _.map(carts, (item) => {
            if (false === item.is_skin) {
                return item._id;
            }
        });

        const skin_ids = _.map(carts, (item) => {
            if (true === item.is_skin) {
                return item._id;
            }
        });
        const hair_ids = _.map(carts, (item) => {
            if (false === item.is_skin) {
                return item._id;
            }
        });
        const health_ids = _.map(carts, (item) => {
            if (false === item.is_skin) {
                return item._id;
            }
        });
        const decorative_ids = _.map(carts, (item) => {
            if (false === item.is_skin) {
                return item._id;
            }
        });
        const limb_ids = _.map(carts, (item) => {
            if (false === item.is_skin) {
                return item._id;
            }
        });
        const electric_ids = _.map(carts, (item) => {
            if (false === item.is_skin) {
                return item._id;
            }
        });
        const rosy_ids = _.map(carts, (item) => {
            if (false === item.is_skin) {
                return item._id;
            }
        });
        const shoppingList = [];
        let totalPrice = 0;

        let payment = await Payment.find({parent: null}).populate("cart").exec();
        
        let categories = await Category.find({parent: null}).populate("childs").exec();
        let categories_Skin = await Category_Skin.find({ parent : null }).populate('childs').exec();
        let categories_hair = await Category_hair.find({ parent : null }).populate('childs').exec();
        let categories_limb = await Category_limb.find({ parent : null }).populate('childs').exec();
        let categories_health = await Category_health.find({ parent : null }).populate('childs').exec();
        let categories_rosy = await Category_rosy.find({ parent : null }).populate('childs').exec();
        let categories_decorative = await Category_decorative.find({ parent : null }).populate('childs').exec();
        let categories_electric = await Category_electric.find({ parent : null }).populate('childs').exec();
        let logos = await Logo.find({}).populate().exec();
        let panels = await Panel.find({ user: req.user.id }).populate('payment');
        let cosmetics = await Cosmetic.find({
            _id: { $in: [...cosmetic_ids] }
        }).populate('cart');
        for (let i of cosmetics) {
            const c = _.find(carts, { _id: String(i._id) });
            if (!c) continue;
            totalPrice += parseInt(i.price.toString().replace(/,/g, ""),10) * c.qty;
            i.qty = c.qty;
            shoppingList.push(i);
        }

        let skins = await Skin.find({
            _id: { $in: [...skin_ids] }
        }).populate("cart").exec();
        for (let i of skins) {
            const c = _.find(carts, { _id: String(i._id) });
            if (!c) continue;
            totalPrice += parseInt(i.price.toString().replace(/,/g, ""),10) * c.qty;
            i.qty = c.qty;
            shoppingList.push(i);
        }

        let hairs = await Hair.find({
            _id: { $in: [...hair_ids] }
        }).populate("cart").exec();
        for (let i of hairs) {
            const c = _.find(carts, { _id: String(i._id) });
            if (!c) continue;
            totalPrice += parseInt(i.price.toString().replace(/,/g, ""),10) * c.qty;
            i.qty = c.qty;
            shoppingList.push(i);
        }
        let health = await Health.find({
            _id: { $in: [...health_ids] }
        }).populate("cart").exec();
        for (let i of health) {
            const c = _.find(carts, { _id: String(i._id) });
            if (!c) continue;
            totalPrice += parseInt(i.price.toString().replace(/,/g, ""),10) * c.qty;
            i.qty = c.qty;
            shoppingList.push(i);
        }
        let decorative = await Decorative.find({
            _id: { $in: [...decorative_ids] }
        }).populate("cart").exec();
        for (let i of decorative) {
            const c = _.find(carts, { _id: String(i._id) });
            if (!c) continue;
            totalPrice += parseInt(i.price.toString().replace(/,/g, ""),10) * c.qty;
            i.qty = c.qty;
            shoppingList.push(i);
        }
        let limb = await Limb.find({
            _id: { $in: [...limb_ids] }
        }).populate("cart").exec();
        for (let i of limb) {
            const c = _.find(carts, { _id: String(i._id) });
            if (!c) continue;
            totalPrice += parseInt(i.price.toString().replace(/,/g, ""),10) * c.qty;
            i.qty = c.qty;
            shoppingList.push(i);
        }
        let electric = await Electric.find({
            _id: { $in: [...electric_ids] }
        }).populate("cart").exec();
        for (let i of electric) {
            const c = _.find(carts, { _id: String(i._id) });
            if (!c) continue;
            totalPrice += parseInt(i.price.toString().replace(/,/g, ""),10) * c.qty;
            i.qty = c.qty;
            shoppingList.push(i);
        }
        let rosy = await Rosy.find({
            _id: { $in: [...rosy_ids] }
        }).populate("cart").exec();
        for (let i of rosy) {
            const c = _.find(carts, { _id: String(i._id) });
            if (!c) continue;
            totalPrice += parseInt(i.price.toString().replace(/,/g, ""),10) * c.qty;
            i.qty = c.qty;
            shoppingList.push(i);
        }
        //return res.json(i);
        res.render("home/cart/address", {
            title: "تعیین آدرس برای خرید",
            cart: req.session.cart,
            categories,categories_limb,categories_Skin,categories_hair,categories_health,categories_rosy,categories_decorative,
            categories_electric,
            payment,
            panels,
            cosmetics,
            shoppingList,
            totalPrice,
            logos,
            key: ""
        });
    } catch (err) {
        next(err);
    }
}
}

module.exports = new cartController();