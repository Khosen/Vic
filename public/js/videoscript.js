
// Get the video
var video = document.getElementById("video");

// Get the button
//var btn = document.getElementById("btn");

// Pause and play the video, and change the button text
function myFunction() {

    $(document).ready(function(){
        $("btn").click(function(){
          $("btn").toggle('fa-pause');
          console.log('clicked');
        });
      });
 /*   if(video.fa-play){
        video.pause();
        btn.toggleClass('fa-pause');

    
    }else{
        video.play();
        btn.toggleClass('fa-play');
    }*/
  /*if (video.paused) {
    video.play();
    btn.toggleClass('fa-pause');
  } else {
    video.pause();
    btn.toggleClass('fa-play');
  }*/
 
  
}
