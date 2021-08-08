const express = require('express');
const router = express.Router();


// Controllers
const homeController = require('app/http/controllers/homeController');
const cosmeticController = require('app/http/controllers/cosmeticController');
const skinController = require('app/http/controllers/skinController');
const hairController = require('app/http/controllers/hairController');
const contactController = require('app/http/controllers/contactController');
const userController = require('app/http/controllers/userController');
const cartController = require('app/http/controllers/cartController');
const availableController = require('app/http/controllers/availableController');
const likeController = require('app/http/controllers/likeController');
const shoppingController = require('app/http/controllers/shoppingController');
const buyController = require('app/http/controllers/buyController');
const healthController = require('app/http/controllers/healthController');
const rosyController = require('app/http/controllers/rosyController');
const electricController = require('app/http/controllers/electricController');
const decorativeController = require('app/http/controllers/decorativeController');
const limbController = require('app/http/controllers/limbController');
const rulesController = require('app/http/controllers/rulesController');
const returnController = require('app/http/controllers/returnController');
const responseController = require('app/http/controllers/responseController');
const guideController = require('app/http/controllers/guideController');
const aboutController = require('app/http/controllers/aboutController');
const searchController = require('app/http/controllers/searchController');
// validators 
const commentValidator = require('app/http/validators/commentValidator');
const contactValidator = require('app/http/validators/contactValidator');
const userValidator = require('app/http/validators/userValidator');

// Middlewares
const redirectIfNotAuthenticated = require('app/http/middleware/redirectIfNotAuthenticated');
const redirectifPanelNotAuthenticated = require('app/http/middleware/redirectifPanelNotAuthenticated');


//search
router.get('/search', searchController.index);

router.get('/', homeController.index);

//about_us
router.get('/about_us', aboutController.about);
//contact
router.get('/contact', contactController.index);
router.post('/contact', contactValidator.handle() , contactController.store);
//cosmetics
router.get('/cosmetics', cosmeticController.index);
router.get('/cosmetics/:cosmetic', cosmeticController.single);
//skins
router.get('/skins', skinController.index);
router.get('/skins/:skin', skinController.single);
//skins
router.get('/hairs', hairController.index);
router.get('/hairs/:hair', hairController.single);
//health
router.get('/health', healthController.index);
router.get('/health/:health', healthController.single);
//rosy
router.get('/rosy', rosyController.index);
router.get('/rosy/:rosy', rosyController.single);
//electric
router.get('/electric', electricController.index);
router.get('/electric/:electric', electricController.single);
//decorative
router.get('/decorative', decorativeController.index);
router.get('/decorative/:decorative', decorativeController.single);
//limb
router.get('/limb', limbController.index);
router.get('/limb/:limb', limbController.single);
//rules
router.get('/rules', rulesController.index);
//rules
router.get('/return_product', returnController.index);
//response
router.get('/response', responseController.index);
//guide
router.get('/site_usage_guide', guideController.index);
// panel
router.get('/user/panel' , userController.index);
router.post('/user/panel', userValidator.handle(), userController.store);
router.get('/user/panel/:id/editAddress' , userController.editAddress);
router.put('/user/panel/:id', userValidator.handle(), userController.update);
router.delete('/user/panel/:id' ,userController.destroy);
router.get('/user/panel/favorites' , userController.favorites);
router.delete('/user/panel/favorites/:id' ,likeController.destroy);
router.get('/user/panel/history' , userController.history);
router.get('/user/panel/comment' , userController.comment);
//cart
router.get('/cart',redirectIfNotAuthenticated.handle, cartController.index);
router.get('/cart/add/cosmetics/:cosmetic', cartController.add);
//
router.get('/cart/add_health/health/:health', cartController.add_health);
router.get('/cart/addItem_health/health/:health', cartController.addItem_health);
//
router.get('/cart/add_rosy/rosy/:rosy', cartController.add_rosy);
router.get('/cart/addItem_rosy/rosy/:rosy', cartController.addItem_rosy);
//
router.get('/cart/add_electric/electric/:electric', cartController.add_electric);
router.get('/cart/addItem_electric/electric/:electric', cartController.addItem_electric);
//
router.get('/cart/add_decorative/decorative/:decorative', cartController.add_decorative);
router.get('/cart/addItem_decorative/decorative/:decorative', cartController.addItem_decorative);
//
router.get('/cart/add_limb/limb/:limb', cartController.add_limb);
router.get('/cart/addItem_limb/limb/:limb', cartController.addItem_limb);
//
router.get('/cart/addItem_skin/skins/:skin', cartController.addItem_skin);
//
router.get('/cart/adds/skins/:skin', cartController.adds);
router.get('/cart/addh/hairs/:hair', cartController.addh);
router.get('/cart/addItem/cosmetics/:cosmetic', cartController.addItem);
router.get('/cart/addItemh/hairs/:hair', cartController.addItemh);
router.get('/cart/update/:cosmetic' , cartController.update );
router.get('/clear' , cartController.clear);
router.get('/cart/address',redirectifPanelNotAuthenticated.handle, cartController.address);
// send_success send not_success
router.get('/not_success',redirectIfNotAuthenticated.handle, buyController.not_success);
router.get('/success_shop',redirectIfNotAuthenticated.handle, buyController.success_shop);
// available
router.post('/available/:cosmetic',redirectIfNotAuthenticated.handle,availableController.store);
// like
router.post('/like/:cosmetic',redirectIfNotAuthenticated.handle,likeController.store);
// Router Comment
router.post('/comment' , redirectIfNotAuthenticated.handle , commentValidator.handle() ,homeController.comment);
// Shopping
router.get('/shopping' ,redirectIfNotAuthenticated.handle, shoppingController.index);
router.post('/shopping/payment' , redirectIfNotAuthenticated.handle , shoppingController.payment);
router.get('/shopping/payment/checker' , redirectIfNotAuthenticated.handle , shoppingController.checker);
// Router Cart
router.get('/logout', (req, res)=>{
    req.logout();
    res.clearCookie('remember_token');
    res.redirect('/');
});

module.exports = router;