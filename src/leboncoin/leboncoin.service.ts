import { Injectable } from '@nestjs/common';
import { search, SORT_BY, SORT_ORDER, CATEGORY } from 'leboncoin-api-search';

@Injectable()
export class LeboncoinService {
  async searchVehicles() {
    try {
      const results = await search({
        category: CATEGORY.VOITURES,
        sort_by: SORT_BY.TIME,
        sort_order: SORT_ORDER.DESC,
        keywords: 'Audi A3',
        price_min: 1500,
        price_max: 20000,
        locations: ['ile_de_france'],
      });
      return results;
    } catch (error) {
      console.error('Error while fetching data from Leboncoin API:', error);
      throw new Error('Failed to fetch data from Leboncoin');
    }
  }
}
