// Generated by CoffeeScript 1.7.1
(function() {
  var crypto, os, zmq;

  crypto = require('crypto');

  os = require('os');

  zmq = require('zmq');

  exports.get_random = function() {
    return crypto.randomBytes(20).toString('hex');
  };

  exports.list_local_ips = function() {
    var a, addrs, iface_name, ips, _i, _len, _ref;
    ips = [];
    _ref = os.networkInterfaces();
    for (iface_name in _ref) {
      addrs = _ref[iface_name];
      if (/VMware/.test(iface_name)) {
        continue;
      }
      for (_i = 0, _len = addrs.length; _i < _len; _i++) {
        a = addrs[_i];
        if (!a.internal && a.family === 'IPv4') {
          ips.push(a.address);
        }
      }
    }
    return ips;
  };

  exports.get_local_endpoint = function(sock) {
    var addr, ip;
    addr = sock.getsockopt(zmq.ZMQ_LAST_ENDPOINT);
    if (addr.indexOf('tcp://') !== 0) {
      return addr;
    }
    ip = this.list_local_ips()[0];
    return addr.replace(/0\.0\.0\.0/, "" + ip);
  };

  exports.get_port = function(addr) {
    var m;
    m = addr.match(/tcp:\/\/[\d.]+:(\d+)\/?/);
    if (m) {
      return Number(m[1]);
    } else {
      return -1;
    }
  };

  exports.bindAndGetAddr = function(sock_type, addr) {
    var port, sock;
    sock = zmq.socket(sock_type);
    sock.bindSync(addr);
    addr = sock.getsockopt(zmq.ZMQ_LAST_ENDPOINT);
    port = exports.get_port(addr);
    return [sock, addr, port];
  };

}).call(this);
