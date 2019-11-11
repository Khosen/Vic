//'use strict';

const express = require('express');
const router = express.Router();
const multer =require('multer');
const path = require('path');
const mongoose = require('mongoose');
//const socket = require('../socketio');
//bring in model


const postdb = require("../models/programmes");
const tvProgram = require("../models/tvPrograms");
const test = require("../models/test");
const comments = require("../models/comments");


//var lCount=0;
  

//set storage engine//
var storage = multer.diskStorage({
  destination: './public/uploads',
  filename: function(req, file, cb){
    cb(null,file.fieldname+ '-'+ Date.now() + path.extname(file.originalname));
  
  }
 }); 

//init upload
var upload  = multer({
  storage:storage,
 limits: {fileSize:2000000},
  
 // transformation: [{ width: 500, height: 500, crop: "limit" }]
 //var upload = multer({ storage : storage }).array('userPhoto',2);

    fileFilter: function(req, file, cb){
    checkFileType(file, cb);
  }
}).array('image',3);


//check file type
function checkFileType(file, cb){
  //allowed ext
  const filetypes =/png|jpg|jpeg/;
//check extension
const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//check mime
const mimetype= filetypes.test(file.mimetype);

if(mimetype && extname){
  return cb(null, true);

}else{
  cb('Error: only jpeg, jpg, and png allowed');
}
}

//group unwind and arrange the data for use on the index page
router.get('/', function(req, res){
 
  postdb.aggregate([
    {$unwind:"$subcategory"},
    {$group:{_id:{category:"$category", subcategory:"$subcategory.name",  postId:"$_id",
    topic:"$subcategory.topic", photo:"$subcategory.photo", author:"$subcategory.author",
  news:"$subcategory.news", date:{$substr:["$subcategory.date", 0,10]}, time:{$substr:["$subcategory.date", 11,9]},duration:"$subcategory.duration",
    postlink:"$subcategory.postlink", counter:"$subcategory.count"}}},
   //photo:"$_id.photo",
    {$project:{_id:0, category:"$_id.category", subcategory:"$_id.subcategory", 
    topic:"$_id.topic", author:"$_id.author", news:"$_id.news",postId:"$_id.postId",
  duration:"$_id.duration", photo: { $arrayElemAt: [ "$_id.photo", 0 ] },
  postlink:"$_id.postlink", date:"$_id.date", time:"$_id.time", counter:"$_id.counter"}} ,
  {$sort:{"_id.date":1}}], //,{$limit:4}],
  //  postdb.aggregate([{$unwind:"$subcategory"}, {$unwind:"$subcategory.photo"}], 
     function(err, docs){
     
  if(err){
// console.log(err);
}else{
// console.log(docs);
//res.render('index');

comments.aggregate([///{$match:{'postId': postid}}, 
          {$project:{_id:0, counter:'$commentCount', postId:'$postId'}}], 
        
        function(err, result){
            if(err){
              console.log(err);
            }else{
       // when a user is connected sends comment count
       /*console.log("another user " +result);
         socket.emit('commentCount', result);
        console.log("another user connected");

        //when a user clicks a button
            socket.on('commented', function(){
                 result+= 1;
             console.log("another user2 connected");

   socket.emit('commentCount', result);
   console.log("count");
 });*/
 
 res.render('index',{docs: docs, comment:result});


            }

        });
        

        //res.render('index',{docs: docs});

}
});
  //   console.log("server side running");
   //   res.render('index'); 
  });
 
  
 
  // add a document to the DB collection recording the click event
/*router.post('/clicked', (req, res) => {

 let newTest= new test({
    likeCount: 1,
    date: new Date()

    });

  test.addLikes(newTest, (err, test)=>{
    if(err){
      res.json({success:false, msg: 'failed to create product, duplicate product'});
      console.log(err + "here"+ req.body.response+ "the count"+  lCount +"error here");
  } else{
     res.json({success:true, msg: 'like added'});
    //  res.send({test: test.likeCount});
     console.log(test.likeCount);
  }
  });

  });*/

  /*router.get('/clicks', (req, res)=>{
    test.find({}, (err, test)=>{
      if(err) return console.log(err);//{
        
        res.send(test);
          console.log(test.length +"here");
     // }
    });
  });*/

   router.get('/createProg', (req, res)=>{
 
     res.render('createProg'); 
     });

     //add new programs docs to db
   router.post('/createProg', (req, res)=>{

   req.checkBody('inputSub', 'Topic is required').notEmpty();
   req.checkBody('inputCategory', 'Author is required').notEmpty();
     
                  
    let errors = req.validationErrors();    
    //ensure required fields are filled
      if(errors){
         req.flash('danger', 'please ensure fields are properly filled!!');
        console.log(errors +'here' +req.validationErrors())
        return;
      }
    
    const docs={
      name: req.body.inputSub
      , date: new Date(Date.now())
     
   }
    let newProg = new tvProgram({

      category: req.body.inputCategory,
      date: new Date(Date.now()),
      subCategory:docs
      });
     
      
       
//save newly created progs to db
      tvProgram.createProg(newProg, (err, newProg)=>{
          if(err) throw err//{
            req.flash('success', 'Data saved');
        
            res.redirect('createProg');
        });
 
    });


   router.get('/updateProg', (req, res)=>{
    tvProgram.find({}, function(err, docs,next){
      if(err){
        req.flash('danger', 'Data could not be retrieved!');
        
         //console.log(err +"heree");
         }else{
            res.render('updateProg',{category: docs});
    }
  }).sort({category:1});
   });
 
    //  router.post()
   //update the list of programs already in subcategory after selecting which category to add
    router.post('/updateProg', (req, res)=>{
      tvProgram.find({}, function(err, docs,next){
        if(err){
          req.flash('danger', 'Data could not be retrieved!');
      
           console.log(err +"heree");
           }else{
           res.render('updateProg',{category: docs});
             }
    }).sort({category:1});
     // res.render('updateProg')
    });


       router.post('/updateSub', (req, res)=>{
              const getCategory = req.body.categoryOption;
              const getsubCategory= {name: req.body.inputSub
                                     , date: new Date(Date.now())}

              console.log(getCategory +'the category' + 
              req.body.categoryOption + req.body.inputSub +getsubCategory) ;
              tvProgram.updateProg(getCategory, getsubCategory, (err, results)=>{
                if(err) throw err;
                res.redirect('updateProg');
              })
            
        });
        //find(exists("item", false));
      // db.inventory.find( { qty: { $ne: 20 } } )
    //load ejs view with data from db esuring no empty values are loaded
        router.get('/posts', (req, res)=>{
          tvProgram.find({category:{$ne:null}}, function(err,docs, next){
            if(err){
              console.log(err +"the error");
            }else{
             //res.json('posts', {category:docs});
            // res.send(docs);
              res.render('posts', {category:docs});
            }
          }).sort({category:1});
         
        });

        router.get('/getSubs', (req, res)=>{
        
           tvProgram.aggregate([{$unwind:"$subCategory"}, {$project:{_id:0, category:1, name:"$subCategory.name"}},
    ],
          function(err, docs){
            if(err){
              console.log(err);
            }
            else{
              res.send(docs);
              //console.log(docs);
            }
          })
         
        });

       
        router.post('/posts', (req, res)=>{
          upload(req, res, (err) =>{
            if(err){
              console.log(err);
        
           req.flash('danger', err.toString());
          res.redirect('posts');
            }
            else{
             //ensure images r not empty
              if(req.files ===undefined || req.files.length==0){

               req.flash('danger', "No image file selcted!!!");
                res.redirect('posts');
              }
              else{

                var filenames = req.files.map(function(file) {
                                    
                  return `uploads/`+file.filename; // or file.originalname
                  });
              
                console.log(filenames);
              
              //  console.log(filenames);
                const postdocs={
                  name:req.body.sCategoryOption,
                  topic:req.body.inputTopic,
                  date:new Date(),
                  postLink:req.body.inputLink,
                  author:req.body.inputAuthor,
                  duration:req.body.inputDuration,
                  news:req.body.news,
                  
                  //photo:`uploads/${req.file.filename}`
                  photo:filenames,
                  count:1
              
               }
                  let post = new postdb({
                  _id:new mongoose.Types.ObjectId().toString(),
                    category: req.body.catOption,
                    date: new Date(),
                    subcategory:postdocs,
                    commentCounts:0,
//postId:_id
                    
                  });
                  let getQuery=req.body.catOption;
                  let getSub=req.body.sCategoryOption;
                  let topic =req.body.inputTopic;
                  postdb.find({category:req.body.catOption, 'subcategory.name':req.body.sCategoryOption}, (err, results)=>{
                      if(err) throw err;
                      if(results){
                        let addComment= new comments({
                          //_id:new mongoose.Types.ObjectId(),
                          topic: topic, 
                           postId:post._id,
                           category:getSub,
                          commentCounts:0,
                          clickCounts:0,
                          viewCounts:0
                         });
                       
                        postdb.createPost(post,getQuery, getSub,topic, addComment, (err, newPost)=>{
                          if(err) throw err//{
                            //req.flash('success', 'Data saved');
                   //     console.log(getSub + getQuery)
                          //  res.redirect('posts');
                         
                          });
                         // console.log(results);
                      }
                    })
                    req.flash('success', 'Data saved');
                      
              
                    res.redirect('posts');
                  
            }
         //
             // console.log(req.files);
            }

       // }
       

      });
        
         });
       
        router.post('/exit', (req, res)=>{
          res.redirect('/');
        });
      
        router.get('/theValues', (req, res)=>{
          res.render('posts');
        });

        router.get('/test', (req, res)=>{
          res.render('test');
        });
        router.get('/counts', (req, res)=>{
          res.render('counts');
        });

        
        router.get('/site', (req, res)=>{
          res.render('site');
        });
        

        router.get('/likeCount', (req, res)=>{
          test.find({}, (err, test)=>{
            if(err) return console.log(err);//{
              
              res.send(test);
           //  res.redirect('counts', {test:test});
                console.log(test.length +"here");
           // }
          });
         
        });

        router.post('/clicked', (req, res) => {

          let newTest= new test({
             likeCount: 1,
             date: new Date()
         
             });
         
           test.addLikes(newTest, (err, test)=>{
             if(err){
               res.json({success:false, msg: 'failed to create product, duplicate product'});
               console.log(err + "here"+ req.body.response+ "the count"+  lCount +"error here");
           } else{
              res.json({success:true, msg: 'like added'});
             //  res.send({test: test.likeCount});
              console.log(test.likeCount);
           }
           });
         
           });

/*router.post('/test', (req, res)=>{
            /*var newImage = new images();
            newImage.img.data = fs.readFileSync(req.files.image.path)
            newImage.img.contentType = 'image/png', 'image/jpeg', 'image/jpg';
            newImage.save();*/
          
         // res.send('test');
    /*  upload(req, res, (err) =>{
            if(err){
              res.render('test',{
                msg:err
              });
            }else{
              if(req.file == undefined){
                res.render('test',{
                  msg: 'Error: No file selected'
                });
              }else{
                res.render('test', {
                  msg: 'File uploaded',
                  file: `uploads/${req.file.filename}`
                });
              
              }
            }
        });
      //  console.log(file);
      
        });*/
     
      
       
    
module.exports = router;
