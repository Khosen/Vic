console.log('Client-side code running');
const button = document.getElementById('myButton');
button.addEventListener('click', function(e) {
console.log('button was clicked');
fetch('/clicked', {method: 'POST'})
.then(function(response) {
if(response.ok) {
console.log('click was recorded');
return;
}
throw new Error('Request failed.');
})
.catch(function(error) {
console.log(error);
});
});


setInterval(function() {
fetch('/likeCount', {method: 'GET'})
.then(function(response) {
if(response.ok) return response.json();

console.log("responseok");
throw new Error('Request failed.');

})
.then(function(data) {
document.getElementById('counter').innerHTML = `${data.length}`;
//document.getElementById('counter').appendChild=`${data.length}`;
console.log(data.length);
})
.catch(function(error) {
console.log(error);
});
}, 1000);