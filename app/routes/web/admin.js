const express = require('express');
const router = express.Router();

// Controllers
const adminController = require('app/http/controllers/admin/adminController');
const courseController = require('app/http/controllers/admin/courseController');
const engineController = require('app/http/controllers/admin/engineController');
const commentController = require('app/http/controllers/admin/commentController');
const aboutController = require('app/http/controllers/admin/aboutController');
// Category
const categoryController = require('app/http/controllers/admin/categoryController');
const category_SkinController = require('app/http/controllers/admin/category_SkinController');
const category_hairController = require('app/http/controllers/admin/category_hairController');
const category_limbController = require('app/http/controllers/admin/category_limbController');
const category_healthController = require('app/http/controllers/admin/category_healthController');
const category_rosyController = require('app/http/controllers/admin/category_rosyController');
const category_electricController = require('app/http/controllers/admin/category_electricController');
const category_decorativeController = require('app/http/controllers/admin/category_decorativeController');
// End Category
const userController = require('app/http/controllers/admin/userController');
const contactController = require('app/http/controllers/admin/contactController');
const rulesController = require('app/http/controllers/admin/rulesController');
const cosmeticController = require('app/http/controllers/admin/cosmeticController');
const userAddressController = require('app/http/controllers/admin/userAddressController');
const sliderController = require('app/http/controllers/admin/sliderController');
const logoController = require('app/http/controllers/admin/logoController');
const countryController = require('app/http/controllers/admin/countryController');
const genderController = require('app/http/controllers/admin/genderController');
const availableController = require('app/http/controllers/admin/availableController');
const shoppingController = require('app/http/controllers/admin/shoppingController');
const returnController = require('app/http/controllers/admin/returnController');
const responseController = require('app/http/controllers/admin/responseController');
const guideController = require('app/http/controllers/admin/guideController');
const skinController = require('app/http/controllers/admin/skinController');
const hairController = require('app/http/controllers/admin/hairController');
const rosyController = require('app/http/controllers/admin/rosyController');
const limbController = require('app/http/controllers/admin/limbController');
const performanceController = require('app/http/controllers/admin/performanceController');
const electricController = require('app/http/controllers/admin/electricController');
const healthController = require('app/http/controllers/admin/healthController');
const decorativeController = require('app/http/controllers/admin/decorativeController');
const gulleryController = require('app/http/controllers/admin/gulleryController');
const gullery_skinController = require('app/http/controllers/admin/gullery_skinController');
const gullery_hairController = require('app/http/controllers/admin/gullery_hairController');
const gullery_limbController = require('app/http/controllers/admin/gullery_limbController');
const gullery_rosyController = require('app/http/controllers/admin/gullery_rosyController');
const gullery_elController = require('app/http/controllers/admin/gullery_elController');
const gullery_hController = require('app/http/controllers/admin/gullery_hController');
const gullery_isController = require('app/http/controllers/admin/gullery_isController');
const searchController = require('app/http/controllers/admin/searchController');
// validators 
const courseValidator = require('app/http/validators/courseValidator');
const engineValidator = require('app/http/validators/engineValidator');
const electricValidator = require('app/http/validators/electricValidator');
const aboutValidator = require('app/http/validators/aboutValidator');
// category
const categoryValidator = require('app/http/validators/categoryValidator');
const category_SkinValidator = require('app/http/validators/category_SkinValidator');
const category_hairValidator = require('app/http/validators/category_hairValidator');
const category_limbValidator = require('app/http/validators/category_limbValidator');
const category_healthValidator = require('app/http/validators/category_healthValidator');
const category_rosyValidator = require('app/http/validators/category_rosyValidator');
const category_electricValidator = require('app/http/validators/category_electricValidator');
const category_decorativeValidator = require('app/http/validators/category_decorativeValidator');
// ctegory End
const registerValidator = require('app/http/validators/registerValidator');
const loginValidator = require('app/http/validators/loginValidator');
const rulesValidator = require('app/http/validators/rulesValidator');
const cosmeticValidator = require('app/http/validators/cosmeticValidator');
const sliderValidator = require('app/http/validators/sliderValidator');
const logoValidator = require('app/http/validators/logoValidator');
const countryValidator = require('app/http/validators/countryValidator');
const performanceValidator = require('app/http/validators/performanceValidator');
const genderValidator = require('app/http/validators/genderValidator');
const returnValidator = require('app/http/validators/returnValidator');
const responseValidator = require('app/http/validators/responseValidator');
const guideValidator = require('app/http/validators/guideValidator');
const skinValidator = require('app/http/validators/skinValidator');
const hairValidator = require('app/http/validators/hairValidator');
const rosyValidator = require('app/http/validators/rosyValidator');
const limbValidator = require('app/http/validators/limbValidator');
const healthValidator = require('app/http/validators/healthValidator');
const decorativeValidator = require('app/http/validators/decorativeValidator');
// Helpers
//const upload = require('app/helpers/uploadImage');

// Middlewares
const convertFileToField = require('app/http/middleware/convertFileToField');

router.use((req , res , next) => {
    res.locals.layout = "admin/master"; 
    next();
})

// search Routes
router.get('/searchs' , searchController.index);
router.get('/searchs/create' , searchController.create);
router.post('/searchs/create' , searchController.store);
router.delete('/searchs/:id' , searchController.destroy);

// Admin Routes
router.get('/' , adminController.index);
//contact
router.get('/contact' , contactController.index);
//rules
router.get('/rules' , rulesController.index);
router.get('/rules/create' , rulesController.create);
router.post('/rules/create' , rulesValidator.handle() , rulesController.store);
router.get('/rules/:id/edit' , courseController.edit);
router.put('/rules/:id' ,
    rulesValidator.handle() ,    
    rulesController.update
);
router.delete('/rules/:id' , rulesController.destroy);

router.get('/courses' , courseController.index);
router.get('/courses/create' , courseController.create);
router.post('/courses/create', convertFileToField.handle , courseValidator.handle() , courseController.store);
router.get('/courses/:id/edit' , courseController.edit);
router.put('/courses/:id' ,
    convertFileToField.handle ,
    courseValidator.handle() ,    
    courseController.update
);
router.delete('/courses/:id' , courseController.destroy);
//about As
router.get('/about_us' , aboutController.index);
router.get('/about_us/create' , aboutController.create);
router.post('/about_us/create' , convertFileToField.handle , aboutValidator.handle() , aboutController.store);
router.get('/about_us/:id/edit' , aboutController.edit);
router.put('/about_us/:id' ,
    convertFileToField.handle ,
    aboutValidator.handle() ,    
    aboutController.update
);
router.delete('/about_us/:id' , aboutController.destroy);
// Cosmetic Routes
router.get('/cosmetics' , cosmeticController.index);
router.get('/cosmetics/create' , cosmeticController.create);
router.post('/cosmetics/create' , cosmeticValidator.handle() , cosmeticController.store);
router.get('/cosmetics/:id/edit' , cosmeticController.edit);
router.put('/cosmetics/:id' ,
    cosmeticValidator.handle() ,    
    cosmeticController.update
);
router.delete('/cosmetics/:id' , cosmeticController.destroy);
router.post('/cosmetics/generate-fake-posts' , cosmeticController.fake);
// gullery image
router.get('/gullerys' , gulleryController.index);
router.get('/gullerys/create' , gulleryController.create);
router.post('/gullerys/create' , gulleryController.store);
router.post('/gullerys/:id' , gulleryController.gullery);
router.get('/gullerys/:image' , gulleryController.delete_gullery);
router.get('/gullerys/:id/edit' , gulleryController.edit);
router.put('/gullerys/:id' ,
    gulleryController.update
);
router.delete('/gullerys/:id' , gulleryController.destroy);
// gullery_skin image
router.get('/gullerys_skin' , gullery_skinController.index);
router.get('/gullerys_skin/create' , gullery_skinController.create);
router.post('/gullerys_skin/create' , gullery_skinController.store);
router.post('/gullerys_skin/:id' , gullery_skinController.gullery);
router.get('/gullerys_skin/:image' , gullery_skinController.delete_gullery);
router.get('/gullerys_skin/:id/edit' , gullery_skinController.edit);
router.put('/gullerys_skin/:id' ,
    gullery_skinController.update
);
router.delete('/gullerys_skin/:id' , gullery_skinController.destroy);
// gullery_hair image
router.get('/gullerys_hair' , gullery_hairController.index);
router.get('/gullerys_hair/create' , gullery_hairController.create);
router.post('/gullerys_hair/create' , gullery_hairController.store);
router.post('/gullerys_hair/:id' , gullery_hairController.gullery);
router.get('/gullerys_hair/:image' , gullery_hairController.delete_gullery);
router.get('/gullerys_hair/:id/edit' , gullery_hairController.edit);
router.put('/gullerys_hair/:id' ,
    gullery_hairController.update
);
router.delete('/gullerys_hair/:id' , gullery_hairController.destroy);
// gullery_h image
router.get('/gullerys_h' , gullery_hController.index);
router.get('/gullerys_h/create' , gullery_hController.create);
router.post('/gullerys_h/create' , gullery_hController.store);
router.post('/gullerys_h/:id' , gullery_hController.gullery);
router.get('/gullerys_h/:image' , gullery_hController.delete_gullery);
router.get('/gullerys_h/:id/edit' , gullery_hController.edit);
router.put('/gullerys_h/:id' ,
gullery_hController.update
);
router.delete('/gullerys_h/:id' , gullery_hController.destroy);
// gullery_is image
router.get('/gullerys_is' , gullery_isController.index);
router.get('/gullerys_is/create' , gullery_isController.create);
router.post('/gullerys_is/create' , gullery_isController.store);
router.post('/gullerys_is/:id' , gullery_isController.gullery);
router.get('/gullerys_is/:image' , gullery_isController.delete_gullery);
router.get('/gullerys_is/:id/edit' , gullery_isController.edit);
router.put('/gullerys_is/:id' ,
gullery_isController.update
);
router.delete('/gullerys_is/:id' , gullery_isController.destroy);
// gullery_limb image
router.get('/gullerys_limb' , gullery_limbController.index);
router.get('/gullerys_limb/create' , gullery_limbController.create);
router.post('/gullerys_limb/create' , gullery_limbController.store);
router.post('/gullerys_limb/:id' , gullery_limbController.gullery);
router.get('/gullerys_limb/:image' , gullery_limbController.delete_gullery);
router.get('/gullerys_limb/:id/edit' , gullery_limbController.edit);
router.put('/gullerys_limb/:id' ,
    gullery_hairController.update
);
router.delete('/gullerys_limb/:id' , gullery_limbController.destroy);
// gullery_rosy image
router.get('/gullerys_rosy' , gullery_rosyController.index);
router.get('/gullerys_rosy/create' , gullery_rosyController.create);
router.post('/gullerys_rosy/create' , gullery_rosyController.store);
router.post('/gullerys_rosy/:id' , gullery_rosyController.gullery);
router.get('/gullerys_rosy/:image' , gullery_rosyController.delete_gullery);
router.get('/gullerys_rosy/:id/edit' , gullery_rosyController.edit);
router.put('/gullerys_rosy/:id' ,
    gullery_rosyController.update
);
router.delete('/gullerys_rosy/:id' , gullery_rosyController.destroy);
// gullery_el image
router.get('/gullerys_el ' , gullery_elController.index);
router.get('/gullerys_el/create' , gullery_elController.create);
router.post('/gullerys_el/create' , gullery_elController.store);
router.post('/gullerys_el/:id' , gullery_elController.gullery);
router.get('/gullerys_el/:image' , gullery_elController.delete_gullery);
router.get('/gullerys_el/:id/edit' , gullery_elController.edit);
router.put('/gullerys_el/:id' ,
gullery_elController.update
);
router.delete('/gullerys_el/:id' , gullery_elController.destroy);
// Skin Routes
router.get('/skins' , skinController.index);
router.get('/skins/create' , skinController.create);
router.post('/skins/create' , skinValidator.handle() , skinController.store);
router.get('/skins/:id/edit' , skinController.edit);
router.put('/skins/:id' ,
    skinValidator.handle() ,    
    skinController.update
);
router.delete('/skins/:id' , skinController.destroy);
router.post('/skins/generate-fake-posts' , skinController.fake);
// hair Routes
router.get('/hairs' , hairController.index);
router.get('/hairs/create' , hairController.create);
router.post('/hairs/create' , hairValidator.handle() , hairController.store);
router.get('/hairs/:id/edit' , hairController.edit);
router.put('/hairs/:id' ,
    hairValidator.handle() ,    
    hairController.update
);
router.delete('/hairs/:id' , hairController.destroy);
router.post('/hairs/generate-fake-posts' , hairController.fake);
// rosys Routes
router.get('/rosys' , rosyController.index);
router.get('/rosys/create' , rosyController.create);
router.post('/rosys/create' , rosyValidator.handle() , rosyController.store);
router.get('/rosys/:id/edit' , rosyController.edit);
router.put('/rosys/:id' ,
    rosyValidator.handle() ,    
    rosyController.update
);
router.delete('/rosys/:id' , rosyController.destroy);
router.post('/rosys/generate-fake-posts' , rosyController.fake);
// electrics Routes
router.get('/electrics' , electricController.index);
router.get('/electrics/create' , electricController.create);
router.post('/electrics/create' , electricValidator.handle() , electricController.store);
router.get('/electrics/:id/edit' , electricController.edit);
router.put('/electrics/:id' ,
    electricValidator.handle() ,    
    electricController.update
);
router.delete('/electrics/:id' , electricController.destroy);
router.post('/electrics/generate-fake-posts' , electricController.fake);
// healths Routes
router.get('/healths' , healthController.index);
router.get('/healths/create' , healthController.create);
router.post('/healths/create' , healthValidator.handle() , healthController.store);
router.get('/healths/:id/edit' , healthController.edit);
router.put('/healths/:id' ,
    healthValidator.handle() ,    
    healthController.update
);
router.delete('/healths/:id' , healthController.destroy);
router.post('/healths/generate-fake-posts' , healthController.fake);
// limbs Routes
router.get('/limbs' , limbController.index);
router.get('/limbs/create' , limbController.create);
router.post('/limbs/create' , limbValidator.handle() , limbController.store);
router.get('/limbs/:id/edit' , limbController.edit);
router.put('/limbs/:id' ,
    limbValidator.handle() ,    
    limbController.update
);
router.delete('/limbs/:id' , limbController.destroy);
router.post('/limbs/generate-fake-posts' , limbController.fake);
// decoratives Routes
router.get('/decoratives' , decorativeController.index);
router.get('/decoratives/create' , decorativeController.create);
router.post('/decoratives/create' , decorativeValidator.handle() , decorativeController.store);
router.get('/decoratives/:id/edit' , decorativeController.edit);
router.put('/decoratives/:id' ,
    decorativeValidator.handle() ,    
    decorativeController.update
);
router.delete('/decoratives/:id' , decorativeController.destroy);
router.post('/decoratives/generate-fake-posts' , decorativeController.fake);
// Engine Routes
router.get('/engines' , engineController.index);
router.get('/engines/create' , engineController.create);
router.post('/engines/create' , convertFileToField.handle , engineValidator.handle() , engineController.store);
router.get('/engines/:id/edit' , engineController.edit);
router.put('/engines/:id' ,
    convertFileToField.handle ,
    engineValidator.handle() ,    
    engineController.update
);
router.delete('/engines/:id' , engineController.destroy);
//User
router.get('/users' , userController.index);
router.get('/users/create' , userController.create);
router.post('/users' , registerValidator.handle() , userController.store);
router.get('/users/:id/edit' , userController.edit);
router.put('/users/:id' ,loginValidator.handle() , userController.update);
router.delete('/users/:id' , userController.destroy);
router.get('/users/:id/toggleadmin' , userController.toggleadmin);
//userAddress
router.get('/userAddress' , userAddressController.index); 
// Comment Routes
router.get('/comments/approved' , commentController.approved);
router.get('/comments' , commentController.index);
router.put('/comments/:id/approved' , commentController.update );
router.delete('/comments/:id' , commentController.destroy);

// Category Routes
router.get('/categories' , categoryController.index);
router.get('/categories/create' , categoryController.create);
router.post('/categories/create' , categoryValidator.handle() , categoryController.store );
router.get('/categories/:id/edit' , categoryController.edit);
router.put('/categories/:id' , categoryValidator.handle() , categoryController.update );
router.delete('/categories/:id' , categoryController.destroy);
// Category_Skin Routes
router.get('/categories_Skin' , category_SkinController.index);
router.get('/categories_Skin/create' , category_SkinController.create);
router.post('/categories_Skin/create' , category_SkinValidator.handle() , category_SkinController.store );
router.get('/categories_Skin/:id/edit' , category_SkinController.edit);
router.put('/categories_Skin/:id' , category_SkinValidator.handle() , category_SkinController.update );
router.delete('/categories_Skin/:id' , category_SkinController.destroy);

// Category_hairRoutes
router.get('/categories_hair' , category_hairController.index);
router.get('/categories_hair/create' , category_hairController.create);
router.post('/categories_hair/create' , category_hairValidator.handle() , category_hairController.store );
router.get('/categories_hair/:id/edit' , category_SkinController.edit);
router.put('/categories_hair/:id' , category_hairValidator.handle() , category_hairController.update );
router.delete('/categories_hair/:id' , category_hairController.destroy);

// Category_limb
router.get('/categories_limb' , category_limbController.index);
router.get('/categories_limb/create' , category_limbController.create);
router.post('/categories_limb/create' , category_limbValidator.handle() , category_limbController.store );
router.get('/categories_limb/:id/edit' , category_limbController.edit);
router.put('/categories_limb/:id' , category_limbValidator.handle() , category_limbController.update );
router.delete('/categories_limb/:id' , category_limbController.destroy);

// Category_health
router.get('/categories_health' , category_healthController.index);
router.get('/categories_health/create' , category_healthController.create);
router.post('/categories_health/create' , category_healthValidator.handle() , category_healthController.store );
router.get('/categories_health/:id/edit' , category_healthController.edit);
router.put('/categories_health/:id' , category_healthValidator.handle() , category_healthController.update );
router.delete('/categories_health/:id' , category_healthController.destroy);
// Category_rosy
router.get('/categories_rosy' , category_rosyController.index);
router.get('/categories_rosy/create' , category_rosyController.create);
router.post('/categories_rosy/create' , category_rosyValidator.handle() , category_rosyController.store );
router.get('/categories_rosy/:id/edit' , category_rosyController.edit);
router.put('/categories_rosy/:id' , category_rosyValidator.handle() , category_rosyController.update );
router.delete('/categories_rosy/:id' , category_rosyController.destroy);

// Category_electric
router.get('/categories_electric' , category_electricController.index);
router.get('/categories_electric/create' , category_electricController.create);
router.post('/categories_electric/create' , category_electricValidator.handle() , category_electricController.store );
router.get('/categories_electric/:id/edit' , category_electricController.edit);
router.put('/categories_electric/:id' , category_electricValidator.handle() , category_electricController.update );
router.delete('/categories_electric/:id' , category_electricController.destroy);

// Category_electric
router.get('/categories_decorative' , category_decorativeController.index);
router.get('/categories_decorative/create' , category_decorativeController.create);
router.post('/categories_decorative/create' , category_decorativeValidator.handle() , category_decorativeController.store );
router.get('/categories_decorative/:id/edit' , category_decorativeController.edit);
router.put('/categories_decorative/:id' , category_decorativeValidator.handle() , category_decorativeController.update );
router.delete('/categories_decorative/:id' , category_decorativeController.destroy);


// Slider Routes
router.get('/sliders' , sliderController.index);
router.get('/sliders/create' , sliderController.create);
router.post('/sliders/create' , sliderValidator.handle() , sliderController.store);
router.get('/sliders/:id/edit' , sliderController.edit); 
router.put('/sliders/:id',
    sliderValidator.handle() ,    
    sliderController.update
); 
router.delete('/sliders/:id' , sliderController.destroy);
// Logo Routes
router.get('/logo' , logoController.index);
router.get('/logo/create' , logoController.create);
router.post('/logo/create' ,
    logoValidator.handle() ,
    logoController.store 
);
router.get('/logo/:id/edit' , logoController.edit);
router.put('/logo/:id',
    logoValidator.handle() ,
    logoController.update 
);
router.delete('/logo/:id' , logoController.destroy);
// Country
router.get('/countries' , countryController.index);
router.get('/countries/create' , countryController.create);
router.post('/countries/create' , countryValidator.handle() , countryController.store );
router.get('/countries/:id/edit' , countryController.edit);
router.put('/countries/:id' , countryValidator.handle() , countryController.update );
router.delete('/countries/:id' , countryController.destroy);
// Performance
router.get('/performances' , performanceController.index);
router.get('/performances/create' , performanceController.create);
router.post('/performances/create' , performanceValidator.handle() , performanceController.store );
router.get('/performances/:id/edit' , performanceController.edit);
router.put('/performances/:id' , performanceValidator.handle() , performanceController.update );
router.delete('/performances/:id' , performanceController.destroy);
// Gender
router.get('/genders' , genderController.index);
router.get('/genders/create' , genderController.create);
router.post('/genders/create' , genderValidator.handle() , genderController.store );
router.get('/genders/:id/edit' , genderController.edit);
router.put('/genders/:id' , genderValidator.handle() , genderController.update );
router.delete('/genders/:id' , genderController.destroy);
// availables
router.get('/availables', availableController.index);
router.delete('/availables/:id', availableController.destroy);
//shoppingList
router.get('/shoppings' , shoppingController.index); 
router.get('/shoppings/:id/title' , shoppingController.title); 
router.get('/shoppings/:id/address' , shoppingController.address);
//returns
router.get('/return_p' , returnController.index);
router.get('/return_p/create' , returnController.create);
router.post('/return_p/create' , convertFileToField.handle , returnValidator.handle() , returnController.store);
router.get('/return_p/:id/edit' , returnController.edit);
router.put('/return_p/:id' ,
    convertFileToField.handle ,
    returnValidator.handle() ,    
    returnController.update
);
router.delete('/return_p/:id' , returnController.destroy);
//Response Routes
router.get('/response' , responseController.index);
router.get('/response/create' , responseController.create);
router.post('/response/create', responseValidator.handle(), responseController.store);
router.get('/response/:id/edit', responseController.edit);
router.put('/response/:id',  
    responseValidator.handle(),    
    responseController.update
);
router.delete('/response/:id' ,responseController.destroy);
//guide
router.get('/guides' , guideController.index);
router.get('/guides/create' , guideController.create);
router.post('/guides/create' , convertFileToField.handle , guideValidator.handle() , guideController.store);
router.get('/guides/:id/edit' , guideController.edit);
router.put('/guides/:id' ,
    convertFileToField.handle ,
    guideValidator.handle() ,    
    guideController.update
);
router.delete('/guides/:id' , guideController.destroy);

//router.post('/upload-image' , upload.single('upload') , adminController.uploadImage);

module.exports = router;