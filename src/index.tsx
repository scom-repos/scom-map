import {
  Module,
  customModule,
  IDataSchema,
  Container,
  ControlElement,
  customElements,
  Iframe
} from '@ijstech/components'
import { IData, PageBlock, ViewModeType } from './interface'
import { getAPIKey, getAPIUrl, getEmbeddedUrl, setDataFromSCConfig } from './store'
import './index.css'
import scconfig from './scconfig.json'

const DEFAULT_ZOOM = 14;
const configSchema = {
  type: 'object',
  required: [],
  properties: {
    width: {
      type: 'string',
    },
    height: {
      type: 'string',
    },
  },
}

interface ScomMapElement extends ControlElement {
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
export default class ScomMap extends Module implements PageBlock {
  private data: IData = {}
  private oldData: IData = {}
  private iframeElm: Iframe;

  tag: any

  readonly onConfirm: () => Promise<void>
  readonly onDiscard: () => Promise<void>
  readonly onEdit: () => Promise<void>

  defaultEdit?: boolean
  validate?: () => boolean
  edit: () => Promise<void>
  confirm: () => Promise<void>
  discard: () => Promise<void>

  constructor(parent?: Container, options?: any) {
    super(parent, options)
    if (scconfig) {
      setDataFromSCConfig(scconfig)
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
    this.data.long = this.getAttribute('long', true, 0)
    this.data.lat = this.getAttribute('lat', true, 0)
    this.data.viewMode = this.getAttribute('viewMode', true, 'roadmap')
    this.data.zoom = this.getAttribute('zoom', true, DEFAULT_ZOOM)
    this.data.address = this.getAttribute('address', true, '')
    this.setData(this.data);
  }

  static async create(options?: ScomMapElement, parent?: Container) {
    let self = new this(parent, options)
    await self.ready()
    return self
  }

  get long() {
    return this.data.long ?? 0;
  }
  set long(value: number) {
    this.data.long = value;
  }

  get lat() {
    return this.data.lat ?? 0;
  }
  set lat(value: number) {
    this.data.lat = value;
  }

  get viewMode() {
    return this.data.viewMode ?? 'roadmap';
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

  getConfigSchema() {
    return configSchema
  }

  getData() {
    return this.data
  }

  private getUrl() {
    const baseUrl = getAPIUrl();
    const params = new URLSearchParams();
    params.append('key', getAPIKey());
    const position = `${this.lat},${this.long}`;
    if (this.address) {
      params.append('q', this.address);
      if (this.lat || this.long)
        params.append('center', position);
    } else {
      params.append('q', position);
    }
    params.append('zoom', this.zoom.toString());
    params.append('maptype', this.viewMode);
    return `${baseUrl}?${params.toString()}`;
  }

  async setData(value: IData) {
    this.oldData = this.data
    this.data = value
    const url = this.getUrl()
    // this.embeddedUrl.replace('{lat}', this.data.lat.toString()).replace('{long}', this.data.long.toString())
    this.iframeElm.url = url
  }

  getTag() {
    return this.tag
  }

  async setTag(value: any) {
    this.tag = value
    if (this.iframeElm) {
      this.iframeElm.display = "block";
      this.iframeElm.width = this.tag.width
      this.iframeElm.height = this.tag.height
    }
  }

  getEmbedderActions() {
    const propertiesSchema: IDataSchema = {
      type: 'object',
      properties: {
        address: {
          type: 'string'
        },
        latitude: {
          type: 'number'
        },
        longitude: {
          type: 'number'
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
        }
      }
    }

    const themeSchema: IDataSchema = {
      type: 'object',
      properties: {
        width: {
          type: 'string',
          readOnly: true,
        },
        height: {
          type: 'string',
          readOnly: true,
        },
      },
    }

    return this._getActions(propertiesSchema, themeSchema)
  }

  getActions() {
    const propertiesSchema: IDataSchema = {
      type: 'object',
      properties: {
        address: {
          type: 'string'
        },
        latitude: {
          type: 'number'
        },
        longitude: {
          type: 'number'
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
        }
      }
    }

    const themeSchema: IDataSchema = {
      type: 'object',
      properties: {
        width: {
          type: 'string',
        },
        height: {
          type: 'string',
        },
      },
    }

    return this._getActions(propertiesSchema, themeSchema)
  }

  _getActions(settingSchema: IDataSchema, themeSchema: IDataSchema) {
    const actions = [
      {
        name: 'Settings',
        icon: 'cog',
        command: (builder: any, userInputData: any) => {
          return {
            execute: () => {
              userInputData.lat = userInputData.latitude
              userInputData.long = userInputData.longitude
              if (builder?.setData) builder.setData(userInputData)
              this.setData(userInputData)
            },
            undo: () => {
              if (builder?.setData) builder.setData(this.oldData)
              this.setData(this.oldData)
            },
            redo: () => {},
          }
        },
        userInputDataSchema: settingSchema as IDataSchema,
      },
    ]
    return actions
  }

  render() {
    return (
      <i-panel>
        <i-iframe id="iframeElm"></i-iframe>
      </i-panel>
    )
  }
}
