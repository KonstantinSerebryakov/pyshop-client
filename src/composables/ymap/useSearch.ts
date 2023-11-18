import { Feature } from '@yandex/ymaps3-types';

export async function useSearch() {
  await ymaps3.ready;
  const isNotFirstCall = true;
  let _address = '';
  let _coords = [0, 0] as [number, number];

  async function searchAddress(coords?: [number, number]) {
    if (!coords) return _address;
    const x = coords[0];
    const y = coords[1];
    if (isNotFirstCall && x === _coords[0] && y === _coords[1]) return _address;
    return ymaps3.search({ text: [x, y].join(',') }).then((data) => {
      const firstNode = data[0];
      const props = firstNode.properties;
      let tmp = '';
      if (props.description) tmp += props.description + ', ';
      tmp += props.name;
      _address = tmp;
      _coords = [x, y];
      return tmp;
    });
  }
  async function searchCoords(address?: string) {
    if (!address) return _coords;
    if (isNotFirstCall && _address === address) return [..._coords];
    return ymaps3.search({ text: address }).then((data) => {
      if (!data || data.length < 1) {
        return [..._coords];
      }
      const firstNode = data[0] as Feature;
      const geometry = firstNode.geometry;
      const coords = geometry?.coordinates;
      if (!coords) return _coords;
      const x = coords[0];
      const y = coords[1];
      _coords = [x, y];
      _address = address;
      return [x, y];
    });
  }
  return { searchAddress, searchCoords };
}
