import { useCountryTimeZoneComposable } from 'src/utils/composables/useTimeZoneComposable';
import { GeocodeApi } from './Geocode.api';
import { debounce } from 'quasar';

export async function useGecode(defaultLocation = '') {
  const api = new GeocodeApi();

  let _address = await (async () => {
    if (defaultLocation.length > 0) return defaultLocation;
    const timeZone = useCountryTimeZoneComposable();
    const name = timeZone.getName();
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

  let cancel = (() => {/* */}) as () => void; // prettier-ignore
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

  return {
    getCoordinates,
    getAddress,
  };
  // return {
  //   getCoordinates: debounce(getCoordinates, 300),
  //   getAddress: debounce(getAddress, 300),
  // };
}
