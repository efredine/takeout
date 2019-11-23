const puppeteer = require('puppeteer');
const fs = require('fs');

const file = process.argv[2];
const offset = parseInt(process.argv[3]);
const limit = parseInt(process.argv[4]);
const urls = JSON.parse(fs.readFileSync(file));
console.warn(`${urls.length} urls`);

const getPage = url => {
  return new Promise(async (resolve, reject) => {
    let browser;
    try {
      browser = await puppeteer.launch();
      const page = await browser.newPage();
      const response = await page.goto(url);
      const status = response.status();
      if (status != 200) {
        return reject(`${url} ${status}.`);
      }
      let content = await page.evaluate(() => {
        return {
          content: document.documentElement.innerText,
          title: document.title,
          url: window.location.href,
        };
      });
      return resolve(content);
    } catch (e) {
      return reject(e);
    } finally {
      if (browser) {
        browser.close();
      }
    }
  });
};

const getPages = (urls, offset, limit) => {
  const pages = [];
  return new Promise(async (resolve, reject) => {
    for (const { url, date } of urls.slice(offset, offset + limit)) {
      try {
        console.warn(`fetching ${url}`);
        const { content, title } = await getPage(url);
        if (content) {
          pages.push({ content, title, url, date });
        } else {
          console.error(JSON.stringify({ content, title, url }, null, 2));
        }
      } catch (e) {
        console.error(e);
      }
    }
    return resolve(pages);
  });
};

getPages(urls, offset, limit)
  .then(pages => {
    console.log(JSON.stringify(pages, null, 2));
  })
  .catch(console.error);
