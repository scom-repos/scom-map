import {
    Module,
    customModule,
    IDataSchema,
    Container,
    ControlElement,
    customElements,
    VStack,
    HStack,
    Button,
    Styles,
    Panel
} from '@ijstech/components'
import { IData, ViewModeType } from './interface'
import { setDataFromSCConfig } from './store'
import { } from '@ijstech/eth-contract'
import { } from '@ijstech/eth-wallet'
import dataJson from './data.json'
import './index.css'
import {
    DEFAULT_LAT,
    DEFAULT_LONG,
    DEFAULT_VIEW_MODE,
    DEFAULT_ZOOM,
    getPropertiesSchema,
    getThemeSchema,
    getUrl
} from './utils'
import ScomMapConfig from './config/index'
import { GoogleMap } from './googleMap'

const Theme = Styles.Theme.ThemeVars

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
    private pnlMap: Panel;
    private data: IData = {}
    private map: GoogleMap;
    tag: any

    defaultEdit?: boolean
    validate?: () => boolean

    constructor(parent?: Container, options?: any) {
        super(parent, options)
        if (dataJson) {
            setDataFromSCConfig(dataJson)
        }
    }

    async initGoogleMap() {
        if (!window['google']?.maps) return;
        const pnlMap = this.pnlMap;
        this.map = new GoogleMap(pnlMap);
        this.map.handleMapsAPICallback();
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
            this.data.long = this.getAttribute('long', true, DEFAULT_LONG)
            this.data.lat = this.getAttribute('lat', true, DEFAULT_LAT)
            this.data.viewMode = this.getAttribute('viewMode', true, DEFAULT_VIEW_MODE)
            this.data.zoom = this.getAttribute('zoom', true, DEFAULT_ZOOM)
            this.data.address = this.getAttribute('address', true, '')
            this.setData(this.data);
        }
    }

    static async create(options?: ScomMapElement, parent?: Container) {
        let self = new this(parent, options)
        await self.ready()
        return self
    }

    get long() {
        return this.data.long ?? DEFAULT_LONG;
    }

    get lat() {
        return this.data.lat ?? DEFAULT_LAT;
    }

    get viewMode() {
        return this.data.viewMode ?? DEFAULT_VIEW_MODE;
    }

    get address() {
        return this.data.address ?? '';
    }

    get zoom() {
        return this.data.zoom ?? DEFAULT_ZOOM;
    }

    getConfigurators() {
        const self = this;
        return [
            {
                name: 'Builder Configurator',
                target: 'Builders',
                getActions: () => {
                    const propertiesSchema = getPropertiesSchema();
                    const themeSchema = getThemeSchema();
                    return this._getActions(propertiesSchema, themeSchema);
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
                    const propertiesSchema = getPropertiesSchema();
                    const themeSchema = getThemeSchema(true);
                    return this._getActions(propertiesSchema, themeSchema);
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
            }
        ]
    }

    getData() {
        return this.data;
    }

    async setData(value: Partial<IData>) {
        this.data = {
            ...this.data,
            ...value
        }
        if (this.map) {
            if (this.data.lat && this.data.long) {
                this.map.markPlaceOnMapByLatLng(this.data.lat, this.data.long);
            }
            else if (this.data.address) {
                let {lat, lng} = await this.map.markPlaceOnMapByQuery(this.data.address);
                this.data.lat = lat;
                this.data.long = lng;
            }
        }
    }

    private getTag() {
        return this.tag
    }

    private async setTag(value: any) {
        this.tag = value;
    }

    private _getActions(settingSchema: IDataSchema, themeSchema: IDataSchema) {
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
                customUI: {
                    render: (data?: any, onConfirm?: (result: boolean, data: any) => void) => {
                        const vstack = new VStack(null, { gap: '1rem' });
                        const config = new ScomMapConfig(null, { ...this.data });
                        const hstack = new HStack(null, {
                            verticalAlignment: 'center',
                            horizontalAlignment: 'end'
                        });
                        const button = new Button(null, {
                            caption: 'Confirm',
                            height: 40,
                            font: { color: Theme.colors.primary.contrastText }
                        });
                        hstack.append(button);
                        vstack.append(config);
                        vstack.append(hstack);
                        button.onClick = async () => {
                            await config.updateData();
                            if (onConfirm) {
                                onConfirm(true, { ...this.data, ...config.data });
                            }
                        }
                        return vstack;
                    }
                }
            },
        ]
        return actions
    }

    async getPlacePredictions(input: string) {
        let predictions = await this.map.getPlacePredictions(input);
        return predictions;
    }

    async markPlaceOnMap(placeId: string) {
        let {lat, lng, address} = await this.map.markPlaceOnMapByPlaceId(placeId);
        this.data.lat = lat;
        this.data.long = lng;
        this.data.address = address;
    }

    render() {
        return (
            <i-panel id="pnlMap" width="100%" height="100%"></i-panel>
        )
    }
}
