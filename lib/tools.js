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
const Klf = require('./klf')


const setCMD = function (data) {
  var api = nameFromId(data.api,Klf.API)
  var databuf = Klf.APIData[api](data)
  var length = !(databuf)?0:databuf.length
  var cmd = new Buffer(length+5)
  if (databuf) {
    databuf.copy(cmd,4,0)
  }
  cmd.writeUInt8(0x00&&0xFF,0)
  cmd.writeUInt8(cmd.length-2,1)
  cmd.writeUInt16BE(data.api,2)
  var cs = cmd[0]
  for (var i=1; i<cmd.length-1; i++) {
    cs ^= cmd[i]
  }
  cmd.writeUInt8(cs&0xFF,cmd.length-1)
  return cmd
}
exports.setCMD = setCMD


const getCMD = function (cmd) {
  console.log(cmd.toString('hex'))
  var data = {}
  if (cmd.length > 4) {
    var cs = cmd[0]
    for (var i=1; i<cmd.length-1; i++) {
      cs ^= cmd[i]
    }
    data.id = cmd.readUInt8(0)
    var length = cmd.readUInt8(1)
    data.api = cmd.readUInt16BE(2)
    data.apiText = nameFromId(data.api,Klf.API)
    console.log(data)
    
    if ((cmd[cmd.length-1] == (cs&0xFF)) && (cmd.length > 5) && Klf.APIData[data.apiText]) {
      var d = Klf.APIData[data.apiText](cmd.slice(4,cmd.length-1))
      data = Object.assign(data,d)
    }
  }
  return data
}
exports.getCMD = getCMD


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
  console.log('set string:',helpBuf)
  helpBuf.copy(buf,offset,0,length)
  console.log('set string:',buf)
}
exports.setString = setString


const nameFromId = function(id, type) {
  var name
  Object.keys(type).map(function(key){if (type[key]==id) name=key})
  return name
}
exports.nameFromId = nameFromId
