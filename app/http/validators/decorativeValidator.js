const validator = require('./validator');
const { check } = require('express-validator/check');
const Decorative = require('app/models/decorative');
const path = require('path');

class decorativeValidator extends validator {
    
    handle() {
        return [
            check('title')
                .isLength({min : 4})
                .withMessage('فیلد عنوان نباید کمتر از چهار کاراکتر باشد')
                .custom(async (value, { req }) =>{
                    if(req.query._method === 'put') {
                        let decorative = await Decorative.findById(req.params.id);
                        if(decorative.title === value) return;
                    }
                    let decorative = await Decorative.findOne({slug : this.slug(value)})
                    if(decorative){
                        throw new Error('چنین محصولی با این عنوان قبلا در سایت قرار داده شده است')
                    }
                }),
                
            
            
            check('model')
                .not().isEmpty()
                .withMessage('فیلد مدل محصول نمیتواند خالی بماند'),

            check('body')
                .isLength({min : 10})
                .withMessage('متن محصول نمیتواند کمتر از 10 کاراکتر باشد'),

            check('body2')
                .isLength({min : 10})
                .withMessage('متن محصول نمیتواند کمتر از 10 کاراکتر باشد'), 
            check('price')
                .not().isEmpty()
                .withMessage('قیمت محصول نمیتواند خالی باشد')

        ]
    }

    slug(title){
        return title.replace(/([^آ-یa-z0-9]|-)+/g , "-")
    }
}

module.exports = new decorativeValidator();