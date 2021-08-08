const validator = require('./validator');
const { check } = require('express-validator/check');
const path = require('path');
const Slider = require('app/models/slider');

class sliderValidator extends validator {
    
    handle() {
        return [
            check('title')
                .not().isEmpty()
                .withMessage('تایتل اسلایدر نمیتواند کمتر از 5 کاراکتر باشد '),
                check('body')
                .not().isEmpty()
                .withMessage('متن اسلایدر نمیتواند کمتر از 10 کاراکتر باشد ')
        ]
    }

}

module.exports = new sliderValidator();