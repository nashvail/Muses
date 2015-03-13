console.log("What the motherfukcing hell are you ding these days");
// The chrome API for this is quite amazing isn't it? right it is 
function onClickHandler(info, tab) {
  if(info.menuItemId == "alertSelect") {
  	console.log("Fuck yeah brother I have been alerted like this before");
    alert(info.selectionText) 
  }else{
    console.log(info.selectionText);
  }
};

chrome.contextMenus.onClicked.addListener(onClickHandler);

chrome.contextMenus.create({"title" : "Alert selected", "id" : "alertSelect", "type" : "normal", "contexts" : ["selection"]});
chrome.contextMenus.create({"title" : "Log to console", "id" : "logSelect", "type" : "normal", "contexts" : ["selection"]});
