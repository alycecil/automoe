var conection = new function() {
	var _base;
	var _token;
	this.init = function(base, token) {
		_base = base;
		_token = token;
	};

	this.setToken = function(token) {
		_token = token;
	};

	this.getToken = function() {
		return _token;
	};

	this.get = function(url, type, callback, error, _promiss) {
		if (_base != null) {
			url = _base + url;
		}
		if (type == null) {
			type = 'get';
		}

		var req = {

			'crossDomain' : true,
			'type' : type,
			'processData' : false,

			'dataType' : 'json',
			// 'success' : callback,
			'error' : error,

			beforeSend : function(req) {
				if (_token != null) {
					req.setRequestHeader('Authorization', 'Token ' + _token);
				}
			}

		};

		if (_promiss) {
			$.ajax(url, req).done(function(data,x,y) {
				callback(data,x,y, _promiss);

			});
		} else {
			$.ajax(url, req).done(callback);
		}
	};
};