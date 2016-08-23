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
    // use the cache
  } else {
    // rebuild the cache
  }
}
