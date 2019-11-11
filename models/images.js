
const mongoose = require('mongoose');

const imageSchema = mongoose.Schema({
img: 
   { data: Buffer, 
   contentType: String 
}

});

const images = module.exports= mongoose.model('images', imageSchema);
