var JSEConfig = {
  mainConfig : {
    JSEPHPDest: "php/cse.php", // Location where JSE should be looking for the PHP file.
    JSEPlaceholder: "#searchBox",
    // Name of the element where the files will be loaded in.
    JSECaseSensitive: false, // Should the JSE searches be considered case sensitive?
    JSEMeasureSpeed: true // Should JSE measure the time it takes to do the full search?
  },
  cachingConfig : {
    JSECache: true,
    // JSE caches (saves) the document's information into an array, so the next time it scans, it skips the files AJAX requests.
    JSECacheInterval: 300, // Sets an expiration date at the cached document(s). (300 seconds, 5 minutes)
  }
}


/*
    The (small) core of JSE.
*/

function JSE(JSETag, initFunction, doneFunction){
  /*
    The JSETag will contain the keyword a user wants to search for.
    The initFunction will execute BEFORE JSE does the search.
    The doneFunction will execute, you guessed it, AFTER the search is complete.
      - Will contain the time it took to do the search (if enabled!)
      - Will contain an object with the results
  */

  /*
    To start off, we want to check if the JSETag is given, since this variable is required to do a search.
    Secondly, we'd want to check if the initFunction variable is given (if not, no problem, just won't execute) and that it is a valid function.
    At last, we'd want to do the same for the doneFunction variable.
  */
  if(typeof JSETag === "undefined" || JSETag === ""){
    return false;
  }
  else if(!$.isFunction(doneFunction)){
    return false;
  }
  else if($.isFunction(initFunction)){
    initFunction();
  }

  /*
    Now the validation is passed we want to acquire the required variables.
  */
  var JSETag = JSETag.toString();

  var JSEPHPDest = JSEConfig.mainConfig.JSEPHPDest;
  var JSEPlaceholder = JSEConfig.mainConfig.JSEPlaceholder;
  var JSECaseSensitive = JSEConfig.mainConfig.JSECaseSensitive;
  var JSEMeasureSpeed = JSEConfig.mainConfig.JSEMeasureSpeed;

  var JSECacheEnabled = JSEConfig.cachingConfig.JSECache;
  var JSECacheMode = JSEConfig.cachingConfig.JSECacheMode;
  var JSECacheInterval = JSEConfig.cachingConfig.JSECacheInterval;

  // If JSEMeasureSpeed is set to true, measure the start time.
  if(JSEMeasureSpeed == true){
    var JSEPerfMeasureStart = performance.now();
  }

  // If there is cache available, use it. If not, create a new empty object.
  JSEData = window.JSEData = (typeof window.JSEData === "undefined") ? {} : window.JSEData;

  // Check if the cache is not expired yet. If it is, remove the cache.
  if(JSECacheEnabled == true){
    if(typeof JSEData["cacheTime"] !== "undefined"){
      if(output > (JSEData["cacheTime"] + JSECacheInterval)){
        JSEData = {};
      }
    } else {
      var d = new Date(); var hour = d.getHours(); var minute = d.getMinutes(); var second = d.getSeconds();
      var output = parseInt((((''+hour).length<2 ? '0' :'') + hour * 3600)) + parseInt((((''+minute).length<2 ? '0' :'') + minute * 60 )) + parseInt((((''+second).length<2 ? '0' :'') + second * 1));
      JSEData["cacheTime"] = output;
    }
  }

  // Determine if cache should be used or not
  var useCache = $.map(JSEData, function(n, i) { return i; }).length !== 1 ? true : false;
  if(useCache){
    /*
      The cache is still valid and set, so we can use that instead.
    */
  } else {
    /*
      Here we want to start filling our JSEData object with actual data.
      What we want to insert first, is all of the file names that are in the given directory, set in the PHP file.
      To accomplish this, we send an AJAX request to the server that will list these files and will return them the same way.
    */
    $.ajax({ url: JSEPHPDest, data: "requestFileNames=true", method: "POST",
      success: function(fileList){
        // Parse the file list, so the browser is able to understand this.
        var fileList = JSON.parse(fileList);
        // Add the files of the fileList variable into JSEData.
        for (var i = 0; i < fileList.length; i++) {
          JSEData[fileList[i]] = {};
        }
        // Execute the callback function.
        fileRetrievalDone();
      }
    });

    /*
     Now that we have the file names, we want to grab the text content(s) from this file, so we can fill our JSEData object.
    */
    function fileRetrievalDone(){
      /*
         Because callbacks are hard when combining asynchronous functions with synchronous functions, I've come up with a quick solution.
         Counting the amount of items in the JSEData object, and everything the HTML append function is done, execute a callback with the current file number attached.
         If the parameter is equal to the amount of files in the JSEData object, it is done with executing the HTML append functions.
      */
      var currFile = 0;
      var amountOfFiles = 0; for(var prop in JSEData) { amountOfFiles++; }; amountOfFiles--;

      // For each file name, load the text contents of this file into the JSEData object.
      $.each(JSEData, function(fileName){
        $.ajax({ url: window.location +"/" + fileName,
          success: function(fileContent){
            /*
              The fileContent variable now contains the file its contents.
              We place this in the given JSEPlaceholder element (without the Javascript code attached!),
              so that we can then grab the text contents from the given data.
            */

            // Hide the JSEPlaceholder element, to be sure the user doesn't see this. (They shouldn't)
            $(JSEPlaceholder).hide();
            // Append the fileContent into the JSEPlaceholder element. (while removing attached JavaScript using $.parseHTML)
            $(JSEPlaceholder).html($.parseHTML(fileContent));
            // Add the text content into the JSEData object.
            JSEData[fileName]["fileContent"] =
                $(JSEPlaceholder).text().toString().replace(/(\r\n|\n|\r)/gm,"")
                + $(JSEPlaceholder).children().text().toString().replace(/(\r\n|\n|\r)/gm,"")
                + fileName;
            // Empty the JSEPlaceholder element.
            $(JSEPlaceholder).empty();

            // Execute the callback function.
            currFile++;
            fileContentRetrievalDone(amountOfFiles, currFile);
          }
        });
      });
    }

    function fileContentRetrievalDone(amountOfFiles, currFile){
      if(currFile == amountOfFiles){
        /* The scan is complete. */
      }
    }
  }
}
