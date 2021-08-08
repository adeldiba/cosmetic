const controller = require('app/http/controllers/controller');
const Cosmetic = require('app/models/cosmetic');
const Gullery = require('app/models/gullery');
const fs = require('fs-extra');
const path = require('path');
const fileUpload = require('express-fileupload');
const mkdirp = require('mkdirp');
const resizeImg = require('resize-img');


class gulleryController extends controller {
    async index(req , res) {
        try {
            
            let page = req.query.page || 1;
            let gullerys = await Gullery.paginate({} , { page , sort : { createdAt : 1 } , limit : 20, populate: 'cosmetic' });
            //return res.json(gullerys)
            res.render('admin/gullerys/index',  { title : 'گالری تصاویر' , gullerys });
        } catch (err) {
            next(err);
        }
    }
    
    async create(req , res) {
        let cosmetics = await Cosmetic.find({});
        res.render('admin/gullerys/create' , { cosmetics });        
    }

 async store(req , res , next) {
    try {
        let status = await this.validationData(req);
        if(! status) return this.back(req,res);

        var imageFile = typeof req.files.image !== "undefined" ? req.files.image.name: "";
    
        let newGullery = new Gullery({ ...req.body,image: imageFile });
        await newGullery.save(function(err){
            if (err) return console.log(err);

            mkdirp('public/product_images/'+newGullery._id, (err)=>{
               return console.log(err);
            });

            mkdirp('public/product_images/'+newGullery._id + '/gallery', (err)=>{
               return console.log(err);
            });

            mkdirp('public/product_images/'+newGullery._id + '/gallery/thumbs', (err)=>{
               return console.log(err);
            });

            if (imageFile != ""){
               var productImage = req.files.image;
               var path = 'public/product_images/' + newGullery._id + '/' + imageFile;

               productImage.mv(path, (err)=>{
                  return console.log(err);  
               });
            }

            req.flash('success', 'Product added');
            res.redirect('/admin/gullerys');
         });
    } catch(err) {
        next(err);
    }
    }

    async edit(req, res ,next) {
        try {
            this.isMongoId(req.params.id);
            
            let cosmetics = await Cosmetic.find();
            let gullery = await Gullery.findById(req.params.id);
            Gullery.findById(req.params.id, (err, p)=>{
                if(err) {
                   console.log(err);
                   res.redirect('/admin/gullerys');
                }else{
                   var galleryDir = 'public/product_images/' + p._id + '/gallery';
                   var galleryImages = null;
       
                   fs.readdir(galleryDir, (err, files)=>{
                      if (err) {
                         console.log(err);
                      }else{
                         galleryImages = files;
       
                        return res.render('admin/gullerys/edit', {
                            image: p.image,
                            galleryImages: galleryImages,
                            id: p.id,
                            cosmetics,
                            gullery
                          });
                      }
                   });
                }
             });

        } catch (err) {
            next(err);
        }
    }

async update(req, res , next) {
        try {
            let status = await this.validationData(req);
            if(! status) return this.back(req,res);

            var imageFile = typeof req.files.image !== "undefined" ? req.files.image.name: "";
            var pimage = req.body.pimage;
            var id = req.params.id;
            Gullery.findById(id, function(err, p){
               if (err)
                  console.log(err);

               if (imageFile != "") {
                  p.image = imageFile;
               }
               p.save(function(err){
                  if(err)
                  console.log(err);
                  if (imageFile != ""){
                     if (pimage != ""){
                        fs.remove('public/product_images/' + id + '/' + pimage, function(err){
                           if (err)
                           console.log(err);
                        });
                     }
                     var productImage = req.files.image;
                     var path = 'public/product_images/' + id + '/' + imageFile;

                     productImage.mv(path, (err)=>{
                        return console.log(err);
                     });
                  }
                  res.redirect('/admin/gullerys');
              
               });
            });
        } catch(err) {
            next(err);
        }
}
async gullery(req,res,next){
    try {
        let productImage = req.files.file;
        let id = req.params.id;
        let path = 'public/product_images/' + id + '/gallery/' + req.files.file.name;
        let thumbsPath = 'public/product_images/' + id + '/gallery/thumbs/' + req.files.file.name;

        productImage.mv(path, (err)=>{
            if (err)
            console.log(err);

            resizeImg(fs.readFileSync(path), {width: 100, height: 100}).then((buf)=>{
                fs.writeFileSync(thumbsPath, buf); 
            });
        });

        res.sendStatus(200);
    } catch(err) {
        next(err);
    }
}
async delete_gullery(req , res , next) {
    var orginalImage = 'public/product_images/' + req.query.id + '/gallery/' + req.params.image;
   var thumbImage = 'public/product_images/' + req.query.id + '/gallery/thumbs/' + req.params.image;

   fs.remove(orginalImage, (err)=>{
      if (err) {
         console.log(err);
      } else{
         fs.remove(thumbImage, function(err){ 
            if (err) {
               console.log(err);
            }else {
               res.redirect('/admin/gullerys');
            }
         });
      }
   });
}
    async destroy(req , res , next) {
        try {
            this.isMongoId(req.params.id);

            var id = req.params.id;
            var path = 'public/product_images/' + id;

            fs.remove(path, (err)=>{
                if (err) {
                    console.log(err);
                } else{
                    Gullery.findByIdAndRemove(id, (err)=>{
                        console.log(err);
                    });

                    res.redirect('/admin/gullerys'); 
                }
            });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new gulleryController();