#!/bin/sh

# Unifi Sesnor polling script for use with Vera v1.03
# Copy to /etc/cmh-ludl and grant execute permissions (Octal 0775)
# Based on script found on Domoticz forum by "Salvation"
# This version by LiveHouse Automation - support@livehouseautomation.com

# Parameters
Device=$1
Polling=$2
Address=$3
unifi_controller=https://$4
unifi_username=$5
unifi_password=$6

# Variables/Constants

ReturnCode=0
cookie=/tmp/unifi_cookie.${Device}

# Note timeout of 15 seconds for curl commands. Plugin will not change state unless curl returns 0.
curl_cmd="curl --cookie ${cookie} --cookie-jar ${cookie} --insecure --max-time 15 "

unifi_login() {
    # authenticate against unifi controller
    ${curl_cmd} -H "Content-Type: application/json" -X POST -d "{\"password\":\"$unifi_password\",\"username\":\"$unifi_username\"}" $unifi_controller/api/login
    curl_ok $? unifi_login
}

unifi_logout() {
    # logout
    ${curl_cmd} $unifi_controller/logout
    curl_ok $? unifi_logout
}

# stat/sta
unifi_list_sta() {
    ${curl_cmd} --data "json={}" $unifi_controller/api/s/default/stat/sta
    curl_ok $? unifi_list_sta
}

# curl_ok function tests curl exit code and requires 2 parameters: $1 = curl exit code; $2 = calling function name
curl_ok() {
    if [ $1 -ne 0 ]; then
        echo "Error! curl command in $2 returned $1"
        exit 2
    fi
}

unifi_login

#put unifi_list_sta output in variable
#check if provided "address" exists in the status json 
var=$(unifi_list_sta)

if echo "$var" | grep -q -i "$Address"; then
    echo "$Address is found"
    ReturnCode=0;
else
    echo "$Address NOT found"
    ReturnCode=1;
fi

#This appears to just clear the cookies files, commented out to reduce calls to Unifi Controller. Uncomment if security is a concern.
#unifi_logout

exit $ReturnCode
