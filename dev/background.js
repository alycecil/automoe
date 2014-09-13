//AutoMOE
// William Cecil

// When the button is clicked, pause the clients
chrome.browserAction.onClicked.addListener(function(tab) {
	chrome.storage.local.get('pause', function(items) {
		var pause = items.pause;

		if (pause == null || pause == '' || pause == false) {
			pause = false;
		} else {
			pause = true;
		}

		pause = !pause;

		if (pause) {
			chrome.browserAction.setBadgeText({
				text : "paused"
			});
		} else {
			chrome.browserAction.setBadgeText({
				text : ""
			});
		}

		chrome.storage.local.set({
			'pause' : pause
		});
	});

});

// logging for storage
chrome.storage.onChanged.addListener(function(changes, namespace) {
	for (key in changes) {
		var storageChange = changes[key];
		console.log('Storage key "%s" in namespace "%s" changed. '
				+ 'Old value was "%s", new value is "%s".', key, namespace,
				storageChange.oldValue, storageChange.newValue);
	}
});

// add a listener for getting the tabId.
chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {

	if (request.action == 'getTabId') {
		chrome.tabs.sendRequest(sender.tab.id, {
			action : "response",
			'tabid' : sender.tab.id
		});

		// Make what you want
		chrome.tabs.getSelected(null, function(tabs) {
			chrome.tabs.sendRequest(tabs.id, {
				action : "response",
				'tabid' : tabs.id
			});
		});
	}
});

var details_tabId = null;
chrome.webRequest.onErrorOccurred.addListener(function(details) {
	console.log(details);

	var err = details.error.indexOf("net::ERR_ABORTED") < 0
			&& details.error.indexOf("net::ERR_BLOCKED_BY_") < 0
			&& details.url.indexOf("/js/") < 0;
	if (err) {
		if (details_tabId == null) {
			details_tabId = details.tabId;
			console.log("Starting reload");
			setTimeout(function() {
				chrome.tabs.reload(details.tabId);
				details_tabId = null;
			}, 1000);

		}
	}
	//
}, {
	urls : [ "<all_urls>" ]
});
