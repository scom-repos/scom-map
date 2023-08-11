import {
  Module,
  customModule,
  ControlElement,
  customElements,
  Container,
  Iframe,
  Form,
  Input,
  Panel
} from '@ijstech/components'
import './index.css'
import { IData, ViewModeType } from '../interface';
import { DEFAULT_LAT, DEFAULT_LONG, DEFAULT_VIEW_MODE, DEFAULT_ZOOM, getPropertiesSchema, getUrl } from '../utils';
import { getAPIKey } from '../store';

interface ScomImageConfigElement extends ControlElement {
  long?: number;
  lat?: number;
  viewMode?: ViewModeType;
  zoom?: number;
  address?: string;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ["i-scom-map-config"]: ScomImageConfigElement;
    }
  }
}

declare global {
  interface Window {
    initMap: () => void;
  }
}

declare const google: any;

@customModule
@customElements('i-scom-map-config')
export default class ScomMapConfig extends Module {
  private formEl: Form
  private iframeMap: Iframe

  private _data: IData
  private searchTimer: any = null

  constructor(parent?: Container, options?: any) {
    super(parent, options)
    this.onInputChanged = this.onInputChanged.bind(this)
  }

  get data() {
    return this._data
  }
  set data(value: IData) {
    this._data = value
    this.renderUI()
  }

  async updateData() {
    this._data = await this.formEl.getFormData()
  }

  private renderUI() {
    this.formEl.clearInnerHTML()
    this.formEl.jsonSchema = getPropertiesSchema()
    this.formEl.formOptions = {
      columnWidth: '100%',
      columnsPerRow: 2,
      confirmButtonOptions: {
        hide: true
      }
    }
    this.formEl.renderForm()
    this.formEl.clearFormData()
    this.formEl.setFormData(this._data)

    const url = getUrl({ ...this._data })
    this.iframeMap.url = url

    const inputs = this.formEl.querySelectorAll('[scope]')
    for (let input of inputs) {
      const inputEl = input as Input
      // const scope: string = inputEl.getAttribute('scope', true, '')
      inputEl.onChanged = this.onInputChanged
    }
  }

  private onInputChanged() {
    if (this.searchTimer) clearTimeout(this.searchTimer)
    this.searchTimer = setTimeout(async () => {
      const data = await this.formEl.getFormData()
      const url = getUrl({ ...data })
      this.iframeMap.url = url
    }, 500)
  }

  disconnectCallback(): void {
    super.disconnectCallback()
    if (this.searchTimer) clearTimeout(this.searchTimer)
  }

  async init() {
    super.init()
    const long = this.getAttribute('long', true, DEFAULT_LONG)
    const lat = this.getAttribute('lat', true, DEFAULT_LAT)
    const viewMode = this.getAttribute('viewMode', true, DEFAULT_VIEW_MODE)
    const zoom = this.getAttribute('zoom', true, DEFAULT_ZOOM)
    const address = this.getAttribute('address', true, '')
    this.data = { long, lat, viewMode, zoom, address }
  }

  render() {
    return (
      <i-panel>
        <i-vstack gap='0.5rem'>
          <i-panel id='pnlForm'>
            <i-form id='formEl'></i-form>
          </i-panel>
          <i-panel>
            <i-iframe
              id='iframeMap'
              width='100%'
              height={500}
              display='flex'
            />
          </i-panel>
        </i-vstack>
      </i-panel>
    )
  }
}
