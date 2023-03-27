import {
  Module,
  customModule,
  IDataSchema,
  Container,
  ControlElement,
  customElements,
  Panel,
  Iframe
} from '@ijstech/components'
import { IData, PageBlock } from './interface'
import { getAPIKey, getAPIUrl, getEmbeddedUrl, setDataFromSCConfig } from './store'
import './index.css'
import scconfig from './scconfig.json'

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
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['i-scom-map']: ScomMapElement
    }
  }
}

declare global {
  interface Window {
    initMap: () => void;
  }
}

@customModule
@customElements('i-scom-map')
export default class ScomMap extends Module implements PageBlock {
  private data: IData = {
    long: 0,
    lat: 0
  }
  private oldData: IData = {
    long: 0,
    lat: 0
  }
  // private pnlMap: Panel;
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
  
  private get apiUrl() {
    return getAPIUrl().replace('{API_KEY}', getAPIKey())
  }

  private get embeddedUrl() {
    return getEmbeddedUrl()
      .replace('{API_KEY}', getAPIKey())
  }

  // private loadScript() {
  //   const scripts = document.getElementsByTagName('script')
  //   const added = Array.from(scripts).find(script => script.id === 'embeddedScript')
  //   if (added) return;
  //   let newScript = document.createElement('script');
  //   newScript.id = 'embeddedScript'
  //   newScript.setAttribute('src', this.apiUrl);
  //   document.body.appendChild(newScript);
  // }

  // private initMap() {
  //   let self = this;
  //   let map: google.maps.Map;
  //   map = new google.maps.Map(self.pnlMap as HTMLElement, {
  //     center: { lat: -34.397, lng: 150.644 },
  //     zoom: 8,
  //   });
  // }

  init() {
    super.init()
    const width = this.getAttribute('width', true)
    const height = this.getAttribute('height', true)
    this.setTag({
      width: width ? this.width : '500px',
      height: height ? this.height : '300px'
    })
    const long = this.getAttribute('long', true, 0)
    const lat = this.getAttribute('lat', true, 0)
    this.setData({long, lat});
  }

  static async create(options?: ScomMapElement, parent?: Container) {
    let self = new this(parent, options)
    await self.ready()
    return self
  }

  get long() {
    return this.data.long ?? 0
  }
  set long(value: number) {
    this.data.long = value;
  }

  get lat() {
    return this.data.lat ?? 0
  }
  set lat(value: number) {
    this.data.lat = value;
  }

  getConfigSchema() {
    return configSchema
  }

  getData() {
    return this.data
  }

  async setData(value: IData) {
    this.oldData = this.data
    this.data = value
    const url = this.embeddedUrl.replace('{lat}', this.data.lat.toString()).replace('{long}', this.data.long.toString())
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
        url: {
          type: 'string',
          minLength: 1,
          required: true,
        },
      },
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
        url: {
          type: 'string',
          minLength: 1,
          required: true,
        },
      },
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
