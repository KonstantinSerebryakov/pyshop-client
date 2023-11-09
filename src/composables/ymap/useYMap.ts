import { API_KEY, API_VERSION } from 'src/composables/ymap/constants';
import { LngLat, YMapLocationRequest } from '@yandex/ymaps3-types';
import {
  YMapCamera,
  YMapCenterLocation,
  YMapLocation,
} from '@yandex/ymaps3-types/imperative/YMap';
import { useCountryTimeZoneComposable } from 'src/composables/useTimeZoneComposable';
import { useGecode } from './useGeocode';
import mitt from 'mitt';
import { useSearch } from './useSearch';
import { scriptLoaded } from 'src/boot/ymaps';

export enum EVENT_MAP {
  CENTER_CHANGED = 'CENTER_CHANGED',
  ADDRESS_FETCHED = 'ADDRESS_FETCHED',
  ADDRESS_CHANGED = 'ADDRESS_CHANGED',
}

export async function useYMap(htmlElement: HTMLElement) {
  await scriptLoaded;
  await ymaps3.ready;
  const emitter = mitt();
  const geocode = await useGecode();
  const search = await useSearch();
  const centerMarker = await getCenterMarker();

  async function setControls(map: InstanceType<typeof ymaps3.YMap>) {
    const { YMapControls } = ymaps3;
    const { YMapZoomControl, YMapGeolocationControl } = await ymaps3.import(
      '@yandex/ymaps3-controls@0.0.1'
    );

    const controls = new YMapControls({
      position: 'top left',
      orientation: 'vertical',
    });

    const zoomControl = new YMapZoomControl({
      easing: 'linear',
    });
    controls.addChild(zoomControl);

    const geolocationControl = new YMapGeolocationControl({
      onGeolocatePosition: (position) => {
        const x = position[0];
        const y = position[1];
        emitter.emit(EVENT_MAP.CENTER_CHANGED, [x, y]);
        map.setLocation({
          zoom: 18,
        });
      },
    });
    controls.addChild(geolocationControl);
    map.addChild(controls);
  }

  async function getMapDefaultLocation(): Promise<YMapLocationRequest> {
    let location = null as null | YMapLocationRequest;

    async function generate() {
      const coords = await geocode.getCoordinates().then((data) => {
        geocode.getAddress().then((address) => {
          setTimeout(() => {
            emitter.emit(EVENT_MAP.ADDRESS_FETCHED, address);
          }, 0);
        });
        return data;
      });
      return {
        center: coords as LngLat,
        zoom: 9,
      };
    }

    if (!location) {
      location = (await generate()) as YMapLocationRequest;
    }
    return location;
  }

  async function createMapEntity(
    htmlElement: HTMLElement
  ): Promise<InstanceType<typeof ymaps3.YMap>> {
    await ymaps3.ready;
    const { YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer } = ymaps3;

    const LOCATION = await getMapDefaultLocation();
    const map = new YMap(htmlElement, {
      location: LOCATION,
      mode: 'raster',
    });

    // Add default layers to the map
    map.addChild(new YMapDefaultSchemeLayer({}));
    map.addChild(new YMapDefaultFeaturesLayer({}));

    return map;
  }

  async function getCenterMarker() {
    const { YMapMarker } = ymaps3;
    const location = (await getMapDefaultLocation()) as YMapCenterLocation;
    const center = location.center;
    const markerElement = generateMarkerElement() as HTMLElement;
    const marker = new YMapMarker(
      {
        coordinates: center,
        draggable: false,
      },
      markerElement
    );
    return marker;

    function generateMarkerElement() {
      const iconPath = 'location.png';
      const iconSize = 60;
      const markerElement = document.createElement('div');
      markerElement.style.position = 'absolute';
      markerElement.style.width = 'var(--size, 20px)';
      markerElement.style.height = 'var(--size, 20px)';
      markerElement.style.cssText += ` background-image: url(${iconPath}); `;
      markerElement.style.backgroundRepeat = 'no-repeat';
      markerElement.style.backgroundPosition = 'center bottom';
      markerElement.style.backgroundSize = 'contain';
      markerElement.style.left = `-${Math.round(iconSize / 2)}px`;
      markerElement.style.bottom = '0';
      markerElement.style.color = 'red';
      markerElement.style.setProperty('--size', `${iconSize}px`);
      return markerElement;
    }
  }

  async function setMapEventHandlers(map: InstanceType<typeof ymaps3.YMap>) {
    const { YMapListener } = ymaps3;

    const mapListener = new YMapListener({
      layer: 'any',
      onActionEnd: (eventObject: unknown) => {
        const typed = eventObject as {
          type: string;
          location: YMapLocation;
          camera: YMapCamera;
        };
        if (typed.type === 'drag') {
          const x = typed.location.center[0];
          const y = typed.location.center[1];
          emitter.emit(EVENT_MAP.CENTER_CHANGED, [x, y]);
        }
      },
      onUpdate: (updateObject) => {
        const typed = updateObject as {
          type: 'update';
          location: YMapLocation;
          camera: YMapCamera;
          mapInAction: boolean;
        };
        const center = typed.location.center;
        map.removeChild(centerMarker);
        centerMarker.coordinates[0] = center[0];
        centerMarker.coordinates[1] = center[1];
        map.addChild(centerMarker);
      },
    });
    map.addChild(mapListener);
  }

  async function setupEmitterEvents(map: InstanceType<typeof ymaps3.YMap>) {
    emitter.on(EVENT_MAP.CENTER_CHANGED, (data: unknown) => {
      const coords = data as [number, number];
      search.searchAddress(coords).then((address) => {
        emitter.emit(EVENT_MAP.ADDRESS_FETCHED, address);
      });
    });
    emitter.on(EVENT_MAP.ADDRESS_CHANGED, (data: unknown) => {
      const address = data as string;
      search.searchCoords(address).then((data) => {
        const coords = data as [number, number];
        map.setLocation({
          center: [coords[0], coords[1]],
          zoom: 16,
        });
      });
    });
    emitter.on('destroy', () => {
      map.destroy();
    });
  }

  const map = await createMapEntity(htmlElement);
  map.addChild(centerMarker);
  setControls(map);
  setMapEventHandlers(map);
  setupEmitterEvents(map);
  return {
    emitter: emitter,
  };
}
