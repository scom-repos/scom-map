import { Module, Panel } from '@ijstech/components';
import dataJson from './data.json';
import { ICustomUI, IData, ViewModeType } from './interface';
import { setDataFromSCConfig } from './store';
import { GoogleMap } from './googleMap';
import { DEFAULT_LAT, DEFAULT_LONG, DEFAULT_VIEW_MODE } from './utils';

export const DEFAULT_ZOOM = 14;

export class Model {
  private module: Module;
  private data: IData = {};
  private map: GoogleMap;

  constructor(module: Module) {
    if (dataJson) {
      setDataFromSCConfig(dataJson);
    }
    this.module = module;
  }

  get long() {
    return this.data.long ?? DEFAULT_LONG;
  }
  set long(value: number) {
    this.data.long = value;
  }

  get lat() {
    return this.data.lat ?? DEFAULT_LAT;
  }
  set lat(value: number) {
    this.data.lat = value;
  }

  get viewMode() {
    return this.data.viewMode ?? DEFAULT_VIEW_MODE;
  }
  set viewMode(value: ViewModeType) {
    this.data.viewMode = value;
  }

  get address() {
    return this.data.address ?? '';
  }
  set address(value: string) {
    this.data.address = value;
  }

  get zoom() {
    return this.data.zoom ?? DEFAULT_ZOOM;
  }
  set zoom(value: number) {
    this.data.zoom = value;
  }

  getConfigurators(formAction: ICustomUI) {
    const self = this;
    return [
      {
        name: 'Builder Configurator',
        target: 'Builders',
        getActions: () => {
          return this._getActions(formAction);
        },
        getData: this.getData.bind(this),
        setData: async (data: IData) => {
          const defaultData = dataJson.defaultBuilderData as any;
          await this.setData({ ...defaultData, ...data })
        },
        getTag: this.getTag.bind(this),
        setTag: this.setTag.bind(this)
      },
      {
        name: 'Emdedder Configurator',
        target: 'Embedders',
        getActions: () => {
          return this._getActions(formAction);
        },
        getLinkParams: () => {
          const data = this.data || {};
          return {
            data: window.btoa(JSON.stringify(data))
          }
        },
        setLinkParams: async (params: any) => {
          if (params.data) {
            const utf8String = decodeURIComponent(params.data);
            const decodedString = window.atob(utf8String);
            const newData = JSON.parse(decodedString);
            let resultingData = {
              ...self.data,
              ...newData
            };
            await this.setData(resultingData);
          }
        },
        getData: this.getData.bind(this),
        setData: this.setData.bind(this),
        getTag: this.getTag.bind(this),
        setTag: this.setTag.bind(this)
      },
      {
        name: 'Editor',
        target: 'Editor',
        getActions: () => {
          return this._getActions(formAction)
        },
        getData: this.getData.bind(this),
        setData: this.setData.bind(this),
        getTag: this.getTag.bind(this),
        setTag: this.setTag.bind(this)
      }
    ]
  }

  private _getActions(formAction: ICustomUI) {
    const actions = [
      {
        name: 'Edit',
        icon: 'edit',
        command: (builder: any, userInputData: any) => {
          let oldData = {};
          return {
            execute: () => {
              oldData = { ...this.data };
              if (userInputData?.long !== undefined) this.data.long = userInputData.long;
              if (userInputData?.lat !== undefined) this.data.lat = userInputData.lat;
              if (userInputData?.viewMode !== undefined) this.data.viewMode = userInputData.viewMode;
              if (userInputData?.zoom !== undefined) this.data.zoom = userInputData.zoom;
              if (userInputData?.address !== undefined) this.data.address = userInputData.address;
              if (userInputData?.apiKey !== undefined) this.data.apiKey = userInputData.apiKey;
              if (builder?.setData) builder.setData(this.data);
            },
            undo: () => {
              this.data = { ...oldData };
              if (builder?.setData) builder.setData(this.data);
            },
            redo: () => { },
          }
        },
        customUI: formAction
      },
    ]
    return actions;
  }

  async setData(value: IData) {
    this.data = {
      ...this.data,
      ...value
    }
    if (this.map) {
      if (this.data.lat && this.data.long) {
        this.map.markPlaceOnMapByLatLng(this.data.lat, this.data.long);
      }
      else if (this.data.address) {
        let { lat, lng } = await this.map.markPlaceOnMapByQuery(this.data.address);
        this.data.lat = lat;
        this.data.long = lng;
      }
    }
  }

  getData() {
    return this.data;
  }

  getTag() {
    return this.module.tag;
  }

  async setTag(value: any) {
    this.module.tag = value;
  }

  async initGoogleMap(pnlMap: Panel) {
    if (!window['google']?.maps) return;
    this.map = new GoogleMap(pnlMap);
    this.map.handleMapsAPICallback();
  }

  async getPlacePredictions(input: string) {
    let predictions = await this.map.getPlacePredictions(input);
    return predictions;
  }

  async markPlaceOnMap(placeId: string) {
    let { lat, lng, address } = await this.map.markPlaceOnMapByPlaceId(placeId);
    this.data.lat = lat;
    this.data.long = lng;
    this.data.address = address;
  }
}
