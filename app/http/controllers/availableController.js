const controller = require('./controller');
const Available = require('app/models/available');


class availableController extends controller{
   async store(req,res, next){
        try {
            Available.findOne({$and: [{bywhom:req.user.name},{cosmetic:req.params.cosmetic}] },(err, info)=>{
                if(info)// already user available the post
                {
                    if(info.totalcount >0 )
                    {
                        Available.findByIdAndUpdate(info._id,{
                                        $inc: {
                                            totalcount: -1
                                        }
                                    },{new: true },(err, newinfo)=>{
                                        //res.send(newinfo);
                                        this.back(req, res);
                                    });
                    }
                    else{
                        Available.findByIdAndUpdate(info._id,{
                                        $inc: {
                                            totalcount: +1
                                        }
                                    },{new: true },(err, info1)=>{
                                        //res.send(info);
                                        this.back(req, res);
                                    });
                    }
                }
                else // first time liking the post
                {
                    var newavailable = {
                        user : req.user.id,
                        cosmetic: req.params.cosmetic,
                       
                        bywhom : req.user.name,
                    };
                    Available.create(newavailable,(err, availableinfo)=>{
                        if(err)
                            {console.log(err);}
                        else{
                            Available.findByIdAndUpdate(availableinfo._id,{
                                        $inc: {
                                            totalcount: +1
                                        }
                                    },{new: true },(err, info)=>{
                                        //res.send(info);
                                        this.alert(req , {
                                            message : 'در صورت موجود بودن در انبار به شما خبر میدهیم',
                                            icon : 'success',
                                        })
                                        this.back(req, res);
                                    });
                        }
                    });
                    //res.send(info.bywhom);
                }
            });
        } catch (err) {
            next(err);
        }
    }

}

module.exports = new availableController();