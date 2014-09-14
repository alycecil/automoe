//AutoMOE
// William Cecil
var details_tabId = null;
var server = // 'http://localhost:8080/jerseymoe/';
'http://tomcat-alysforever.rhcloud.com/jerseymoe/';

function error(msg, x) {
	console.log(msg);
}

function callback(data) {
	// $(".result").html(JSON.stringify(data));
	console.log(data);
}

function callbackSetup(data, x, y, _promiss) {

	console.log(data);

	if (data != null && data["uuid"] != null) {
		conection.setToken(data["uuid"]);

		// save this connection noise
		var dataApi = {
			'uuid' : data['uuid']
		};

		chrome.storage.local.set(dataApi);
	}

	if (_promiss) {
		_promiss();
	}
}

function apiGet(key) {
	this._callback = function() {
		conection.get('webapi/data/get?key=' + key, 'get', callback, error);
	};
	if (conection.getToken() == null) {
		apiLoad(_callback);
	} else {
		_callback();
	}
}

function apiSave(key, val) {
	this._callback = function() {
		conection.get('webapi/data/set?key=' + key + '&value=' + val, 'put',
				callback, error)
	};
	if (conection.getToken() == null) {
		apiLoad(_callback);
	} else {
		_callback();
	}
}

function apiLoad(_callback) {
	chrome.storage.local.get('uuid', function(items) {
		if (items['uuid'] == null) {
			conection.init(server);
			conection.get('webapi/common/user/get ', 'get', callbackSetup,
					error, _callback);
		} else {
			conection.init(server);
			conection.setToken(items['uuid']);
			if (_callback) {
				_callback();
			}
		}
	});
}

function renderBadge() {
	chrome.storage.local.get('pause', function(items) {
		var pause = items.pause;

		if (pause == null || pause == '' || pause == false) {
			pause = false;
		} else {
			pause = true;
		}

		if (pause) {
			chrome.browserAction.setBadgeText({
				text : "paused"
			});
		} else {
			chrome.browserAction.setBadgeText({
				text : ""
			});
		}

	});
}

function pauseEventListener(tab) {
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

}

function saveChangeEvent(changes, namespace) {
	for (key in changes) {
		var storageChange = changes[key];
		console.log('Storage key "%s" in namespace "%s" changed. '
				+ 'Old value was "%s", new value is "%s".', key, namespace,
				storageChange.oldValue, storageChange.newValue);

		// if key was "moeStats:___"
		if(key.indexOf("moeStats")>=0){
			
			apiSave(key,JSON.stringify(storageChange.newValue));
		}

	}
}

function requestListener(request, sender, sendResponse) {
	// 
	renderBadge();

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
}

function reloadOnErrorListener(details) {
	var err = details.error.indexOf("net::ERR_ABORTED") < 0
			&& details.error.indexOf("net::ERR_BLOCKED_BY_") < 0
			&& details.url.indexOf("/js/") < 0;
	if (err) {
		console.log(details);
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
}
// When the button is clicked, pause the clients
chrome.browserAction.onClicked.addListener(pauseEventListener);

// logging for storage
chrome.storage.onChanged.addListener(saveChangeEvent);

// add a listener for getting the tabId.
chrome.extension.onRequest.addListener(requestListener);

chrome.webRequest.onErrorOccurred.addListener(reloadOnErrorListener, {
	urls : [ "<all_urls>" ]
});
