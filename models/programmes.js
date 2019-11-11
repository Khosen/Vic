

const mongoose = require('mongoose');
 const comments = require("./comments");
const Schema = mongoose.Schema;
var ObjectId = require('mongoose').Types.ObjectId;


const progSchema = mongoose.Schema({
  _id: Schema.Types.ObjectId,
category: 
{
    type: String,
    required: true,
     trim:true
    },
date:{
    type: Date,
    required:true
},
subcategory:[{
    name:{
        type:String,
         trim: true,
         index:{
          unique:true,
          partialFilterExpression: {name:{$type: "string"}}
      }
      },
      topic:{
        type:String,
        required:true,
        trim: true
      },
      date:{
          type:Date,
          required:true
      },
      postlink:{
         type:String,
          trim:true
          },
    author:{
         type:String,
         required:true,
         trim: true
         },
    duration :{
        type:String,
         trim: true
    },
    news:{
        type:String,
          trim: true
      },
      photo:[{
        type: String,
       required:true,
       trim:true
    }],
    count:{type:Number}
   }],
  //postId:Number,
   commentCounts:Number,
clickCounts:Number,
viewCounts:Number

  
});

const Prog = module.exports= mongoose.model('Prog', progSchema);


module.exports.createPost = function(post, getQuery, getSub, topic, addComment, callback){
  Prog.updateMany({category:getQuery, 'subcategory.name':getSub},{ $inc:{'subcategory.$.count':1}}, callback)
   
  post.save(callback);
  console.log(post +'this post');


  //  comments.updateMany({subcategory:getSub}, {$inc:{count:1});
 /* let addComment= new commentdb({
    //_id:new mongoose.Types.ObjectId(),
    topic: topic, 
     postId:post._id,
     category:getQuery,
    commentCounts:0,
    clickCounts:0,
    viewCounts:0
   });
   addComment.save(function (err) {
     if (err) throw err//return handleError(err);
     // thats it!
   });*/
   addComment.save();
  
}

module.exports.addCount= function(postid, callback){

 // var idPost ;
      Prog.update({"_id":postid},{$inc:{commentCounts:1}});

      console.log(postid + "indside programmes.js");
}
