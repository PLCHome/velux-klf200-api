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

const Tls = require('tls');
const Slip = require('./slip');
const Klf = require('./klf');
const Tools = require('./tools')
const Buffer = require('safe-buffer').Buffer
const debug = require('debug')('velux-klf200-api:net')

const events = require('events');
const eventEmitter = new events.EventEmitter(); 

var velux = this
this.API = Klf.API
this.pending = []

const on = function (a,b){
  eventEmitter.on(a,b)
}
exports.on = on

const off = function (a,b){
  eventEmitter.removeListener(a,b)
}
exports.off = off
exports.removeListener = off

const once = function (a,b){
  eventEmitter.once(a,b)
}
exports.once = once

const setCMD = function (data) {
  debug('setCMD', 'call', data)
  if (typeof data.apiText !== 'undefined') {
    var api = data.apiText
  } else {
    var api = Tools.nameFromId(data.api,velux.API)
  }
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
  debug('setCMD', cmd.length, ':', cmd.toString('hex'))
  return cmd
}

const getCMD = function (cmd) {
  debug('getCMD', 'call', cmd.length, ':', cmd.toString('hex'))
  var data = {}
  if (cmd.length > 4) {
    var cs = cmd[0]
    for (var i=1; i<cmd.length-1; i++) {
      cs ^= cmd[i]
    }
    data.id = cmd.readUInt8(0)
    var length = cmd.readUInt8(1)
    data.api = cmd.readUInt16BE(2)
    data.apiText = Tools.nameFromId(data.api,velux.API)
    
    if ((cmd[cmd.length-1] == (cs&0xFF)) && (cmd.length > 5) && Klf.APIData[data.apiText]) {
      var d = Klf.APIData[data.apiText](cmd.slice(4,cmd.length-1))
      data = Object.assign(data,d)
    }
  }
  debug('getCMD', data)
  return data
}


const connect = function(host, options ,cb){
  debug('connect', 'call', host, options, 'cb '+!(!(cb)))
  return Tools.myPromise(cb, function (resolve, reject){
    
    const options = {
      rejectUnauthorized: false
    };
    
    velux.tcpClient = Tls.connect(
      51200,
      host,
      options,
      function () {
        debug('connect', 'connected')
        resolve()
      }
    )
    
    velux.tcpClient.setNoDelay(true)

    velux.dataListener = function (buffer) {
      debug('connect', 'dataListener', buffer.length, ':', buffer.toString('hex'))
      Slip.unpack(buffer)
      .then((buf) => {
        var data = getCMD(buf)
        if (data.apiText.endsWith('NTF')){
          debug('connect', 'dataListener', 'NTF', data)
          eventEmitter.emit('NTF',data)
          eventEmitter.emit(data.apiText,data)
        } else {
          analyse_CFM(data)
        }
      }).catch((err) => {
        debug('connect', 'dataListener', err)
      })
    }

    velux.tcpClient.on('data', velux.dataListener)

    velux.errorTimeout = function (data) {
      eventEmitter.emit('timeout',data)
      velux.tcpClient.end()
      var error = new Error('tcp timeout'+data)
      debug('connect', error)
      return reject(error)
    }
    velux.tcpClient.on('timeout', velux.errorTimeout)

    velux.errorCallback = function (data) {
      eventEmitter.emit('err',data)
      velux.tcpClient.end()
      var error = new Error('tcp error'+data)
      debug('connect', error)
      return reject(error)
    }

    velux.tcpClient.on('error', velux.errorCallback)
    
  })
}
exports.connect = connect

const add_CFM = function (data, resolve, reject) {
  var apiText = Tools.nameFromId(data.api,velux.API).replace(/REQ$/,'CFM')
  var api =  velux.API[apiText]
  velux.pending[apiText] = {
    'resolve': resolve, 
    'reject': reject,
    'api': api,
    'timeout': setTimeout(function () {
      var error = new Error('timeout '+apiText)
      delete velux.pending[apiText]
      debug('add_CFM', error)
      return reject(error)
    }.bind(velux), 5000)
  }
}

const analyse_CFM = function (data){
  if (data.api && velux.pending[data.apiText]) {
    debug('analyse_CFM', 'api pending')
    var pending = velux.pending[data.apiText]
    clearTimeout(pending.timeout)
    delete velux.pending[data.apiText]
    return pending.resolve(data)
  } else {
    debug('analyse_CFM', 'api not pending', data)
    eventEmitter.emit('NotPending',data)
  }
}

const sendCommand = function(data, cb){
  debug('sendCommand', 'call', data, 'cb '+!(!(cb)))
  return Tools.myPromise(cb, function (resolve, reject){
    var cmd = setCMD(data)
    Slip.pack(cmd)
    .then((buf) => {
      add_CFM(data ,resolve, reject)
      var ok = velux.tcpClient.write(buf)
      debug('sendCommand', 'write completed', ok, 'data', buf.length, ':', buf.toString('hex'))
    }).catch((err)=>{
      debug('sendCommand', err)
      return reject(err)
    })
  })
}
exports.sendCommand = sendCommand

const login = function(password, cb){
  debug('login', 'call', password, 'cb '+!(!(cb)))
  return Tools.myPromise(cb, function (resolve, reject){
    sendCommand({ 'api': velux.API.GW_PASSWORD_ENTER_REQ,
                  'password': password})
    .then((data)=>{ 
      if (data.status) {
        debug('login', 'login successful')
        resolve(true)
      } else {
        var error = new Error('refuse login')
        reject(error)
      }})
    .catch((err)=>{
        debug('login', err)
        reject(err)
      })
  })
}
exports.login = login

const end = function (cb) {
  debug('end', 'call', 'cb '+!(!(cb)))
  return Tools.myPromise(cb, function (resolve, reject){
    velux.tcpClient.removeListener('data', velux.dataListener)
    velux.tcpClient.removeListener('error', velux.errorCallback)
    if (velux.tcpClient) {
      velux.tcpClient.destroy()
    }
    return resolve(true)
  })
}
exports.end = end
