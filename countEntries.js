const fs = require('fs');
const file = process.argv[2];
const urls = JSON.parse(fs.readFileSync(file));
const distinctUrls = new Set();
urls.forEach(({ url }) => {
  distinctUrls.add(url);
});
console.log(urls.length, distinctUrls.size);
