import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';
const userAgents = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Safari/605.1.15',
  'Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko',
  // Add more User-Agents here
];
@Injectable()
export class MobiledeCarsService {
  private readonly baseUrl = 'https://www.automobile.fr/voiture/';

  async fetchCars(
    make: string,
    model: string,
    year: string,
    filters: any = {},
  ): Promise<any> {
    // Ensure required parameters are present
    if (!make || !model || !year) {
      throw new BadRequestException(
        'Make, model, and year are required parameters.',
      );
    }

    // Construct the base URL with make, model, and default filters
    let url = `${this.baseUrl}${make}-${model}/vhc:car,`;

    const defaultFilters = {
      srt: 'price',
      sro: 'asc',
      dmg: 'false',
      frn: year,
      ...filters,
    };

    const filterParams = Object.entries(defaultFilters)
      .map(([key, value]) => `${key}:${value}`)
      .join(',');

    url += filterParams;

    const headers = {
      'User-Agent': userAgents[Math.floor(Math.random() * userAgents.length)],
      // 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      Connection: 'keep-alive',
    };

    try {
      console.log('Requesting URL:', url);
      const response = await axios.get(url, { headers });
      const html = response.data;
      console.log('response received:', response);
      console.log('HTML received:', html);

      const $ = cheerio.load(html);

      const cars = [];

      $('.list-entry').each((index, element) => {
        const title = $(element).find('.vehicle-title').first().text().trim();
        const price = $(element).find('.seller-currency').first().text().trim();
        const details = $(element)
          .find('.vehicle-information p')
          .map((i, el) => $(el).text().trim())
          .get()
          .join(', ');
        const location = $(element)
          .find('.mde-icon-flag')
          .parent()
          .text()
          .trim();
        const imgSrc = $(element).find('img.img-lazy').attr('src');
        const href = $(element).find('a.vehicle-data').attr('href');

        const fullImgSrc = imgSrc
          ? `https://img.classistatic.de${imgSrc}`
          : null;
        const fullHref = href ? `https://www.automobile.fr${href}` : null;

        cars.push({
          title,
          price,
          details,
          location,
          imgSrc: fullImgSrc,
          href: fullHref,
        });
      });

      return {
        seeAllUrl: url,
        cars,
      };
    } catch (error) {
      console.error(`Error status: ${error.response?.status}`);
      console.error(`Error data: ${error.response?.data}`);
      console.error(`Axios Error: ${error.message}`);
      console.error(`Full error: ${error}`);
      throw new InternalServerErrorException('Failed to fetch cars');
    }
  }
}
