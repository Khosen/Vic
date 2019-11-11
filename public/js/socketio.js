

var socket = io("http://localhost:3000");
var event = new Date();

$('#commentForm').on('submit', function onSubmit() {
  // raw comments data being prepared for db
  var postId = $('#postId').val();
  var comment = $('#comment').val();
  var name =$('#name').val();

  //socket.on('#send').click(
  //  function(){
   //comments counter//
//var count =$('#counts').val();
//  socket.emit('commented');//emitting user click
    //console.log("button clicked");
var time = event.toLocaleTimeString('it-IT');
 var date = new Date().toLocaleDateString();
   var data ={'postId':postId, 'comment': comment, 'name':name};
   //var data ={'postId':postId};
//the comments are displayed live while being sent to db
  $('.comments').append("<span>"+  $('#name').val() +     "&nbsp;"   +    "&nbsp;"   +"</span>");
  $('.comments').append("<span>"+  date +     "&nbsp;"    +      "&nbsp;"   +"</span>");
  $('.comments').append("<span>"+  time +"</span>");
 //$('.comments').append("<p>" + $('#name').val()+ "</p>");
 $('.comments').append("<p>" + $('#comment').val()+ "</p>");
    
 //$('.counter').append("<span>" + getCount+ "</span" );
   $('#comment').val('');
   $('#name').val('');
       
 socket.emit('comment',data);
 socket.emit('commented');//emitting user click
 
 
  return false;
 
 });

 //all previous comments are displayed
 socket.on('comment',function(data){
  var postId = "<%= postId %>";
  if(postId==data.postId){
   // $('.comments').append("<p>"+ "<label>"+data.name+"</label"+"</p>");
      $('.comments').append("<p>"+data.comment+"</p>");
     // $('#counts').append( data.length+1 );
      console.log(data.length);
       console.log(data.noComment + "here") ;
    // $('.counter').append("<p>"+count+ 1+"</p>");
 
  }
  });
//get count from serer
 /* socket.on('commentCount', function(result){
   ////display on page
  // var a = result ; //+ parseInt(1);
    $('#counts').append("<span>" + parseInt(result) + "</span>"); //set new count value
    console.log("ready to count" +result);

  }); */



  $(function(){
   // var socket=io("http://localhost:3000"); //connect to socket
    socket.on('connect', function()
    {
      console.log("ready to count");

      //get count from serer
  socket.on('commentCount', function(result){
    ////display on page
   // var a = result ; //+ parseInt(1);
   var a = parseInt(result) + 1;

     $('#counts').html("<span>" + a + "</span>"); //set new count value
     console.log("ready to count" +result);
 
   }); 
 

    });



  });

  //writing the click function
  $('#clicks').on('click', function   onClick(){
    //get postid for comparism
    var postId = $('#postId').val();
    
    //get clicks from hidden field that has updated clicks
    console.log("mouse clicked" +postId);
    var clicks =$('#clickvalue').val();
    console.log(clicks + "the value");
    //send click value to server
    socket.emit('clicked', clicks);
  });

  socket.on('showClick', function(result){

  //  var w= parseInt(result) +1
//recieve click value from server and display
    $('#clicks').html("<span>" + result + "</span>");
    $('#clickvalue').html("<span>" + result+ "</span>");
  })
