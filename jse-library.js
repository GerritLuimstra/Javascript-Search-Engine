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
  else if($.isFunction(initFunction)){
    initFunction();
  }
  else if(!$.isFunction(doneFunction)){
    return false;
  }
}
