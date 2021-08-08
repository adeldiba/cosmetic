const validator = require('./validator');
const { check } = require('express-validator/check');
const Category_hair = require('app/models/category_hair');

class category_hairValidator extends validator {
    
    handle() {
        return [
            check('name')
                .isLength({ min : 3 })
                .withMessage('عنوان نمیتواند کمتر از 3 کاراکتر باشد')
                .custom(async (value , { req }) => {
                    if(req.query._method === 'put') {
                        let category_hair = await Category_hair.findById(req.params.id);
                        if(category_hair.slug === value) return;
                    }
                    
                    let category_hair = await Category_hair.findOne({ slug : this.slug(value) });
                    if(category_hair) {
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

module.exports = new category_hairValidator();