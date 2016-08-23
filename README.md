# JSE the Javascript-Search-Engine
What am I?
Hi! I am JSE, also known as Joseph, and basically, I am a javascript driven search engine that searches through all files in the root directory of a website looking for matching content.<br><br>
How I do it? <br>Simple, I load the names of all files from the root directory into an object. I then scan through this object using AJAX until I find a piece of text that matches the string that has been put into for example a textfield.
<br><br>
Because I operate like this, there is no need for a database and because of that, I am being a solution to the "smaller" websites that do not initially require a database. 

### Example usage

```javascript
$("input[type=text]").keyup(function(){

  // JSE(<value_to_look_for> <start_function> <done_function>)
  JSE(
    $(this).val(), 
    function(){
      console.log("This function executes before anything happens, "); 
      console.log("but can also be set to null if there is no need for it!");
    }, 
    function(results, timeElapsed){
	console.log("This function executes when the search is done. ");
	console.log("It contains an object with all the data you need in the results variable ");
	console.log("And if set, the time to took to execute the scan is stored in the timeElapsed variable");
	// Side note: You can change the names of the variables to your likings. 
	// (Just don't mess up the order, would ya?)
     }
  });
});
```
And be sure not to forget to append the JSE library file onto the bottom of your HTML document!
