const mongoose = require('mongoose');

const tvSchema = mongoose.Schema({

    category:{
        type: String,
        unique: true,
        trim:true
        
    },
   
    date:{
        type:Date
    },

    subCategory:[
        { name:{
                type:String,
                trim:true,
                index:{
                    unique:true,
                    partialFilterExpression: {name:{$type: "string"}}
                }
                } ,
            date:{type:Date}    
        }
     ]
    
    /*subCategory:[{ 
        name:{
            type:String,
            trim:true,
            index:{
                unique:true,
                partialFilterExpression: {subCategory:{$type: "string"}}
            }
    }
      
    }]*/
   
});
const tvProgram= module.exports=mongoose.model('programs', tvSchema);

module.exports.createProg = function(newProg, callback){
    newProg.save(callback);
    console.log(newProg);
}

//update with list of subcategory
module.exports.updateProg=function( getCategory, getsubCategory, callback){
   
        //const 
      tvProgram.updateOne({category:getCategory},{ $push:{subCategory:getsubCategory}}, callback)
    console.log( getCategory +getsubCategory);
      }
      
     