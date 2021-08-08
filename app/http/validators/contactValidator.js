const validator = require('./validator');
const { check } = require('express-validator/check');

class contactValidator extends validator {
    
    handle() {
        return [
            check('name_family')
                .isLength({ min : 5 })
                .withMessage('فیلد نام و نام خانوادگی نمیتواند کمتر از 5 کاراکتر باشد'),

            check('email')
                .isEmail()
                .withMessage('خواهشمندیم یک آدرس ایمیل معتبر وارد کنید.'),

            check('topic')
            .not().isEmpty()
                .withMessage('فیلد موضوع پیام نباید خالی بماند.'),
            
            check('phone')
                .isLength({ min : 11 })
                .withMessage('شماره تلفن همراه وارد شده نا معتبر است.'),

            check('body')
                .isLength({ min : 8 })
                .withMessage('لطفا متن پیام خود را وارد کنید.'),
        ]
    }
}

module.exports = new contactValidator();