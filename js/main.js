console.log("let us try this shit out");
console.log(chrome.storage);
// The chrome API for this is quite amazing isn't it? right it is 
function onClickHandler(info, tab) {
  if(info.menuItemId == "alertSelect") {
    alert(info.selectionText) 
  }else{
    console.log(info.selectionText);
  }
};

chrome.contextMenus.onClicked.addListener(onClickHandler);

chrome.contextMenus.create({"title" : "Alert selected", "id" : "alertSelect", "type" : "normal", "contexts" : ["selection"]});
chrome.contextMenus.create({"title" : "Log to console", "id" : "logSelect", "type" : "normal", "contexts" : ["selection"]});

