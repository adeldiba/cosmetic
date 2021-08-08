const validator = require('./validator');
const { check } = require('express-validator/check');
const Performance = require('app/models/performance');

class performanceValidator extends validator {
    
    handle() {
        return [
            check('name')
                .isLength({ min : 3 })
                .withMessage('عنوان نمیتواند کمتر از 3 کاراکتر باشد')
                .custom(async (value , { req }) => {
                    if(req.query._method === 'put') {
                        let performance = await Performance.findById(req.params.id);
                        if(performance.slug === value) return;
                    }
                    
                    let performance = await Performance.findOne({ slug : this.slug(value) });
                    if(performance) {
                        throw new Error('چنین کشوری با این عنوان قبلا در سایت قرار داد شده است')
                    }
                }),
            
        ]
    }
    slug(title){
        return title.replace(/([^آ-یa-z0-9]|-)+/g , "-")
    }
}

module.exports = new performanceValidator();