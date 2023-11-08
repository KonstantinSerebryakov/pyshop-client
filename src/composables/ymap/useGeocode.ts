import { useCountryTimeZoneComposable } from 'src/composables/useTimeZoneComposable';
import {
  GeocodeApi,
  IYandexGeocodeResponseFeature,
} from 'src/utils/api/Geocode.api';

export async function useGecode() {
  const api = new GeocodeApi();
  let _address = (() => {
    const timeZone = useCountryTimeZoneComposable();
    const name = timeZone.getName();
    // TODO: EXTRACT LOCATION FROM PINIA and use it instead fetch default
    return name ?? 'London';
  })();
  const _coords = await (async () => {
    const payload = await api.fetchAddressToCoords(_address);
    return payload.promise.then((data) => {
      if (data) {
        const posStr = data?.Point.pos;
        const coords = posStr.split(' ');
        return coords.map((axis) => Number.parseFloat(axis));
      } else {
        return [0, 0];
      }
    });
  })();

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  let cancel = (() => {}) as () => void;
  let promise = null as Promise<typeof _coords | typeof _address> | null;

  async function getCoordinates(address?: string) {
    if (!address) return [..._coords];
    if (_address === address) return [..._coords];
    cancel();
    const promisePayload = await api.fetchAddressToCoords(address.trim());
    cancel = promisePayload.cancel;
    promise = promisePayload.promise
      .then((data) => {
        const tmp = data?.Point.pos
          .split(' ')
          .map((item) => Number.parseFloat(item));
        if (tmp) {
          _coords[0] = tmp[0];
          _coords[1] = tmp[1];
          _address = address;
        }
      })
      .then(() => {
        return _coords;
      });
    return promise as Promise<number[]>;
  }
  async function getAddress(coords?: [number, number]) {
    if (!coords) return _address;
    if (_coords[0] === coords[0] && _coords[1] === coords[1]) return _address;
    cancel();
    const promisePayload = await api.fetchCoordsToAddress(coords);
    cancel = promisePayload.cancel;
    promise = promisePayload.promise
      .then((data) => {
        const tmp = data?.metaDataProperty.GeocoderMetaData.text;
        if (tmp) {
          _address = tmp;
          _coords[0] = coords[0];
          _coords[1] = coords[1];
        }
      })
      .then(() => {
        return _address;
      });
    return promise as Promise<string>;
  }

  return { getCoordinates, getAddress };
}
