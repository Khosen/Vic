
const commentsdb = require('./models/comments');
const Prog = require('./models/programmes');


module.exports=function(io){

 //var count=15;
    io.on("connection", (socket) => {  
        console.log("a user connected");
        //const hasChanged = await haveExamsChanged();
        //(hasChanged) {
        // var count=15;
     //socket.emit('commentCount', count);
         // console.log("another user " +count);

          var postid;
          socket.on('comment',function(data){
            console.log("connected" +data.postId+data.name+data.comment);
            const docs={name:data.name,
              body:data.comment,
            date:new Date(Date.now())};
            postid=data.postId;

              commentsdb.createComment(docs, postid, (err, commentsdb)=>{
                if(err) {
                  console.log(err);
                }else{

                  Prog.addCount(postid, (err, Prog)=>{
                    if(err){
                      console.log(err);
                    }
                  });
                  
           socket.broadcast.emit('comment',data); 
           console.log("in here" + commentsdb);
       
           console.log(data +"this is printing");
              }
              });
            
            //var commentData = new commentsdb(docs);
            //commentData.save();
           /* commentsdb.createComment(docs, postid, (err, commentdb)=>{
              if(err) {
                console.log(err);
              }else{
         socket.broadcast.emit('comment',data); 
         console.log("in here" + commentdb);
     
         console.log(data +"this is printing");
            }
            });*/
          });


        var count=2;
        socket.on('commented', function(){

          //ad to database
          count += 1;
          console.log("another user2 connected");
      
          socket.emit('commentCount', count);
          console.log("count");
        });

        
        socket.on('clicked', function(clicks){
          //recieve clicks value from client
          console.log(clicks);
         var recievedClicks=0;
         recievedClicks = parseInt(clicks) +1;
       //  recievedClicks +=1;
         ///update database click count with new data 

         //send back to client updatd data
          socket.emit('showClick', recievedClicks);


        })
  
      });
      

};

