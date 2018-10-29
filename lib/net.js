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
//const Promise = require('promise');
const debug = require('debug')('velux-klf200-api:net')

var velux = {}
velux.pending = {}

exports.connect = function(host,cb){
  //return new Promise(function (resolve, reject){
    
    const options = {
      rejectUnauthorized: false
    };
    
    velux.tcpClient = Tls.connect(
      51200,
      host,
      options,
      function () {
        cb()
        //resolve()
      }
    )
    
    velux.tcpClient.setNoDelay(true)

    velux.dataListener = function (data) {
      Slip.unpack(data, function(buf,e) {
        analyse_CFM(Tools.getCMD(buf));
      })
    }

    velux.tcpClient.on('data', velux.dataListener)

    velux.tcpClient.on('timeout', function (data) {
      velux.tcpClient.end()
      //reject()
    })

    velux.dataCallback = function (data) {
      velux.tcpClient.end()
      //reject()
    }

    velux.tcpClient.on('error', velux.dataCallback)
    
  //})
}

function add_CFM(data,resolve, reject) {
  var apiText = Tools.nameFromId(data.api,Klf.API).replace(/REQ$/,'CFM')
  var api =  Klf.API[apiText]
  velux.pending[apiText] = {resolve: resolve, 
                             reject: reject,
                              'api': api,
                            timeout: setTimeout(function () {
                                     console.log('timeout')
                                     delete velux.pending[apiText]
                                     reject()
                            }.bind(this), 5000)}
}

function analyse_CFM(data){
  if (data.api && velux.pending[data.apiText]) {
    var pending = velux.pending[data.apiText]
    clearTimeout(pending.timeout)
    delete velux.pending[data.apiText]
    pending.resolve(data)
  } else {
    console.log(data)
  }
}

exports.sendCommandFrame = function(data,cb){
  //return new Promise(function (resolve, reject){
    //var velux = this
    var cmd = Tools.setCMD(data)
    Slip.pack(cmd,function(buf,e) {
    console.log(buf)
      if (e) {
        return reject(e)
      } else {
        console.log(buf.toString('HEX'))
        velux.tcpClient.write(buf)
        //add_CFM(data ,resolve, reject)
        add_CFM(data ,cb, cb)
      }
    })
  //})
}

exports.end = function () {
  //return new Promise(function (resolve, reject){
    velux.tcpClient.removeListener('data', velux.dataListener)
    velux.tcpClient.removeListener('error', velux.dataCallback)
    if (velux.tcpClient) {
          velux.tcpClient.destroy()
    }
    //resolve()
    //cb()
  //})
}
