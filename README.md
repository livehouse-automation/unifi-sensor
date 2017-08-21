# unifi-sensor
Vera Plugin for Presence Detection using a Unifi Controller

Firstly we must acknowledge our ancestors and traditional owners of the code upon which we stand.

TedStriker, the original author of the Ping Sensor Plugin and everyone who updated and modified the plugin since 2009.
Salvation, over on the Domoticz forum who posted a shell script which I've re-purposed for use on Vera.

Introduction:

The Unifi Sensor operates in much the same way as the Ping Sensor on which it's based. The difference is it queries your Unifi Controller and looks for a MAC or IP address - if that address is found, the sensor trips. This method means you can detect the presence of devices that don't respond to ping, or go into a deep sleep state (eg Galaxy S smartphones) and ignores network pings.

Things to know:

Your Unifi controller needs to be up to the task of dealing with the volume of queries based on your polling interval. Each query involves authentication and returning a JSON result that is between 2kb and 30kb for the 'average' home network. Queries that run too long risk upsetting Vera's watchdog.

Recommended interval is 60 seconds or more, and if you have multiple instance stagger the times a little so they don't all run at the same time. (eg, 60, 63, 65).Retry count is recommended to be at least 1 in my testing, I have had some false trips with 0/1, mainly due to issues with the Unifi controller rather than the plugin.

Devices appearing on the network are picked up pretty quickly, devices that have left the network will stay on the controller for a several minutes. Using a 60 second interval it takes 4-8 minutes for devices to be detected as offline.

Tested on UI7 1.7.3016 - VeraEdge, VeraPlus and VeraSecure. This plugin is probably not UI5 friendly.
Tested on Unifi Controller v5.4.19, 5.5.20 (note that 5.4.19 suffered performance degradation over a few days of polling). 

Installation:

Download the plugin files.Copy these files to Vera using Apps->Develop Apps->Luup Files

- D_UnifiSensor.json
- D_UnifiSensor.xml
- I_UnifiSensor.xml
- S_UnifiSensor.xml
- J_UnifiSensor.js

You'll need to use WinSCP or similar to copy the unifi_check_v1.sh to the /etc/cmh-ludl folder. Once it's copied in you need to give execute permissions. You can do this with WinSCP by setting properties on the file, you want Octal 0775 as the result.

Once the files are in place, create a new device specifying device file (D_UnifiSensor.xml) and implementation file (I_UnifiSensor.xml).

You'll need to reload the Luup Engine and refresh your browser before the device will appear in the UI.

Configuration:

Create a separate user on your Unifi Controller for Vera to use, don't use your main Admin account - the continual authentications against the controller will make it hard to access the webpages if you share accounts.

In the UI for the device, go into the Settings tab and provide the information needed - it should be self explanatory.

You will see polling details and results in the UI so you can see if it's active. Device will show Green if the address you've provided is detected on the controller and will be Blue if not. Using the Invert option will reverse that, and provides a means to test if the device is functioning/triggering alerts correctly.

Future:

- If someone wants to create a Lua replacement for the script code using curl that'd be awesome. A mechanism to share logins/reuse cookies rather than authenticate for every query and reduce the load on the unifi controller.
- Better logging of time taken for queries to run.
- Tap into last seen timestamp from Unifi Controller so that you can bypass the need for the Unifi controller to purge the association.

Changelog: 9/8/17 v1.03 - updated Implementation file and polling script to put a timeout value on curl queries and only change status if the commands complete successfully in less than 15 seconds per query. Tested on new version 5.5.20 of Unifi Controller and it handles the repeated polling with much greater efficiency, query times typically complete within a second. Device UI now reports execution time and displays an error if curl does not complete successfully. Reliability of detection is much improved. Recommended retry setting now 0 or 1.
