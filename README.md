# velux-klf200-api

> this is an Node for the API on the Velux&copy; KLF-200 io-homecontrol&copy; Gateway.
> (klf-200 provided by Velux&copy;. I'm not affiliated.)


This implementation is based on the API documentation [https://www.velux.com/api/klf200](https://www.velux.com/api/klf200).
It works only with the version 0.2.0.0.71.

Up to the version 0.1.1.0.45 it was possible to access the KLF-200 via the LAN interface. This does not work in version 0.2.0.0.71 anymore. Velux shared on demand with the Lan interface can only be addressed via the API.

Take a look at the [technical specification for klf 200 api.pdf](https://github.com/PLCHome/velux-klf200-api/blob/master/technical%20specification%20for%20klf%20200%20api.pdf)


For the latest updates see the [CHANGELOG.md](https://github.com/PLCHome/velux-klf200-api/blob/master/CHANGELOG.md)

# Install
```
npm install velux-klf200-api
```
---

### Currently tested with API 3.14 from 01.10.2018 version 0.2.0.0.71
---

### The connect password is the WLAN-Password not the web config password
---

### Requirements
* Velux KLF-200 on LAN
---
# Debug
This API supported debugging. you have to set the environment variable DEBUG
```
set DEBUG=velux-klf200-api:*
```
---
### Promise
This API works with and without promise. You can use a callback function. If there is no callback function in the call the API create an promise object.

## API without Promise
every API callback function is called first with an error object and then eventually a data object. If there is no error, the first parameter is null.

``` javascript
function callback(error,data) {}
```

``` javascript
'use strict'
const velux = require('velux-klf200-api')

step1()
function step1() {
  velux.connect('10.10.10.15',{},step2)
}
function step2(err) {
  if (err) {
    step5(err)
  }  else {
    velux.login('<some password>',step3)
  }
}
function step3(err,data) {
  if (err) {
    step5(err)
  } else {
    velux.sendCommand({ api: velux.API.GW_GET_VERSION_REQ},step4)
  }
}
function step4(err,data) {
  if (err) {
    step5(err)
  } else {
    console.log('step3:',data)
    velux.sendCommand({ api: velux.API.GW_GET_PROTOCOL_VERSION_REQ},step5)
  }
}
function step5(err,data) {
  if (err) {
    console.log(err)
  } else {
    console.log('step4:',data)
  }
  velux.end(step6)
}
function step6(err) {
  if (err) {
    console.log(err)
  }
}
```

## API with Promise
``` javascript
'use strict'
const velux = require('velux-klf200-api')

velux.connect('192.168.2.15',{})
.then(()=>{
  return velux.login('<some password>')
})
.then((data)=>{
  return velux.sendCommand({ api: velux.API.GW_GET_VERSION_REQ})
})
.then((data)=>{
  console.log('step3:',data)
  return velux.sendCommand({ api: velux.API.GW_GET_PROTOCOL_VERSION_REQ})
})
.then((data)=>{
  console.log('step4:',data)
  return velux.end()
})
.catch((err)=>{
  console.log(err)
  return velux.end()
})
```
in the API documentation I write the functions like that
``` javascript
(data)=>{}
```
it's the same as
``` javascript
function (data){}
```

##### this is the output if all is correct
``` cmd
step3: { id: 0,
  api: 9,
  apiText: 'GW_GET_VERSION_CFM',
  softwareVersion: [ 0, 2, 0, 0, 71, 0 ],
  hardwareVersion: 6,
  productGroup: 14,
  productType: 3 }
step4: { id: 0,
  api: 11,
  apiText: 'GW_GET_PROTOCOL_VERSION_CFM',
  majorVersion: 3,
  minorVersion: 14 }
```
---
# API functions

``` javascript
connect (host, options ,cb)
login (password, cb)
sendCommand (data, cb)
end (cb)
on (eventName, listener)
off (eventName, listener)
once (eventName, listener)
```
## function: connect
The connect function establishes the connection to the KLF. According to VELUX documentation, only 2 connections are permitted for the KLF.
- **host** *the IP-address of the KLF200*
- **options** *an object for future use*
- **cb** *the callback function if you don't use promise*

It returns an true in data if the API is connected.
## function: login
this function executes the login. this must happen before calling another API.
- **password** *the password of the KLF200*
- **cb** *the callback function if you don't use promise*
There is a true in data back when the API is logged in.

this function corresponds to the API call:
``` javascript
sendCommand({ 'api': velux.API.GW_PASSWORD_ENTER_REQ,
              'password': password})
```
## function: sendCommand
This function sends a command to the KLF200 and waits for the answer
The request and the answer are always objects. Only API commands that end with 'REQ' can be sent. The answer is always the appropriate confirm. This always ends with 'CFM'

- **data** *the API call with data as object*
- **cb** *the callback function if you don't use promise*

The construction of the request object
``` javascript
{ api: velux.API.<command>_REQ,
  <dataName>: <value>}
```
or
``` javascript
{ apiText: '<command>_REQ',
  <dataName>: <value>}
```

The construction of the answer object
``` javascript
{ id: 0,
  api: <commandNumber>,
  apiText: '<command>_CFM',
  <data>: <value>}
```

see examples and API below
## function: end
The end function closes the connection to the KLF.
- **cb** *the callback function if you don't use promise*

## functions: on off once
These are the functions for the event emitter. The KLF responds to each request with a confirm. Many data are also sent as a notification. These can only be retrieved via the events.
[For more information read this]([https://nodejs.org/api/events.html#events_emitter_on_eventname_listener)
###### functions
- **on** *register an event*
- **off** *deregister an event*
- **once** *once an event*

###### parameter
- **eventName** *an API with 'NTF' or an item from the list below*
- **listener** *the function which is called if an event is emitted*

When a notification arrives, the emitter is called once with 'NTF' and once with the API name. This allows you to react to each notification separately.
###### current list of notifications
- **NTF** *notification arrived*
- **notPending** *a confirm has arrived that could not be assigned to a message*
- **timeout** *the socket reports a timeout in the connection*
- **error** *the socket reports an error in the connection*
- **GW_ERROR_NTF** *Provides information on what triggered the error.*
- **GW_CS_GET_SYSTEMTABLE_DATA_NTF** *Acknowledge to GW_CS_GET_SYSTEM_TABLE_DATA_REQList of nodes in the gateways systemtable.*
- **GW_CS_DISCOVER_NODES_NTF** *Acknowledge to GW_CS_DISCOVER_NODES_REQ command.*
- **GW_CS_CONTROLLER_COPY_NTF** *Acknowledge to GW_CS_CONTROLLER_COPY_REQ.*
- **GW_CS_CONTROLLER_COPY_CANCEL_NTF** *Cancellation of system copy to other controllers.*
- **GW_CS_RECEIVE_KEY_NTF** *Acknowledge to GW_CS_RECEIVE_KEY_REQ with status.*
- **GW_CS_PGC_JOB_NTF** *Information on Product Generic Configuration job initiated by press on PGC button.*
- **GW_CS_SYSTEM_TABLE_UPDATE_NTF** *Broadcasted to all clients and gives information about added and removed actuator nodes in system table.*
- **GW_CS_GENERATE_NEW_KEY_NTF** *Acknowledge to GW_CS_GENERATE_NEW_KEY_REQ with status.*
- **GW_CS_REPAIR_KEY_NTF** *Acknowledge to GW_CS_REPAIR_KEY_REQ with status.*
- **GW_GET_NODE_INFORMATION_NTF** *Acknowledge to GW_GET_NODE_INFORMATION_REQ.*
- **GW_GET_ALL_NODES_INFORMATION_NTF** *Acknowledge to GW_GET_ALL_NODES_INFORMATION_REQ. Holds node information*
- **GW_GET_ALL_NODES_INFORMATION_FINISHED_NTF** *Acknowledge to GW_GET_ALL_NODES_INFORMATION_REQ. No more nodes.*
- **GW_NODE_INFORMATION_CHANGED_NTF** *Information has been updated.*
- **GW_NODE_STATE_POSITION_CHANGED_NTF** *Information has been updated.*
- **GW_GET_GROUP_INFORMATION_NTF** *Acknowledge to GW_GET_NODE_INFORMATION_REQ.*
- **GW_GROUP_INFORMATION_CHANGED_NTF** *Broadcast to all, about group information of a group has been changed.*
- **GW_GET_ALL_GROUPS_INFORMATION_NTF** *Acknowledge to GW_GET_ALL_GROUPS_INFORMATION_REQ.*
- **GW_GET_ALL_GROUPS_INFORMATION_FINISHED_NTF** *Acknowledge to GW_GET_ALL_GROUPS_INFORMATION_REQ.*
- **GW_GROUP_DELETED_NTF** *GW_GROUP_DELETED_NTF is broadcasted to all, when a group has been removed.*
- **GW_COMMAND_RUN_STATUS_NTF** *Gives run status for io-homecontrol® node.*
- **GW_COMMAND_REMAINING_TIME_NTF** *Gives remaining time before io-homecontrol® node enter target position.*
- **GW_SESSION_FINISHED_NTF** *Command send, Status request, Wink, Mode or Stop session is finished.*
- **GW_STATUS_REQUEST_NTF** *Acknowledge to GW_STATUS_REQUEST_REQ. Status request from one or more io-homecontrol® nodes.*
- **GW_WINK_SEND_NTF** *Status info for performed wink request.*
- **GW_LIMITATION_STATUS_NTF** *Hold information about limitation.*
- **GW_MODE_SEND_NTF** *Notify with Mode activation info.*
- **GW_INITIALIZE_SCENE_NTF** *Acknowledge to GW_INITIALIZE_SCENE_REQ.*
- **GW_RECORD_SCENE_NTF** *Acknowledge to GW_RECORD_SCENE_REQ.*
- **GW_GET_SCENE_LIST_NTF** *Acknowledge to GW_GET_SCENE_LIST.*
- **GW_GET_SCENE_INFOAMATION_NTF** *Acknowledge to GW_GET_SCENE_INFOAMATION_REQ.*
- **GW_SCENE_INFORMATION_CHANGED_NTF** *A scene has either been changed or removed.*
- **GW_ACTIVATE_PRODUCTGROUP_NTF** *Acknowledge to GW_ACTIVATE_PRODUCTGROUP_REQ.*
- **GW_ACTIVATION_LOG_UPDATED_NTF** *Confirm line from activation log.*
- **GW_GET_MULTIPLE_ACTIVATION_LOG_LINES_NTF** *Error log data from activation log.*
- **GW_PASSWORD_CHANGE_NTF** *Acknowledge to GW_PASSWORD_CHANGE_REQ. Broadcasted to all connected clients.*
see examples below
---
# examples

### Lists all nodes
``` javascript
'use strict'
const velux = require('velux-klf200-api')

velux.on('NTF',(data)=>{
  console.log(data)
})

velux.connect('192.168.2.15',{})
.then(()=>{
  return velux.login('<some password>')
})
.then((data)=>{
  return velux.sendCommand({ api: velux.API.GW_GET_ALL_NODES_INFORMATION_REQ })
})
.then((data)=>{
  console.log(data)
})
.catch((err)=>{
  console.log(err)
  return velux.end()
})
```

### Let a shutter with node ID 0 wink
``` javascript
'use strict'
const velux = require('velux-klf200-api')

velux.connect('192.168.2.15',{})
.then(()=>{
  return velux.login('<some password>')
})
.then((data)=>{
  return velux.sendCommand({ api: velux.API.GW_WINK_SEND_REQ,
      commandOriginator: 1,
      priorityLevel: 2,
      winkStat: true,
      winkTime: 10,
      indexArrayCount: 1,
      indexArray: [0]
  })
})
.then((data)=>{
  console.log(data)
})
.catch((err)=>{
  console.log(err)
  return velux.end()
})
```

### Moves a shutter with node ID 0 to 100%
``` javascript
'use strict'
const velux = require('velux-klf200-api')

velux.connect('192.168.2.15',{})
.then(()=>{
  return velux.login('<some password>')
})
.then((data)=>{
  return velux.sendCommand({ api: velux.API.GW_COMMAND_SEND_REQ,
      commandOriginator: 1,
      priorityLevel: 2,
      parameterActive: 0,
      functionalParameterMPValue: {valueType:'RELATIVE', value:100),
      /* functionalParameterMPValue: 100, */
      indexArrayCount: 1,
      indexArray: [0],
      priorityLevelLock: false,
      lockTime: 0
  })
})
.then((data)=>{
  console.log(data)
})
.catch((err)=>{
  console.log(err)
  return velux.end()
})
```

## The value Object
The value is an Object, you can set the value to an explicit position or to an calculated position. when you set the value you can use either **rawValue** or **value** and **valueType**.
It's also possible to use an number instead an Object. Then the API use **Relative**.
- **rawValue** is the value as is.
- **value** is the calculated float value.
- **valueType** is then kind of the value. have a look: 'Access Method name for Standard Parameter'

```
Access Method name for |Description                                   |Range (Hex)   |Size (Dec)
Standard Parameter     |                                              |              |

Relative               |Relative value (0 – 100%)                     |0x0000–0xC800 |51201
Relative               |No feed-back value known                      |0xF7FF        |1
Percent+-              |Percentage point plus or minus (-100% – 100%) |0xC900-0xD0D0 |2001
Target                 |The target value for the parameter            |0xD100        |1
Current                |The current value for the parameter           |0xD200        |1
Default                |The default value for the parameter           |0xD300        |1
Ignore                 |Ignore the parameter field where this         |0xD400        |1
                       |Access Method is written                      |              |
```


License (MIT)
-------------
Copyright (c) 2018 Chris Traeger

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
