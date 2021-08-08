const controller = require('app/http/controllers/controller');
const Contact = require('app/models/contact');

class contactController extends controller {
    async index(req , res) {
        try {
            let page = req.query.page || 1;
            let contacts = await Contact.paginate({} , { page , sort : { createdAt : 1 } , limit : 20 });

            res.render('admin/contact/index',  { title : 'تماس با مدیر' , contacts });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new contactController();