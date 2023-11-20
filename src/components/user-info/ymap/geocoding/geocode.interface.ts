export interface IYandexGeocodeQueryOptions {
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

export interface IYandexGeocoderAddress {
  country_code: string;
  formatted: string;
  Components: {
    kind: string;
    name: string;
  }[];
}

export interface IYandexGeocodeResponseFeature {
  metaDataProperty: {
    GeocoderMetaData: {
      kind: string;
      precision: string;
      text: string;
      Address: IYandexGeocoderAddress;
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

export interface IYandexGeocodeResponse {
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
