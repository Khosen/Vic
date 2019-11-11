const mongoose = require('mongoose');

const testSchema =mongoose.Schema({
  /*  category: 
{
    type: String,
    required: true,
     unique: true,
     trim:true
    },
    id:{
        type:String

    },
date:{
    type: Date,
    required:true
},
subcategory:[{
    name:{
        type:String,
        required:true,
        trim: true
      },
      
      topic:{
      type:String,
      required:true
      },

      link:{
      type:String,
      required:true,
      trim:true
      },
     date:{
       type:Date
      },
      meta:{
        views:Number,
        likes:Number,
        }
    }]*/
    likeCount:{
        type:Number
    },
    date:{
        type: Date
    }
});


const test = module.exports= mongoose.model('test', testSchema);

module.exports.addLikes = function(newTest, callback){
   // newTest.likeCount +=1;
    newTest.save(callback);
}