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
