const controller = require('app/http/controllers/controller');
const Engine = require('app/models/engine');
const User = require('app/models/user');
const Like = require('app/models/like');
const Payment = require('app/models/payment');

class indexController extends controller{
   async index(req,res, next){ 
        const promises = [Engine.count().exec(),Payment.count().exec(),User.count().exec(),Like.count().exec() ];
        Promise.all(promises).then(([enginCount,paymentCount,userCount,likeCount])=>
        {res.render("admin/index", {enginCount,userCount,paymentCount,likeCount});})      
    }

    uploadImage(req, res) {
        let image = req.file;
        res.json({
            "uploaded" : 1,
            "fileName" : image.originalname,
            "url" : `${image.destination}/${image.filename}`.substring(8)
        });
    }
}

module.exports = new indexController();