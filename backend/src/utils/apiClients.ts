import axios from 'axios';
import * as cheerio from 'cheerio';

export class MobileLookupAPI {
  static async primaryLookup(number: string) {
    try {
      const response = await axios.get(`https://akash-num2info-api.vercel.app/?num=${number}&key=10`, {
        timeout: 10000,
      });
      return { data: response.data, source: 'primary-mobile-api' };
    } catch (error) {
      return null;
    }
  }

  static async fallbackLookup(number: string) {
    try {
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(`https://exploitsindia.site/track/live.php?term=${number}`)}`;
      const response = await axios.get(proxyUrl, { timeout: 15000 });
      const $ = cheerio.load(response.data);
      
      const result: any = {};
      $('table tr').each((i, row) => {
        const cells = $(row).find('td');
        if (cells.length === 2) {
          const key = $(cells[0]).text().trim();
          const value = $(cells[1]).text().trim();
          result[key] = value;
        }
      });
      
      return { data: result, source: 'fallback-mobile-scrape' };
    } catch (error) {
      return null;
    }
  }

  static async lookup(number: string) {
    const cleanNumber = number.replace(/^\+91|^0|\s/g, '');
    let result = await this.primaryLookup(cleanNumber);
    if (!result || !result.data) {
      result = await this.fallbackLookup(cleanNumber);
    }
    return result;
  }
}

export class VehicleLookupAPI {
  static async primaryLookup(number: string) {
    try {
      const response = await axios.get(`https://app.turtlemintinsurance.com/api/findregistrationresult?registration=${number}&vertical=FW`, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      });
      return { data: response.data, source: 'primary-vehicle-api' };
    } catch (error) {
      return null;
    }
  }

  static async fallbackLookup(number: string) {
    const proxies = [
      'https://api.allorigins.win/raw?url=',
      'https://cors-anywhere.herokuapp.com/',
      'https://cors.bridged.cc/',
    ];
    
    for (const proxy of proxies) {
      try {
        const response = await axios.get(`${proxy}${encodeURIComponent(`https://vehinfo.ek4nsh.in/api/vehicle?rc=${number}`)}`, {
          timeout: 15000,
        });
        if (response.data) {
          return { data: response.data, source: 'fallback-vehicle-api' };
        }
      } catch (error) {
        continue;
      }
    }
    return null;
  }

  static async lookup(number: string) {
    let result = await this.primaryLookup(number);
    if (!result || !result.data) {
      result = await this.fallbackLookup(number);
    }
    return result;
  }
}
