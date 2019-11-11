const mongoose = require('mongoose');
const Schema = mongoose.Schema;

likeSchema = mongoose.Schema ({

   
   count:Number
  
});


const likeDB = module.exports= mongoose.model('commentSchema', likeSchema);


module.exports.createComment = function(likedb, callback){
     
likedb.save(callback);
 console.log(likedb);
   // req.flash('success', 'comment added');
        
          
}