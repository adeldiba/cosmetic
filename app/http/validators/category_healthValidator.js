const validator = require('./validator');
const { check } = require('express-validator/check');
const Category_health = require('app/models/category_health');

class category_healthValidator extends validator {
    
    handle() {
        return [
            check('name')
                .isLength({ min : 3 })
                .withMessage('عنوان نمیتواند کمتر از 3 کاراکتر باشد')
                .custom(async (value , { req }) => {
                    if(req.query._method === 'put') {
                        let category_health = await Category_health.findById(req.params.id);
                        if(category_health.slug === value) return;
                    }
                    
                    let category_health = await Category_health.findOne({ slug : this.slug(value) });
                    if(category_health) {
                        throw new Error('چنین دسته ای با این عنوان قبلا در سایت قرار داد شده است')
                    }
                }),

            check('parent')
                .not().isEmpty()
                .withMessage('فیلد پدر دسته نمیتواند خالی بماند')
        ]
    }
    slug(title){
        return title.replace(/([^آ-یa-z0-9]|-)+/g , "-")
    }
}

module.exports = new category_healthValidator();