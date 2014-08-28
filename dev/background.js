//AutoMOE
// William Cecil


// When the button is clicked, pause the clients
chrome.browserAction.onClicked.addListener(function(tab) {  
  	chrome.storage.local.get('pause',function(items){
  		var pause = items.pause;
  	
  		if(pause==null||pause==''||pause==false){
  			pause=false;
  		}else{
  			pause=true;
  		}
  		
  		pause=!pause;
  		
  		if(pause){
  			chrome.browserAction.setBadgeText({text:"paused"});
  		}else{
  			chrome.browserAction.setBadgeText({text:""});
  		}
  		
  		chrome.storage.local.set({'pause':pause});
  	});
	
});


//logging for storage
chrome.storage.onChanged.addListener(function(changes, namespace) {
        for (key in changes) {
          var storageChange = changes[key];
          console.log('Storage key "%s" in namespace "%s" changed. ' +
                      'Old value was "%s", new value is "%s".',
                      key,
                      namespace,
                      storageChange.oldValue,
                      storageChange.newValue);
        }
});


//add a listener for getting the tabId.      
chrome.extension.onRequest.addListener(function(request, sender, sendResponse) 
{   

    if(request.action== 'getTabId')
    {

        // Make what you want
        chrome.tabs.getSelected(null, function(tabs) {
            chrome.tabs.sendRequest(tabs.id, { action: "response" , 'tabid':tabs.id});
        });     
    }
});
