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


const getPosition = function (buf, offset) {
  var position = buf.readUInt8(offset)
  var second = buf.readUInt8(offset+1)
  if (second!=255) {
    return position/2
  } else {
    return null
  }
}
exports.getPosition = getPosition

const calcPosition = function (value) {
  if (typeof value === 'undefined' ||
      value < 0 || value > 100) {
    return 0xF7FF
  }
  return Math.round(value*2)<<8
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


