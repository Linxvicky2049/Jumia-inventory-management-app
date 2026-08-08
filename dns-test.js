const dns = require("dns");

dns.resolveSrv("_mongodb._tcp.blacksun.icvryh3.mongodb.net", (err, records) => {
  if (err) {
    console.error("DNS Error:", err);
  } else {
    console.log(records);
  }
});