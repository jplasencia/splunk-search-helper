


const defaultSettings={
    enableComments: true,enableWordComments:false,enableLineCut:true,
    enableShowHelp: true,enableShowLineNumbers: false,
    enableKeithMode:false
  }
  
  



let commentLines="```"
var scriptTag = document.createElement("script");
chrome.storage.local.get(defaultSettings, function(data) {
    scriptTag.src = chrome.runtime.getURL('scripts/injected_code.js');
    localStorage.setItem("SplunkCommentSettings",JSON.stringify(data))
    document.head.appendChild(scriptTag);
});







