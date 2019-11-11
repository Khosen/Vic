//'use strict';

const express = require('express');
const router = express.Router();
const multer =require('multer');
const path = require('path');
const mongoose = require('mongoose');

//bring in model
const postdb = require('../models/programmes');
const tvProgram = require("../models/tvPrograms");
const commentsDB= require("../models/comments");

//get the data to display in comments section
router.get('/blogpost/:id', (req, res)=>{

  postdb.aggregate([
    {$match: {'_id': {$in:[mongoose.Types.ObjectId(req.params.id) ]}}},
    {$unwind:"$subcategory"},
    {$group:{_id:{category:"$category", subcategory:"$subcategory.name",  postId:"$_id",
    topic:"$subcategory.topic", photo:"$subcategory.photo", author:"$subcategory.author",
  news:"$subcategory.news", date:{$substr:["$subcategory.date", 0,10]}, time:{$substr:["$subcategory.date", 11,9]},
  duration:"$subcategory.duration",
    postlink:"$subcategory.postlink", counter:"$subcategory.count"}}},
  
    {$project:{_id:0, category:"$_id.category", subcategory:"$_id.subcategory", 
    topic:"$_id.topic", author:"$_id.author", news:"$_id.news", postId:"$_id.postId",
  duration:"$_id.duration", photo: { $arrayElemAt: [ "$_id.photo", 0 ] },
  postlink:"$_id.postlink", date:"$_id.date", time:"$_id.time", counter:"$_id.counter"}} ,
  {$sort:{"_id.date":1}}   ],
   function(err, docs){
        
    if(err){
      console.log(err);
  }else{

    commentsDB.aggregate([  {$match: {'postId': {$in:[mongoose.Types.ObjectId(req.params.id) ]}}},
      {$unwind:"$comments"},

     // {$match: {"comments.body"}}

      {$group:{_id:{postId:"$postId", comment:"$comments.body", name:"$comments.name",
      time:{$substr:["$comments.date", 11,9]}, date:{$substr:["$comments.date", 0,10]}, count:"$counter"} 
      }},



    {$project:{_id:0, postId:"$_id.postId", comment:"$_id.comment", name:"$_id.name", date:"$_id.date",
      time:"$_id.time", count:"$_id.count"}},


    {$sort:{"_id.date":1}}], function(err, comments){
      if(err){
          console.log(err);
       }else{
        postdb.aggregate([
          {$unwind:"$subcategory"},
          {$group:{_id:{category:"$category", subcategory:"$subcategory.name",  postId:"$_id",
          topic:"$subcategory.topic", photo:"$subcategory.photo", author:"$subcategory.author",
        news:"$subcategory.news", date:{$substr:["$subcategory.date", 0,10]}, time:{$substr:["$subcategory.date", 11,9]},duration:"$subcategory.duration",
          postlink:"$subcategory.postlink", counter:"$subcategory.count"}}},
        
          {$project:{_id:0, category:"$_id.category", subcategory:"$_id.subcategory", 
          topic:"$_id.topic", author:"$_id.author", news:"$_id.news", postId:"$_id.postId",
        duration:"$_id.duration", photo: { $arrayElemAt: [ "$_id.photo", 0 ] },
        postlink:"$_id.postlink", date:"$_id.date", time:"$_id.time", counter:"$_id.counter"}} ,
        {$sort:{"_id.date":1}}], //,{$limit:4}

         function(err, counterDetails){
          if (err){
             console.log(err);
         }
        else{

            res.render('blogpost', { docs:docs, comments: comments, count: comments.length, details:counterDetails, postId: req.params.id });
              console.log(comments +"docs" +"counterdetails");
          }
        });
      }
    });
   
  }
});
     
  });
 

 
module.exports = router;
