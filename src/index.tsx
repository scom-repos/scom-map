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
import { getAPIKey, getAPIUrl, setDataFromSCConfig } from './store'
import {} from '@ijstech/eth-contract'
import {} from '@ijstech/eth-wallet'
import ScomDappContainer from '@scom/scom-dapp-container'
import scconfig from './scconfig.json'
import './index.css'

const DEFAULT_ZOOM = 14;
// const configSchema = {
//   type: 'object',
//   required: [],
//   properties: {
//     width: {
//       type: 'string',
//     },
//     height: {
//       type: 'string',
//     },
//   },
// }

interface ScomMapElement extends ControlElement {
  long?: number;
  lat?: number;
  viewMode?: ViewModeType;
  zoom?: number;
  address?: string;
  showHeader?: boolean;
  showFooter?: boolean;
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
  private data: IData = {}
  private oldData: IData = {}
  private iframeElm: Iframe;
  private dappContainer: ScomDappContainer

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
    this.data.showHeader = this.getAttribute('showHeader', true, true)
    this.data.showFooter = this.getAttribute('showFooter', true, true)
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

  get showFooter() {
    return this.data.showFooter ?? true
  }
  set showFooter(value: boolean) {
    this.data.showFooter = value
    if (this.dappContainer) this.dappContainer.showFooter = this.showFooter;
  }

  get showHeader() {
    return this.data.showHeader ?? true
  }
  set showHeader(value: boolean) {
    this.data.showHeader = value
    if (this.dappContainer) this.dappContainer.showHeader = this.showHeader;
  }

  // getConfigSchema() {
  //   return configSchema
  // }

  getConfigurators() {
    return [
      {
        name: 'Builder Configurator',
        target: 'Builders',
        getActions: this.getActions.bind(this),
        getData: this.getData.bind(this),
        getTag: this.getTag.bind(this),
        setData: this.setData.bind(this)
      },
      {
        name: 'Emdedder Configurator',
        target: 'Embedders',
        getActions: this.getEmbedderActions.bind(this),
        getData: this.getData.bind(this),
        getTag: this.getTag.bind(this),
        setData: this.setData.bind(this)
      }
    ]
  }

  private getData() {
    return this.data
  }

  private getUrl() {
    const baseUrl = getAPIUrl();
    const params = new URLSearchParams();
    const apiKey = this.data.apiKey || getAPIKey() || ''
    params.append('key', apiKey);
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

  private async setData(value: IData) {
    this.oldData = this.data
    this.data = value
    const url = this.getUrl()
    this.iframeElm.url = url
    if (this.dappContainer) {
      this.dappContainer.showHeader = this.showHeader;
      this.dappContainer.showFooter = this.showFooter;
    }
  }

  private getTag() {
    return this.tag
  }

  private async setTag(value: any) {
    this.tag = value;
    if (this.dappContainer) {
      this.dappContainer.width = this.tag.width;
      this.dappContainer.height = this.tag.height;
    }
  }

  private getPropertiesSchema() {
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

  private getEmbedderActions() {
    const propertiesSchema = this.getPropertiesSchema() as IDataSchema

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

  private getActions() {
    const propertiesSchema = this.getPropertiesSchema() as IDataSchema

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

  private _getActions(settingSchema: IDataSchema, themeSchema: IDataSchema) {
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
      <i-scom-dapp-container id="dappContainer" showWalletNetwork={false} display="block">
        <i-iframe id="iframeElm" width="100%" height="100%" display="flex"></i-iframe>
      </i-scom-dapp-container>
    )
  }
}
