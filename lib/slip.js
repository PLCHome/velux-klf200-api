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

const END     = 0xC0    // SLIP escape character as per RFC 1055
const ESC     = 0xDB    // SLIP escape character as per RFC 1055
const ESC_END = 0xDC    // SLIP escape character as per RFC 1055
const ESC_ESC = 0xDD    // SLIP escape character as per RFC 1055


exports.pack = function(inputFrame, cb) {
  var data = Buffer.from(inputFrame)
  var blen = data.length+2
  for (var i = 0; i<data.length; i++) {
    var d=data[i]
    if (d == END || d == ESC) {
      blen++
    }
  }
  
  var outdata = new Buffer(blen)
  var pos = 0
  outdata[pos++] = END
  for (var i = 0; i<data.length; i++) {
    var d=data[i]
    if (d == END) {
      outdata[pos++]=ESC
      outdata[pos++]=ESC_END
    } else if (d == ESC) {
      outdata[pos++]=d
      outdata[pos++]=ESC_ESC
    } else {
      outdata[pos++]=d
    }
  }
  outdata[pos++] = END
  
  cb (outdata)
}

exports.unpack = function(inputFrame, cb) {
  var data = Buffer.from(inputFrame)
  if (data[0] != END) {
    var error = new Error('no END at the beginning')
    cb(null, error)
    return
  }
  if (data[data.length-1] != END) {
    var error = new Error('no END at the end')
    cb(null, error)
    return
  }
  
  var pos = 0
  for (var i = 1; i<data.length-1; i++) {
    data[pos]=data[i]
    if (data[i] == END) {
      var error = new Error('END in stream at postition'+i)
      cb(null, error)
      return
    }
    if (data[i] == ESC && data[i+1] == ESC_ESC) {
      i++
    }
    if (data[i] == ESC && data[i+1] == ESC_END) {
      i++
      data[pos]=END
    }
    pos++
  }
  
  cb(data.slice(0,pos))
}

