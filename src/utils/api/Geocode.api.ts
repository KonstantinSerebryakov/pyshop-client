import axios, { AxiosInstance } from 'axios';
import { API_KEY } from '../../composables/ymap/constants';

interface IYandexGeocodeQueryOptions {
  apikey: string;
  geocode: string;
  sco?: string;
  kind?: string;
  rspn?: boolean;
  ll?: [number, number];
  spn?: [number, number];
  bbox?: [[number, number], [number, number]]; // [[x1, y1], [x2, y2]]
  results?: number;
  skip?: number;
  lang?: string;
  callback?: string;
  uri?: string;
}

export interface IYandexGeocodeResponseFeature {
  metaDataProperty: {
    GeocoderMetaData: {
      kind: string;
      precision: string;
      text: string;
      Address: {
        country_code: string;
        formatted: string;
        Components: {
          kind: string;
          name: string;
        }[];
      };
    };
  };
  name: string;
  description: string;
  boundedBy: {
    Envelope: {
      lowerCorner: string;
      upperCorner: string;
    };
  };
  uri: string;
  Point: {
    pos: string;
  };
}

interface IYandexGeocodeResponse {
  response: {
    GeoObjectCollection: {
      metaDataProperty: {
        GeocoderResponseMetaData: {
          fix?: string;
          request: string;
          suggest?: string;
          found: number;
          results: number;
          skip?: number;
        };
      };
      featureMember: {
        GeoObject: IYandexGeocodeResponseFeature;
      }[];
    };
  };
}

export class GeocodeApi {
  private static api = axios.create({
    baseURL: 'https://geocode-maps.yandex.ru/1.x',
  });

  public lang;
  constructor(lang = 'en_RU') {
    this.lang = lang;
  }

  fetchAddressToCoords(address: string) {
    const urlOptions: Omit<IYandexGeocodeQueryOptions, 'apikey'> = {
      geocode: address,
      results: 1,
      lang: this.lang,
    };
    const url = this.generateUrl(urlOptions);
    return this.fetchApi(url);
  }

  fetchCoordsToAddress(coords: [number, number]) {
    const urlOptions: Omit<IYandexGeocodeQueryOptions, 'apikey'> = {
      geocode: `${coords[0]},${coords[1]}`,
      results: 1,
      lang: this.lang,
      // kind: 'house',
    };
    const url = this.generateUrl(urlOptions);
    return this.fetchApi(url);
  }

  private generateUrl(options: Omit<IYandexGeocodeQueryOptions, 'apikey'>) {
    const baseUrl = '';
    const queryParams = new URLSearchParams();

    queryParams.append('apikey', API_KEY);
    queryParams.append('geocode', options.geocode);

    if (options.sco) queryParams.append('sco', options.sco);
    if (options.kind) queryParams.append('kind', options.kind);
    if (options.rspn) queryParams.append('rspn', options.rspn.toString());
    if (options.ll) queryParams.append('ll', options.ll.join(','));
    if (options.spn) queryParams.append('spn', options.spn.join(','));
    if (options.bbox) {
      const bboxStr = options.bbox.map((point) => point.join(',')).join('~');
      queryParams.append('bbox', bboxStr);
    }
    if (options.results)
      queryParams.append('results', options.results.toString());
    if (options.skip) queryParams.append('skip', options.skip.toString());
    if (options.lang) queryParams.append('lang', options.lang);
    if (options.callback) queryParams.append('callback', options.callback);
    if (options.uri) queryParams.append('uri', options.uri);

    queryParams.append('format', 'json');

    const url = `${baseUrl}?${queryParams.toString()}`;
    return url;
  }

  private async fetchApi(URL: string) {
    const controller = new AbortController();
    const cancel = () => {
      controller.abort();
    };

    const axiosPromise = GeocodeApi.api
      .get(URL, { signal: controller.signal })
      .then((response) => {
        const status = response.status;
        const data = response.data;
        if (status === 200 && data) {
          return data as IYandexGeocodeResponse;
        }
      })
      .then((data): IYandexGeocodeResponseFeature | null | undefined => {
        if (data) {
          const features = data.response.GeoObjectCollection.featureMember;
          if (features.length < 1) return null;
          // console.log(features);
          const mostRelevantData = features[0].GeoObject;
          return mostRelevantData;
        }
      })
      .catch((error) => {
        const response = error.response;
        console.error(response.status + ': ' + response.data);
      });
    return { promise: axiosPromise, cancel: cancel };
  }
}
