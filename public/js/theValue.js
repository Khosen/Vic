//console.log('getting ready to get value selected');
//var theList;
//var j=0;
//get selected value 
list1=document.getElementById('catOption');
//pool data from db
list1.addEventListener('change', function(e){
    fetch('/getSubs',{method:'GET'})
    .then(function(response){
        if(response.ok)
        console.log(list1.value );
      
        return response.json();
        //throw new Error('Request failed.');
})
.then(function(data) {
//use data to pupulate second dropdown
     var  getNames =  data.filter(function(getName) {

      return getName.category == list1.value;
     
    });
    console.log(getNames); 
    var select = document.getElementById("sCategoryOption");
   //second dropdown population right here
    for(i=0; i<getNames.length; i++){
       var option = document.createElement('option');
      option.text = option.value = getNames[i].name;
      select.appendChild(option);
    }
console.log(data );
})

.catch(function(error) {
console.log(error);
});

});

