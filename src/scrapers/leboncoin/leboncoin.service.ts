// import { Injectable } from '@nestjs/common';
// import * as puppeteer from 'puppeteer';

// @Injectable()
// export class LeboncoinService {
//   async scrapeCars(): Promise<any> {
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();

//     // Navigate to the LeBonCoin automobiles section
//     await page.goto('https://www.leboncoin.fr/_vehicules_/offres', {
//       waitUntil: 'networkidle2',
//     });

//     // Scrape the data you need (this is an example and may need to be adjusted based on the website's structure)
//     const cars = await page.evaluate(() => {
//       const carElements = document.querySelectorAll('.styles_adCard__2YFTa'); // Change this selector based on actual site structure
//       const carData = [];

//       carElements.forEach((carElement) => {
//         const title = carElement
//           .querySelector('.styles_adTitle__1eFnX')
//           .textContent.trim();
//         const price = carElement
//           .querySelector('.styles_adPrice__1fZIT')
//           .textContent.trim();
//         const link = carElement.querySelector('a').href;

//         carData.push({ title, price, link });
//       });

//       return carData;
//     });

//     await browser.close();
//     return cars;
//   }
// }
// import { Injectable } from '@nestjs/common';
// import axios from 'axios';
// import * as cheerio from 'cheerio';

// @Injectable()
// export class LeboncoinService {
//   async scrapeCars(): Promise<any> {
//     const url = 'https://www.leboncoin.fr/_vehicules_/offres';

//     const headers = {
//       'User-Agent':
//         'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36',
//       'Accept-Language': 'en-US,en;q=0.9',
//       'Accept-Encoding': 'gzip, deflate, br',
//       Referer: 'https://www.google.com/',
//       Connection: 'keep-alive',
//       Accept:
//         'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
//       'Upgrade-Insecure-Requests': '1',
//     };

//     try {
//       // Fetch the HTML of the page
//       const { data } = await axios.get(url, { headers });

//       // Load the HTML into Cheerio
//       const $ = cheerio.load(data);

//       // Scrape the data you need
//       const cars = [];
//       $('.styles_adCard__2YFTa').each((index, element) => {
//         const title = $(element).find('.styles_adTitle__1eFnX').text().trim();
//         const price = $(element).find('.styles_adPrice__1fZIT').text().trim();
//         const link = $(element).find('a').attr('href');

//         cars.push({ title, price, link: `https://www.leboncoin.fr${link}` });
//       });

//       return cars;
//     } catch (error) {
//       console.error('Error fetching data:', error);
//       throw new Error('Failed to fetch data');
//     }
//   }
// }
import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';

@Injectable()
export class LeboncoinService {
  async scrapeCars(): Promise<any> {
    const url =
      'https://www.leboncoin.fr/recherche?category=9&locations=r_12&real_estate_type=1%2C2';
    // const url = 'https://www.leboncoin.fr/_vehicules_/offres';
    let browser;
    try {
      browser = await puppeteer.launch({
        headless: true, // Set to false if you want to see the browser for debugging
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--disable-gpu',
          '--window-size=1920x1080',
          '--ignore-certificate-errors',
          '--ignore-certificate-errors-spki-list',
        ],
      });

      const page = await browser.newPage();

      // Set User-Agent and other headers
      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36',
      );

      await page.setViewport({ width: 1366, height: 768 });

      // Navigate to the page
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

      // Debug: Log the HTML content
      const content = await page.content();
      console.log(content);

      // Wait for the necessary DOM to be rendered
      await page.waitForSelector('.styles_adCard__JzKik', { timeout: 60000 });

      // Scrape the data you need
      const cars = await page.evaluate(() => {
        const carElements = document.querySelectorAll('.styles_adCard__JzKik');
        const carData = [];

        carElements.forEach((carElement) => {
          const titleElement = carElement.querySelector('a[data-test-id="ad"]');
          const priceElement = carElement.querySelector('.adcard_9ec456820');
          const linkElement = carElement.querySelector('a[data-test-id="ad"]');

          const title = titleElement ? titleElement.textContent.trim() : null;
          const price = priceElement ? priceElement.textContent.trim() : null;
          const link = linkElement
            ? (linkElement as HTMLAnchorElement).href
            : null;

          if (title && price && link) {
            carData.push({ title, price, link });
          }
        });

        return carData;
      });

      return cars;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw new Error('Failed to fetch data');
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }
}
