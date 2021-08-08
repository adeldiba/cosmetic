const controller = require('./controller');
const Cosmetic = require('app/models/cosmetic');
const Skin = require('app/models/skin');
const Hair = require('app/models/hair');
const Health = require('app/models/health');
const Rosy = require('app/models/rosy');
const Limb = require('app/models/limb');
const Electric = require('app/models/electric');
const Decorative = require('app/models/decorative');
const Category = require('app/models/category');
const Category_Skin = require('app/models/category_Skin');
const Category_hair = require('app/models/category_hair');
const Category_limb = require('app/models/category_limb');
const Category_electric = require('app/models/category_electric');
const Category_health = require('app/models/category_health');
const Category_rosy = require('app/models/category_rosy');
const Category_decorative = require('app/models/category_decorative');
const Panel = require('app/models/panel');
const Payment = require('app/models/payment');
const Logo = require('app/models/logo');
const request = require("request-promise");
const _ = require("lodash");

class shoppingController extends controller{
    async index(req,res, next){
        try {
            if (!req.session.cart || req.session.cart.length === 0) {
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
            const rosy_ids = _.map(carts, (item) => {
                if (false === item.is_skin) {
                    return item._id;
                }
            });
            const limb_ids = _.map(carts, (item) => {
                if (false === item.is_skin) {
                    return item._id;
                }
            });
            const decorative_ids = _.map(carts, (item) => {
                if (false === item.is_skin) {
                    return item._id;
                }
            });
            const electric_ids = _.map(carts, (item) => {
                if (false === item.is_skin) {
                    return item._id;
                }
            });
    
            const shoppingList = [];
            let totalPrice = 0;
    
            let payment = await Payment.find({
                parent: null
            }).populate("cart")
                .exec();
            
            let categories = await Category.find({ parent : null }).populate('childs').exec();
            let categories_Skin = await Category_Skin.find({ parent : null }).populate('childs').exec();
            let categories_hair = await Category_hair.find({ parent : null }).populate('childs').exec();
            let categories_limb = await Category_limb.find({ parent : null }).populate('childs').exec();
            let categories_health = await Category_health.find({ parent : null }).populate('childs').exec();
            let categories_rosy = await Category_rosy.find({ parent : null }).populate('childs').exec();
            let categories_decorative = await Category_decorative.find({ parent : null }).populate('childs').exec();
            let categories_electric = await Category_electric.find({ parent : null }).populate('childs').exec();
    
            let panels = await Panel.find({ user: req.user.id }).populate('payment');
            let logos = await Logo.find({});
            let cosmetics = await Cosmetic.find({
                _id: { $in: [...cosmetic_ids] }
            })
            .populate('cart');
    
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
            //return res.json(i);
            res.render("home/shopping", {
                title: "خرید محصول",
                cart: req.session.cart,
                categories,categories_limb,categories_Skin,categories_hair,categories_health,categories_rosy,categories_decorative,
                categories_electric,
                payment,
                panels,
                shoppingList,
                totalPrice,
                cosmetics,
                logos,
                key: ""
            });
        } catch (err) {
            next(err);
        }
    }
    async payment(req, res, next) {
        try {
            // this.isMongoId(req.body.special);
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
            const rosy_ids = _.map(carts, (item) => {
                if (false === item.is_skin) {
                    return item._id;
                }
            });
            const limb_ids = _.map(carts, (item) => {
                if (false === item.is_skin) {
                    return item._id;
                }
            });
            const decorative_ids = _.map(carts, (item) => {
                if (false === item.is_skin) {
                    return item._id;
                }
            });
            const electric_ids = _.map(carts, (item) => {
                if (false === item.is_skin) {
                    return item._id;
                }
            });

            const addressMan = [];
            const shoppingList = [];
            let totalPrice = 0;
            
            let panels = await Panel.find({ user: req.user.id }).populate('payment');
            
            let cosmetics = await Cosmetic.find({
                _id: { $in: [...cosmetic_ids] }
            }).exec();
              
            const mengine = [];
            
            for (let i of panels) {
                const c = _.find( { _id: String(i._id) });
                if (!c) continue;
                i = JSON.parse(JSON.stringify(i));
                addressMan.push({ 
                  i: i.name,
                  'نام خانوادگی': i.name_family,
                  'شماره موبایل' : i.phone,
                  'کدملی' : i.codeM ,
                  'استان': i.state ,
                  'شهر' : i.city ,
                  'آدرس' : i.address ,
                  'کدپستی' : i.postal_code   
                });
            }
            
            for (let i of cosmetics) {
                const c = _.find(carts, { _id: String(i._id) });
                if (!c) continue;
                totalPrice += parseInt(i.price.toString().replace(/,/g, ""),10) * c.qty;
                i.qty = c.qty;
                i.is_skin = false;
                i = JSON.parse(JSON.stringify(i));
                shoppingList.push({ 'نام محصول': i.title, 'تعداد': c.qty });
            }

            let skins = await Skin.find({
                _id: { $in: [...skin_ids] }
            }).exec();

            for (let i of skins) {
                const c = _.find(carts, { _id: String(i._id) });
                if (!c) continue;
                totalPrice += parseInt(i.price.toString().replace(/,/g, ""),10) * c.qty;
                i.qty = c.qty;
                i.is_skin = true;
                i = JSON.parse(JSON.stringify(i));
                shoppingList.push({ 'نام محصول': i.title, 'تعداد': c.qty, is_special: true });
            }

            let hairs = await Hair.find({
                _id: { $in: [...hair_ids] }
            }).exec();

            for (let i of hairs) {
                const c = _.find(carts, { _id: String(i._id) });
                if (!c) continue;
                totalPrice += parseInt(i.price.toString().replace(/,/g, ""),10) * c.qty;
                i.qty = c.qty;
                i.is_skin = false;
                i = JSON.parse(JSON.stringify(i));
                shoppingList.push({ 'نام محصول': i.title, 'تعداد': c.qty });
            }

            let health = await Health.find({
                _id: { $in: [...health_ids] }
            }).exec();

            for (let i of health) {
                const c = _.find(carts, { _id: String(i._id) });
                if (!c) continue;
                totalPrice += parseInt(i.price.toString().replace(/,/g, ""),10) * c.qty;
                i.qty = c.qty;
                i.is_skin = false;
                i = JSON.parse(JSON.stringify(i));
                shoppingList.push({ 'نام محصول': i.title, 'تعداد': c.qty });
            }
            let limb = await Limb.find({
                _id: { $in: [...limb_ids] }
            }).exec();

            for (let i of limb) {
                const c = _.find(carts, { _id: String(i._id) });
                if (!c) continue;
                totalPrice += parseInt(i.price.toString().replace(/,/g, ""),10) * c.qty;
                i.qty = c.qty;
                i.is_skin = false;
                i = JSON.parse(JSON.stringify(i));
                shoppingList.push({ 'نام محصول': i.title, 'تعداد': c.qty });
            }
            let decorative = await Decorative.find({
                _id: { $in: [...decorative_ids] }
            }).exec();

            for (let i of decorative) {
                const c = _.find(carts, { _id: String(i._id) });
                if (!c) continue;
                totalPrice += parseInt(i.price.toString().replace(/,/g, ""),10) * c.qty;
                i.qty = c.qty;
                i.is_skin = false;
                i = JSON.parse(JSON.stringify(i));
                shoppingList.push({ 'نام محصول': i.title, 'تعداد': c.qty });
            }
            let rosy = await Rosy.find({
                _id: { $in: [...rosy_ids] }
            }).exec();

            for (let i of rosy) {
                const c = _.find(carts, { _id: String(i._id) });
                if (!c) continue;
                totalPrice += parseInt(i.price.toString().replace(/,/g, ""),10) * c.qty;
                i.qty = c.qty;
                i.is_skin = false;
                i = JSON.parse(JSON.stringify(i));
                shoppingList.push({ 'نام محصول': i.title, 'تعداد': c.qty });
            }
            let electric = await Electric.find({
                _id: { $in: [...electric_ids] }
            }).exec();

            for (let i of electric) {
                const c = _.find(carts, { _id: String(i._id) });
                if (!c) continue;
                totalPrice += parseInt(i.price.toString().replace(/,/g, ""),10) * c.qty;
                i.qty = c.qty;
                i.is_skin = false;
                i = JSON.parse(JSON.stringify(i));
                shoppingList.push({ 'نام محصول': i.title, 'تعداد': c.qty });
            }

            // buy proccess
            let params = {
                MerchantID: "f83cc956-f59f-11e6-889a-005056a205be",
                Amount: totalPrice ,
                CallbackURL: "http://localhost:3000/shopping/payment/checker",
                Description: "بابت خرید محصول از فروشگاه", 
                Email: req.user.email
            };

            let options = this.getUrlOption(
                "https://www.zarinpal.com/pg/rest/WebGate/PaymentRequest.json",
                params
            );

            request(options)
                .then(async (data) => {
                    let payment = new Payment({
                        user: req.user.id,
                        resnumber: data.Authority,
                        price: totalPrice ,
                        products: shoppingList,
                        proAddress: addressMan
                    });
                  
                    await payment.save();
                    res.redirect(
                        `https://www.zarinpal.com/pg/StartPay/${data.Authority}`
                    );
                })
                .catch((err) => res.json(err.message));
        } catch (err) {
            next(err);
        }
    }

    async checker(req, res, next) {
        try {
            if (req.query.Status && req.query.Status !== "OK")
            return res.redirect('/not_success');

            let payment = await Payment.findOne({
                resnumber: req.query.Authority,
                user: req.user.id,
            })
                .populate("cart")
                .exec();

            if (!payment) {
                return this.alertAndBack(req, res, {
                    title: "کاربر گرامی",
                    message: "محصولی که شما پرداخت کرده اید وجود ندارد",
                    type: "error"
                });
            }

            let params = {
                MerchantID: "f83cc956-f59f-11e6-889a-005056a205be",
                Amount: payment.price,
                Authority: req.query.Authority
            };

            let options = this.getUrlOption(
                "https://www.zarinpal.com/pg/rest/WebGate/PaymentVerification.json",
                params
            );

            request(options)
                .then(async (data) => {
                    console.log(data);
                    if (data.Status == 100) {
                        payment.set({ payment: true });
                         //req.user.push(payment.profile.address);
                        await payment.save();
                        await req.user.save();
                        delete req.session.cart;

                         return res.redirect('/success_shop');
                    } else {
                        return res.redirect('/not_success');
                    }
                })
                .catch((err) => {
                    next(err);
                });
        } catch (err) {
            next(err);
        }
    }
    

    getUrlOption(url, params) {
        return {
            method: "POST",
            uri: url,
            headers: {
                "cache-control": "no-cache",
                "content-type": "application/json"
            },
            body: params,
            json: true
        };
    }   
}

module.exports = new shoppingController();