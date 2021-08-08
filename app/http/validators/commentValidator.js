const validator = require('./validator');
const { check } = require('express-validator/check');
const path = require('path');

class commentValidator extends validator {
    
    handle() {
        return [
            check('comment')
                .isLength({ min : 6 })
                .withMessage('متن نظر نمیتواند کمتر از 6 کاراکتر باشد'),
        ]
    }

    

}

module.exports = new commentValidator();