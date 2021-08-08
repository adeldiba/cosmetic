const validator = require('./validator');
const { check } = require('express-validator/check');
const Rosy = require('app/models/rosy');
const path = require('path');

class rosyValidator extends validator {
    
    handle() {
        return [
            check('title')
                .isLength({min : 4})
                .withMessage('فیلد عنوان نباید کمتر از چهار کاراکتر باشد')
                .custom(async (value, { req }) =>{
                    if(req.query._method === 'put') {
                        let rosy = await Rosy.findById(req.params.id);
                        if(rosy.title === value) return;
                    }
                    let rosy = await Rosy.findOne({slug : this.slug(value)})
                    if(rosy){
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

module.exports = new rosyValidator();