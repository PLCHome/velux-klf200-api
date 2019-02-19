// Copyright (c) 2018 Träger

// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the "Software"),
// to deal in the Software without restriction, including without limitation
// the rights to use, copy, modify, merge, publish, distribute, sublicense,
// and/or sell copies of the Software, and to permit persons to whom the
// Software is furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
// ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
// DEALINGS IN THE SOFTWARE.

'use strict'

const Buffer = require('safe-buffer').Buffer
const debug = require('debug')('velux-klf200-api:tools')

const myPromise = function(cb,func){
  if (typeof cb === 'function') {
    return func(function(res) {cb(null,res)},function(err) {cb(err)})
  } else {
    return new Promise(func)
  }
}
exports.myPromise = myPromise

const findStringEnd = function (buf, offset, length) {
  if (!offset) { offset = 0 }
  if (!length) { length = buf.length }
  var endpos = offset+length
  for (var i = offset; i < buf.length && i<endpos; i++) {
    if (buf[i] === 0x00) {
      endpos = i
      break
    }
  }
  return endpos
}


const getString = function (buf, offset, length, type) {
  if (!offset) { offset = 0 }
  if (!length) { length = buf.length }
  if (!type) { type = 'binary' }
  return buf.toString(type, offset, findStringEnd(buf, offset, length))
}
exports.getString = getString


const setString = function (string, buf, offset, length, type) {
  if (!offset) { offset = 0 }
  if (!length) { length = buf.length }
  if (!type) { type = 'binary' }
  buf.fill(0,offset,length)
  var helpBuf = new Buffer(string,type)
  helpBuf.copy(buf,offset,0,length)
}
exports.setString = setString


const nameFromId = function(id, type) {
  var name
  Object.keys(type).map(function(key){if (type[key]==id) name=key})
  return name
}
exports.nameFromId = nameFromId


/* 
Access Method name for |Description                                   |Range (Hex)   |Size (Dec)
Standard Parameter     |                                              |              |

RELATIVE               |Relative value (0 – 100%)                     |0x0000–0xC800 |51201
RELATIVE               |No feed-back value known                      |0xF7FF        |1
PERCENT_PM             |Percentage point plus or minus (-100% – 100%) |0xC900-0xD0D0 |2001
TARGET                 |The target value for the parameter            |0xD100        |1
CURRENT                |The current value for the parameter           |0xD200        |1
DEFAULT                |The default value for the parameter           |0xD300        |1
IGNORE                 |Ignore the parameter field where this         |0xD400        |1
                       |Access Method is written                      |              |

*/
const getPosition = function (stateValue) {
  var result = {rawValue: stateValue, value: null, valueType: 'UNKNOWN'}
  if (stateValue >= 0x0000 && stateValue <= 0xC800) {
    result.value=stateValue/512
    result.valueType='RELATIVE'
  } else if (stateValue == 0xF7FF) {
    result.value=null
    result.valueType='RELATIVE'
  } else if (stateValue >= 0xC900 && stateValue <= 0xD0D0) {
    result.value=((stateValue-0xC900)/20)-100
    result.valueType='PERCENT_PM'
  } else if (stateValue == 0xD100) {
    result.value=null
    result.valueType='TARGET'
  } else if (stateValue == 0xD200) {
    result.value=null
    result.valueType='CURRENT'
  } else if (stateValue == 0xD300) {
    result.value=null
    result.valueType='DEFAULT'
  } else if (stateValue == 0xD400) {
    result.value=null
    result.valueType='IGNORE'
  }
  return result
}
exports.getPosition = getPosition


const calcPosition = function (value) {
  debug('calcPosition:',value)
  if (typeof value === 'object') {
    debug('calcPosition: object:',value)
    if (typeof value.rawValue !== 'undefined') {
      return value.rawValue
    } else if (value.valueType=='RELATIVE' && value.value !== null) {
      if (value.value<0) {
        value.value = 0
      } else if (value.value>100){
        value.value = 100
      }
      return Math.round(value.value*512)
    } else if (value.valueType=='RELATIVE') {
      return 0xF7FF
    } else if (value.valueType=='PERCENT_PM') {
      if (value.value<-100) {
        value.value = -100
      } else if (value.value>100){
        value.value = 100
      }
      return Math.round(((value.value+100)*10)+0xC900)
      
    } else if (value.valueType=='TARGET') {
      return 0xD100
    } else if (value.valueType=='CURRENT') {
      return 0xD200
    } else if (value.valueType=='DEFAULT') {
      return 0xD300
    } else if (value.valueType=='IGNORE') {
      return 0xD400
    }
  } else if (typeof value === 'undefined') {
    return 0xF7FF
  } else {
    if (value<0) {
      value = 0
    } else if (value>100){
      value = 100
    }
    debug('calcPosition: else:',value)
    return Math.round(value*512)
  }
}
exports.calcPosition = calcPosition

const getActuator = function (buf, offset) {
  var index = offset
  var actuator = []
  for (var i = 0;i<25;i++){
    var by = buf.readUInt8(index++)
    for (var a = 0;a<8;a++){
      actuator[i*8+a] = !(!(by&0x01))
      by>>=1
    }
  }
  return actuator
}
exports.getActuator = getActuator

const setActuator = function (actuator, buf, offset) {
  var index = offset
  for (var i = 0;i<25;i++){
    var by = 0
    for (var a = 0;a<8;a++){
      if (actuator[i*8+a]){
        by+=(1<<a)
      }
    }
    buf.writeUInt8(by,index++)
  }
}
exports.setActuator = setActuator

const getBeacon = function (buf, offset) {
  var beacon = []
  var by = buf.readUInt8(offset)
  for (var a = 0;a<3;a++){
    beacon[a] = !(!(by&0x01))
    by>>=1
  }
  return beacon
}
exports.getBeacon = getBeacon

const setBeacon = function (beacon, buf, offset) {
    var by = 0
    for (var a = 0;a<3;a++){
      if (beacon[a]){
        by+=(1<<a)
      }
    }
    buf.writeUInt8(by,offset)
}
exports.setBeacon = setBeacon

var sessionID = 1
const getSessionID = function(extSessionID) {
  if (typeof extSessionID === 'undefined') {
    return (sessionID++ & 0xFFFF)
  } else {
    return (extSessionID & 0xFFFF)
  }
}
exports.getSessionID = getSessionID

const utcToLocalTimestamp = function(utc) {
  var datetime = new Date(utc)
  var timeoffset = datetime.getTimezoneOffset()
  datetime.setMinutes(datetime.getMinutes() - timeoffset)
  return datetime
}
exports.utcToLocalTimestamp = utcToLocalTimestamp

const localToUtcTimestamp = function(local) {
  var utcTimeStamp = new Date(local)
  var timeoffset = utcTimeStamp.getTimezoneOffset()
  utcTimeStamp = new Date(utcTimeStamp.setMinutes(utcTimeStamp.getMinutes() + timeoffset))
  return utcTimeStamp
}
exports.localToUtcTimestamp = localToUtcTimestamp
