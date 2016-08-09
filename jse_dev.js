var JSEConfig = {
  "mainConfig" : {
    "JSEPHPDest": "php/cse.php", // Location where the PHP file for JSE should be.
    "JSEPlaceholder": "#searchBox",
    // Name of the element where the files will be loaded in.
    // If you leave this as it is, JSE will handle this for you.
    "JSECaseSensitive": false, // Should the JSE searches be considered case sensitive?
    "JSEUrl": window.location, // Has to be set in order for it to work online. Without this it only works locally.
    "JSEMeasureSpeed": true // Should JSE measure the time it takes to do the full search?
  },
  "cachingConfig" : {
    "JSECache": true,
    // JSE caches (saves) the document's information into an array, so the next time it scans, it skips the AJAX requests.
    "JSECacheInterval": 300, // Refreshes the cached document(s) after 5 minutes. (300 seconds)
  }
}

function JSE(JSETag){

  function init(){
    // Do something before the magic happens, like showing a loading animation. You name it!
  } init();

  function done(results, elapsedTime){

    if(results !== false){
      var resultCount = 0; for(var p in results) { resultCount++; };
      var output = "";
      output+= "<h2 id='amount'>I've found " + resultCount + " results</h2><p id='elapsed'>Pssst, this took me " + Math.round(elapsedTime) +"ms<p><hr>";
      $.each(results, function(fileName){
        var webTitle = results[fileName]["webTitle"];
        if(webTitle !== undefined){
          output+= "<div class='result'>" + webTitle + " (" + fileName + ")</div>";
        } else {
          output+= "<div class='result'>" + fileName +"</div>";
        }
      });
      $("#results").html(output);
    } else {
      var output = "<h2 id='amount'>I've found 0 results</h2><hr><div class='result'>I am sorry, I didn't find anything.</div>";
      $("#results").html(output);
    }
  }

  // If no tag is given or if it is empty, return false.
  if(typeof JSETag === "undefined" || JSETag === null || JSETag === ""){ return false; }

  // Declaring the required variables
  var JSETag = JSETag.toString();
  var JSEPHPDest = JSEConfig["mainConfig"]["JSEPHPDest"];
  var JSEPlaceholder = JSEConfig["mainConfig"]["JSEPlaceholder"];
  var JSECaseSensitive = JSEConfig["mainConfig"]["JSECaseSensitive"];
  var JSEUrl = JSEConfig["mainConfig"]["JSEUrl"];
  var JSEMeasureSpeed = JSEConfig["mainConfig"]["JSEMeasureSpeed"];
  var JSECacheEnabled = JSEConfig["cachingConfig"]["JSECache"];
  var JSECacheMode = JSEConfig["cachingConfig"]["JSECacheMode"];
  var JSECacheInterval = JSEConfig["cachingConfig"]["JSECacheInterval"];

  JSECache = window.JSECache = (typeof window.JSECache === "undefined") ? {} : window.JSECache;

  // This variable stores all the data obtained from the scan.
  var JSEData = {};

  // If JSEMeasureSpeed is set to true, measure the start time.
  if(JSEMeasureSpeed == true){ var JSEPerfMeasureStart = performance.now(); };

  // To scan through files to find matching content, we need files to begin with, Right?
  $.ajax({ url: JSEPHPDest, data: "requestFileNames=true", method: "POST",
    success: function(fileList){
      // Parse the result, so the browser can read it.
      var fileList = JSON.parse(fileList);
      // Add the files of the fileList into JSEData.
      for (var i = 0; i < fileList.length; i++) {
        JSEData[fileList[i]] = {};
        // If JSECache is enabled, and there is no cacheTime set, load the files into the cache object.
        if(JSECacheEnabled == true){
          if(typeof JSECache["cacheTime"] === "undefined"){
              JSECache[fileList[i]] = {};
          }
        }
      }
      // Now that we have the file names, let's loop over them to grab their content. (text)
      var fileNumber = 0;
      var callBackCount = 0; for(var prop in JSEData) { callBackCount++; };

      $.each(JSEData, function(fileName){
        // Determine if cache is valid and should be used.
        var useCache = false;
        if(JSECacheEnabled == true){
          if(typeof JSECache["cacheTime"] !== "undefined"){
            var d = new Date(); var hour = d.getHours(); var minute = d.getMinutes(); var second = d.getSeconds();
            var output = parseInt((((''+hour).length<2 ? '0' :'') + hour * 3600)) + parseInt((((''+minute).length<2 ? '0' :'') + minute * 60 )) + parseInt((((''+second).length<2 ? '0' :'') + second * 1));
            if(output <= (JSECache["cacheTime"] + JSECacheInterval)){
              useCache = true;
            }
          }
        }

        // The cache is now being used.
        if(useCache == true){
          // Check if JSE is set to be looking at case sensitivity.
          // If set to false, convert everything to undercase and then search.
          JSEData[fileName]["fileContent"] = JSECache[fileName]["fileContent"];
          if(typeof JSECache[fileName]["webTitle"] !== "undefined"){ JSEData[fileName]["webTitle"] = JSECache[fileName]["webTitle"]; }
          if(JSECaseSensitive == false){
            if((JSECache[fileName]["fileContent"].toLowerCase()).indexOf(JSETag.toLowerCase()) !== -1){
              JSEData[fileName]["hasMatch"] = true;
            }
          } else {
            if((JSECache[fileName]["fileContent"]).indexOf(JSETag) !== -1){
              JSEData[fileName]["hasMatch"] = true;
            }
          }
          fileNumber++;
          loadingDone(fileNumber);
        } else {
          // The cache is not being used.
          $.ajax({ url: JSEUrl+"/" + fileName,
            success: function(fileContent){
              // When the current file is a web document (.html, .php), we also want the title of this document.
              if(fileName.indexOf(".html") !== -1 || fileName.indexOf(".php") !== -1){
                var webTitle = fileContent.substring(fileContent.lastIndexOf("<title>")+7, fileContent.lastIndexOf("</title>"));
                JSEData[fileName]["webTitle"] = webTitle;
                if(JSECacheEnabled == true) { JSECache[fileName]["webTitle"] = webTitle; };
                // Just the text between the body tags are important if we have the title.
                fileContent = fileContent.substring(fileContent.lastIndexOf("<body>")+6, fileContent.lastIndexOf("</body>"));
              }

              // Hide the JSEPlaceholder element, to be sure the user doesn't see this. (They shouldn't)
              $(JSEPlaceholder).hide();
              // Append the fileContent into the JSEPlaceholder element.
              $(JSEPlaceholder).html($.parseHTML(fileContent));
              // Add the text content into the JSEData object.
              JSEData[fileName]["fileContent"] = $(JSEPlaceholder).text().toString().replace(/(\r\n|\n|\r)/gm,"") + $(JSEPlaceholder).children().text().toString().replace(/(\r\n|\n|\r)/gm,"") + fileName;
              if(JSECacheEnabled == true) { JSECache[fileName]["fileContent"] = $(JSEPlaceholder).text().toString().replace(/(\r\n|\n|\r)/gm,"") + $(JSEPlaceholder).children().text().toString().replace(/(\r\n|\n|\r)/gm,"") + fileName; };
              // Empty the JSEPlaceholder element.
              $(JSEPlaceholder).empty();

              // Check if JSE is set to be looking at case sensitivity.
              // If set to false, convert everything to undercase and then search.
              if(JSECaseSensitive == false){
                if(((fileContent + fileName).toLowerCase()).indexOf((JSETag.toString()).toLowerCase()) !== -1){
                  JSEData[fileName]["hasMatch"] = true;
                }
              } else {
                if((fileContent + fileName).indexOf(JSETag.toString()) !== -1){
                  JSEData[fileName]["hasMatch"] = true;
                }
              }
              fileNumber++;
              loadingDone(fileNumber, true);
            }
          });
        }
      });
      // This is the callback function from the asynchronous AJAX functions.
      function loadingDone(fileNumber, refreshCacheTime){
        if(callBackCount == fileNumber){
          // Check whether the cacheTime should be refreshed or not.
          if(refreshCacheTime == true){
            // Refresh the cache timer.
            var d = new Date(); var hour = d.getHours(); var minute = d.getMinutes(); var second = d.getSeconds();
            var output = parseInt((((''+hour).length<2 ? '0' :'') + hour * 3600)) + parseInt((((''+minute).length<2 ? '0' :'') + minute * 60 )) + parseInt((((''+second).length<2 ? '0' :'') + second * 1));
            JSECache["cacheTime"] = output;
          }

          // Measure the speed it took to do the full search.
          var timeElapsed = 0;
          if(JSEMeasureSpeed == true){
            var JSEPerfMeasureFinish = performance.now();
            if(typeof JSEPerfMeasureStart !== "undefined"){
              timeElapsed = JSEPerfMeasureFinish - JSEPerfMeasureStart;
            }
          }
          // Quick check if timeElapsed is valid. If so, execute done function with the timeElapsed parameter. If not, execute the done function without the timeElapsed parameter.
          if(timeElapsed !== 0){
            done(JSEData, timeElapsed);
          } else { done(JSEData); }
        }
      }
    }
  });
}


$(document).ready(function(){
  $("input[type=text]").keyup(function(){
    if($(this).val() == ""){
      var output = "<h2 id='amount'>I've found 0 results</h2><hr><div class='result'>I am sorry, I didn't find anything.</div>";
      $("#results").html(output);
    } else {
      JSE($(this).val());
    }
  });
});
