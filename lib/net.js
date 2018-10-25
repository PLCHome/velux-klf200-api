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

const Tls = require('tls');
const Slip = require('./slip');
const Buffer = require('safe-buffer').Buffer


exports.connect = function(host, cb){
  var velux = this
  
  const options = {
    rejectUnauthorized: false
  };
  
  velux.tcpClient = Tls.connect(
    51200,
    host,
    options,
    function () {
      cb()
    }
  )

  velux.tcpClient.on('data', function (data) {
    console.log(data.toString('HEX'))
  })
  
  console.log('top')
}

exports.sendCommandFrame = function(command, data , datalen, cb){
  var velux = this

  cmd = new Buffer(datalen+5)
  cmd.fill(0)
  cmd.writeUInt8(cmd.length-2,1)
  cmd.writeUInt16BE(command,2)
  data.copy(cmd,4,0)
  cs = cmd[0]
  for (var i=1; i<cmd.length-1; i++) {
    cs ^= cmd[i]
  }
  cmd.writeUInt8(cs&0xFF,cmd.length-1)
  Slip.pack(cmd,function(buf,e) {
    if (e) {
      console.log(e)
    } else {
      console.log(buf.toString('HEX'))
      velux.tcpClient.write(buf)
    }
  })
}