
const toggleSwitches = document.querySelectorAll(".toggle-input");


const defaultSettings={
  enableComments: true,enableWordComments:false,enableLineCut:true,
  enableShowHelp: true,enableShowLineNumbers: false,
  enableKeithMode:false
}


chrome.storage.local.get(defaultSettings, function(data) {
  for(let key in data){
    if(document.querySelector(`#${key}`)){
      document.querySelector(`#${key}`).checked = data[key]
    }
  }
});



  // Add event listener for each toggle switch
  for (let toggle of toggleSwitches) {
    // toggle.checked = true
    toggle.addEventListener("change", function() {
      chrome.storage.local.set({ [this.id]: this.checked });
      console.log("checked: " + this.id )
    });
  }
  
