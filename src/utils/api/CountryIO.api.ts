import axios, { AxiosInstance } from 'axios';
import {
  URL_COUNTRYIO_NAMES,
  URL_COUNTRYIO_PHONECODES,
} from '../constants/Api';
import { CountryData as ICountryData } from '../interfaces/country.io/Data.interface';
import { fullJoinArraysFilterEmpty } from '../utility/utility';

export class CountryIoApi {
  private static api = axios.create({ baseURL: 'http://country.io' });

  static async fetchCountryNamesPhoneCodes() {
    const fetchNames = await this.fetchCountryNames();
    const fetchCodes = await this.fetchCountryPhoneCodes();

    const cancel = () => {
      fetchNames.cancel();
      fetchCodes.cancel();
    };

    const promise = Promise.all([fetchNames.promise, fetchCodes.promise]).then(
      ([names, phoneCodes]) => {
        if (!names || !phoneCodes) return null;

        return fullJoinArraysFilterEmpty(names, phoneCodes);
        // return { names: names, phoneCodes: phoneCodes };
      }
    );

    return { promise: promise, cancel: cancel };
  }

  static async fetchCountryNames() {
    const URL = URL_COUNTRYIO_NAMES;
    return this.fetchApi(URL);
  }

  static async fetchCountryPhoneCodes() {
    const URL = URL_COUNTRYIO_PHONECODES;
    return this.fetchApi(URL);
  }

  private static async fetchApi(URL: string) {
    const controller = new AbortController();
    const cancel = () => {
      controller.abort();
    };

    const axiosPromise = CountryIoApi.api
      .get(URL, { signal: controller.signal })
      .then((response) => {
        const status = response.status;
        const data = response.data;
        if (status === 200 && data) {
          const typedData = data as ICountryData;
          const compare = new Intl.Collator('en').compare;
          return Object.entries(typedData).sort((left, right) => {
            return compare(left[0], right[0]);
          });
        }
      })
      .catch((error) => {
        const response = error.response;
        console.error(response.status + ': ' + response.data);
      });
    return { promise: axiosPromise, cancel: cancel };
  }
}
