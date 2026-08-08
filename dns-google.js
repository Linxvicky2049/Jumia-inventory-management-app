const dns = require("dns");

dns.resolveSrv("_xmpp-server._tcp.google.com", (err, records) => {
  console.log(err || records);
});