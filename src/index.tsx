import {
  Module,
  customModule,
  Container,
  ControlElement,
  customElements,
  Panel
} from '@ijstech/components'
import { IData, ViewModeType } from './interface'
import './index.css'
import {
  DEFAULT_LAT,
  DEFAULT_LONG,
  DEFAULT_VIEW_MODE,
  DEFAULT_ZOOM
} from './utils';
import { Model } from './model';

interface ScomMapElement extends ControlElement {
  lazyLoad?: boolean;
  long?: number;
  lat?: number;
  viewMode?: ViewModeType;
  zoom?: number;
  address?: string;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['i-scom-map']: ScomMapElement
    }
  }
}

@customModule
@customElements('i-scom-map')
export default class ScomMap extends Module {
  private model: Model;
  private pnlMap: Panel;
  tag: any

  defaultEdit?: boolean
  validate?: () => boolean

  constructor(parent?: Container, options?: any) {
    super(parent, options);
    this.initModel();
  }

  static async create(options?: ScomMapElement, parent?: Container) {
    let self = new this(parent, options)
    await self.ready()
    return self
  }

  get long() {
    return this.model.long ?? DEFAULT_LONG;
  }

  get lat() {
    return this.model.lat ?? DEFAULT_LAT;
  }

  get viewMode() {
    return this.model.viewMode ?? DEFAULT_VIEW_MODE;
  }

  get address() {
    return this.model.address ?? '';
  }

  get zoom() {
    return this.model.zoom ?? DEFAULT_ZOOM;
  }

  getConfigurators() {
    this.initModel();
    return this.model.getConfigurators();
  }

  getData() {
    return this.model.getData();
  }

  async setData(value: Partial<IData>) {
    await this.model.setData(value);
  }

  getTag() {
    return this.tag;
  }

  async setTag(value: any) {
    await this.model.setTag(value);
  }

  async getPlacePredictions(input: string) {
    const predictions = await this.model.getPlacePredictions(input);
    return predictions;
  }

  async markPlaceOnMap(placeId: string) {
    await this.model.markPlaceOnMap(placeId);
  }

  async initGoogleMap() {
    this.model.initGoogleMap(this.pnlMap);
  }

  private initModel() {
    if (!this.model) {
      this.model = new Model(this);
    }
  }

  init() {
    super.init()
    const width = this.getAttribute('width', true)
    const height = this.getAttribute('height', true)
    this.setTag({
      width: width ? this.width : '500px',
      height: height ? this.height : '300px'
    })
    this.initGoogleMap();
    const lazyLoad = this.getAttribute('lazyLoad', true, false);
    if (!lazyLoad) {
      this.model.long = this.getAttribute('long', true, DEFAULT_LONG);
      this.model.lat = this.getAttribute('lat', true, DEFAULT_LAT);
      this.model.viewMode = this.getAttribute('viewMode', true, DEFAULT_VIEW_MODE);
      this.model.zoom = this.getAttribute('zoom', true, DEFAULT_ZOOM);
      this.model.address = this.getAttribute('address', true, '');
      const data = this.model.getData();
      this.setData(data);
    }
  }

  render() {
    return (
      <i-panel id="pnlMap" width="100%" height="100%"></i-panel>
    )
  }
}
