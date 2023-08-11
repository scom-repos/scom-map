import { IDataSchema } from "@ijstech/components";
import { getAPIKey, getAPIUrl } from "./store";
import { IData } from "./interface";

export const DEFAULT_ZOOM = 14;
export const DEFAULT_LONG = 0;
export const DEFAULT_LAT = 0;
export const DEFAULT_VIEW_MODE = 'roadmap';

export const getPropertiesSchema = () => {
  const propertiesSchema: IDataSchema = {
    type: 'object',
    properties: {
      address: {
        type: 'string'
      },
      lat: {
        type: 'number',
        title: 'Latitude'
      },
      long: {
        type: 'number',
        title: 'Longitude'
      },
      zoom: {
        type: 'number',
        minimum: 0,
        maximum: 21,
        default: DEFAULT_ZOOM
      },
      viewMode: {
        type: "string",
        enum: ['roadmap', 'satellite'],
        default: 'roadmap'
      },
      apiKey: {
        type: "string",
        title: "API Key"
      }
    }
  }
  return propertiesSchema;
}

export const getThemeSchema = (readOnly = false) => {
  const themeSchema: IDataSchema = {
    type: 'object',
    properties: {
      width: {
        type: 'string',
        readOnly
      },
      height: {
        type: 'string',
        readOnly
      },
    },
  }

  return themeSchema;
}

export const getUrl = (data: IData) => {
  const { address = '', lat = DEFAULT_LAT, long = DEFAULT_LONG, zoom = DEFAULT_ZOOM, viewMode = DEFAULT_VIEW_MODE } = data || {};
  const baseUrl = getAPIUrl();
  const params = new URLSearchParams();
  const apiKey = data.apiKey || getAPIKey() || ''
  params.append('key', apiKey);
  const position = `${lat},${long}`;
  if (address) {
    params.append('q', address);
    if (lat || long)
      params.append('center', position);
  } else {
    params.append('q', position);
  }
  params.append('zoom', zoom.toString());
  params.append('maptype', viewMode);
  return `${baseUrl}?${params.toString()}`;
}
