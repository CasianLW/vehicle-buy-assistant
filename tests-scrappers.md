tests effectuées avec:

- scraperapi.com 's api with anti bot bypass
- npm package leboncoin-api-search
- npm leboncoin-api (https://durieux.me/projects/leboncoin.html)
- puppeteer scrapper (by translating html page in json)
- cheerio scrapper

Conclusion:
Tests on front scrappers: blocked by website
Tests directlly on api: captcha protection at best

{
"url": "https://geo.captcha-delivery.com/captcha/?initialCid=AHrlqAAAAAMALZjQp-hKbVYAAgSwuQ==&cid=2KPcewKnzqwrQbN48Ml_FATeusPZr_EIEGjy64bMCPvnRac3ZO0HPAEoM_Y9RWGGJ4H7BfmXchNKXWliGjExg745kZ_vbi0rfUOKn8GTDqQJGpFr_zm6OQ2_k6mqKcm~&referer=http%3A%2F%2Fapi.leboncoin.fr%2Ffinder%2Fsearch&hash=05B30BD9055986BD2EE8F5A199D973&t=fe&s=332&e=d807bfbe6ef0056e650dad25593314a2f2c6ed74e93e81536fc6428ba25028e4"
}
