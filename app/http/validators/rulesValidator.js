const validator = require('./validator');
const { check } = require('express-validator/check');
const Rules = require('app/models/rules');
const path = require('path');

class rulesValidator extends validator {
    
    handle() {
        return [
            check('title')
                .isLength({min : 4})
                .withMessage('فیلد عنوان نباید کمتر از چهار کاراکتر باشد')
                .custom(async (value, { req }) =>{
                    if(req.query._method === 'put') {
                        let rules = await Rules.findById(req.params.id);
                        if(rules.title === value) return;
                    }
                }),

            check('body')
                .isLength({min : 10})
                .withMessage('متن محتوا نمیتواند کمتر از 10 کاراکتر باشد')
        ]
    }

    slug(title){
        return title.replace(/([^آ-یa-z0-9]|-)+/g , "-")
    }
}

module.exports = new rulesValidator();