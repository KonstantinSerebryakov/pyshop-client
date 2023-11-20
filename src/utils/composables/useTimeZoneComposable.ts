import * as ct from 'countries-and-timezones';

interface ICountryTimeZone {
  id: string;
  name: string;
  timezones: string[];
}

export function useCountryTimeZoneComposable() {
  function getTimeZone() {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }

  const country: ICountryTimeZone | null = ct.getCountryForTimezone(
    getTimeZone()
  );
  return {
    getIso2Code: () => country?.id ?? null,
    getName: () => country?.name ?? null,
    getTimeZones: () => country?.timezones ?? null,
  };
}
