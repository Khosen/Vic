

const mongoose = require('mongoose');
const prog = require('./programmes');
const Schema = mongoose.Schema;

var ObjectId = require('mongoose').Types.ObjectId;
//mongoose.Types.ObjectId("postid");



const commentSchema = mongoose.Schema({

   
   topic:String,
    comments:[{body:{
        type:String
    }, name:{
        type:String
    },
    date:{type:Date}
}],
postId:{ type: Schema.Types.ObjectId, ref: 'Prog' },
commentCounts:Number,
category: String,
clickCounts:Number,
viewCounts:Number

//}

});


const commentsDB = module.exports= mongoose.model('commentSchema', commentSchema);


module.exports.createComment = function(commentsdb, postid, callback){
    //var a= "5dc959243f03053ac0cff016";
    commentsDB.updateOne({postId:postid}, {$push:{comments:commentsdb}, $inc:{commentCounts:1}}, callback);

  //  commentsDB.updateOne({postId:postid}, {$push:{comments:commentsdb}, $inc:{commentCounts:1}}, callback);

   /* prog.createComment(postid, (err, prog)=>{

        if(err) throw err;
    });*/
   // prog.update({"_id":ObjectId(postid)}, { $inc:{commentCounts: 1 } });
  //  prog.findAndModify({_id:postid},{$inc:{commentCounts:1}});
   // commentsDB.updateOne({postId:postid}, {$push:{comments:commentdb}}, callback)
   // commentdb.save(callback);
 console.log(commentsdb + postid+"ok");
   // req.flash('success', 'comment added');
        
          
}
/*
module.exports.addCount = function(getSub, callback){

    commentsDB.updateMany({category:getSub}, {$inc:{count:1}}, callback);
}*/