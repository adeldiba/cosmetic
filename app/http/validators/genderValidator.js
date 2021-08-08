const validator = require('./validator');
const { check } = require('express-validator/check');
const Gender = require('app/models/gender');

class genderValidator extends validator {
    
    handle() {
        return [
            check('name')
                .isLength({ min : 3 })
                .withMessage('عنوان نمیتواند کمتر از 3 کاراکتر باشد')
                .custom(async (value , { req }) => {
                    if(req.query._method === 'put') {
                        let gender = await Gender.findById(req.params.id);
                        if(gender.slug === value) return;
                    }
                    
                    let gender = await Gender.findOne({ slug : this.slug(value) });
                    if(gender) {
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

module.exports = new genderValidator();