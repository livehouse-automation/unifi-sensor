var UnifiSensor = (function (api) {
	// example of unique identifier for this plugin...
	var uuid = '73955f3a-7775-11e7-b5a5-be2e44b06b34';
	var unifisensor_svs = 'urn:livehouse-automation:serviceId:UnifiSensor1';
	var myModule = {};
	
	var deviceID = api.getCpanelDeviceId();
	
	function onBeforeCpanelClose(args){
        console.log('handler for before cpanel close');
    }
    
	function init(){
        // register to events...
        api.registerEventHandler('on_ui_cpanel_before_close', myModule, 'onBeforeCpanelClose');
    }
	
	///////////////////////////
	function address_set(deviceID, varVal) {
	  api.setDeviceStateVariablePersistent(deviceID, unifisensor_svs, "Address", varVal, 0);
	}

	function period_set(deviceID, varVal) {
	  api.setDeviceStateVariablePersistent(deviceID, unifisensor_svs, "Period", varVal, 0);
	} 
	
	function retries_set(deviceID, varVal) {
	  api.setDeviceStateVariablePersistent(deviceID, unifisensor_svs, "AllowedFailure", varVal, 0);
	}

	// functions for additional unifi variables
	
	function url_set(deviceID, varVal) {
	  api.setDeviceStateVariablePersistent(deviceID, unifisensor_svs, "UnifiURL", varVal, 0);
	}

	function username_set(deviceID, varVal) {
	  api.setDeviceStateVariablePersistent(deviceID, unifisensor_svs, "UnifiUser", varVal, 0);
	} 
	
	function passwd_set(deviceID, varVal) {
	  api.setDeviceStateVariablePersistent(deviceID, unifisensor_svs, "UnifiPassword", varVal, 0);
	}
	
	
	function ReloadEngine(){
		api.luReload();
	}
	
	function UnifiSensorSettings(deviceID) {
		try {
			init();
			
			var period  = api.getDeviceState(deviceID,  unifisensor_svs, 'Period');
			var address  = api.getDeviceState(deviceID,  unifisensor_svs, 'Address');
			var retries  = api.getDeviceState(deviceID,  unifisensor_svs, 'AllowedFailure');
			// variables for additional unifi stuff
			var url  = api.getDeviceState(deviceID,  unifisensor_svs, 'UnifiURL');
			var username  = api.getDeviceState(deviceID,  unifisensor_svs, 'UnifiUser');
			var passwd  = api.getDeviceState(deviceID,  unifisensor_svs, 'UnifiPassword');
			
			if(isNaN(retries)) retries = 0;

			var html =  '<table>' +
			' <tr><td>Address </td><td><input  type="text" id="query_address" size=16 value="' +  address + '" onchange="UnifiSensor.address_set(' + deviceID + ', this.value);"></td></tr>' +
				' <tr><td>Poll Period </td><td><input  type="text" id="query_period" size=16 value="' +  period + '" onchange="UnifiSensor.period_set(' + deviceID + ', this.value);"> seconds</td></tr>' +
				' <tr><td>Device Retries </td><td><input type="text" id="query_retries" size=16 value="' +  retries + '" onchange="UnifiSensor.retries_set(' + deviceID + ', this.value);"></td></tr>' +
				' <tr><td>Unifi URL </td><td><input type="text" id="unifi_url" size=20 value="' +  url + '" onchange="UnifiSensor.url_set(' + deviceID + ', this.value);"></td></tr>' +
				' <tr><td>Unifi Username </td><td><input type="text" id="unifi_user" size=16 value="' +  username + '" onchange="UnifiSensor.username_set(' + deviceID + ', this.value);"></td></tr>' +
				' <tr><td>Unifi Password </td><td><input type="text" id="unifi_passwd" size=16 value="' +  passwd + '" onchange="UnifiSensor.passwd_set(' + deviceID + ', this.value);"></td></tr>' +
				'</table>';
			html += '<input type="button" value="Save and Reload" onClick="UnifiSensor.ReloadEngine()"/>';
			api.setCpanelContent(html);
		} catch (e) {
            Utils.logError('Error in UnifiSensor.UnifiSensorSettings(): ' + e);
        }
	}
	///////////////////////////
	myModule = {
		uuid: uuid,
		init : init,
		onBeforeCpanelClose: onBeforeCpanelClose,
		UnifiSensorSettings : UnifiSensorSettings,
		address_set: address_set,
		period_set: period_set,
		retries_set: retries_set,
		ReloadEngine: ReloadEngine,
		url_set: url_set,
		username_set: username_set,
		passwd_set: passwd_set
	};

	return myModule;

})(api);


//*****************************************************************************
// Extension of the Array object:
//  indexOf : return the index of a given element or -1 if it doesn't exist
//*****************************************************************************
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (element /*, from*/) {
        var len = this.length;

        var from = Number(arguments[1]) || 0;
        if (from < 0) {
            from += len;
        }

        for (; from < len; from++) {
            if (from in this && this[from] === element) {
                return from;
            }
        }
        return -1;
    };
}