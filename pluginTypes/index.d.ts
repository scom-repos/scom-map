/// <reference path="@ijstech/components/index.d.ts" />
/// <amd-module name="@scom/scom-map/interface.ts" />
declare module "@scom/scom-map/interface.ts" {
    export type ViewModeType = 'roadmap' | 'satellite';
    export interface IData {
        long?: number;
        lat?: number;
        viewMode?: ViewModeType;
        zoom?: number;
        address?: string;
        apiKey?: string;
    }
    export interface IMapPlacePrediction {
        description: string;
        placeId: string;
        mainText: string;
        secondaryText?: string;
        types: string[];
    }
}
/// <amd-module name="@scom/scom-map/index.css.ts" />
declare module "@scom/scom-map/index.css.ts" { }
/// <amd-module name="@scom/scom-map/store.ts" />
declare module "@scom/scom-map/store.ts" {
    export const state: {
        apiKey: string;
        apiUrl: string;
    };
    export const setDataFromSCConfig: (options: any) => void;
    export const setAPIKey: (value: string) => void;
    export const getAPIKey: () => string;
    export const setAPIUrl: (value: string) => void;
    export const getAPIUrl: () => string;
}
/// <amd-module name="@scom/scom-map/utils.ts" />
declare module "@scom/scom-map/utils.ts" {
    import { IDataSchema } from "@ijstech/components";
    import { IData } from "@scom/scom-map/interface.ts";
    export const DEFAULT_ZOOM = 14;
    export const DEFAULT_LONG = 0;
    export const DEFAULT_LAT = 0;
    export const DEFAULT_VIEW_MODE = "roadmap";
    export const getPropertiesSchema: () => IDataSchema;
    export const getThemeSchema: (readOnly?: boolean) => IDataSchema;
    export const getUrl: (data: IData, isCentered?: boolean) => string;
}
/// <amd-module name="@scom/scom-map/data.json.ts" />
declare module "@scom/scom-map/data.json.ts" {
    const _default: {
        apiKey: string;
        apiUrl: string;
        defaultBuilderData: {
            zoom: number;
        };
    };
    export default _default;
}
/// <amd-module name="@scom/scom-map/googleMap.ts" />
declare module "@scom/scom-map/googleMap.ts" {
    import { Panel } from "@ijstech/components";
    import { IMapPlacePrediction } from "@scom/scom-map/interface.ts";
    export class GoogleMap {
        private pnlMap;
        private map;
        private geocoder;
        private center;
        private placeService;
        private autocompleteService;
        private markers;
        private zoom;
        constructor(pnlMap: Panel);
        handleMapsAPICallback(): void;
        initializeMap(): void;
        getZoom(): number;
        getCenter(): {
            lat: number;
            lng: number;
        };
        createMapMarker(location: {
            lat: number;
            lng: number;
        }): void;
        createLatLngObject(lat: number, lng: number): any;
        searchPlaces(lat: number, lng: number, value: string): Promise<any>;
        getDistance(lat1: number, lng1: number, lat2: number, lng2: number): number;
        getLatLngFromAddress(value: string): Promise<{
            lat: number;
            lng: number;
        }>;
        getPlacePredictions(input: string): Promise<IMapPlacePrediction[]>;
        clearMarkers(): void;
        markPlaceOnMapByLatLng(lat: number, lng: number): void;
        markPlaceOnMapByPlaceId(placeId: string): Promise<{
            lat: number;
            lng: number;
            address: string;
        }>;
        markPlaceOnMapByQuery(query: string): Promise<{
            lat: number;
            lng: number;
            address: string;
        }>;
    }
}
/// <amd-module name="@scom/scom-map/config/index.css.ts" />
declare module "@scom/scom-map/config/index.css.ts" {
    const _default_1: void;
    export default _default_1;
}
/// <amd-module name="@scom/scom-map/config/index.tsx" />
declare module "@scom/scom-map/config/index.tsx" {
    import { Module, ControlElement, Container } from '@ijstech/components';
    import "@scom/scom-map/config/index.css.ts";
    import { IData, ViewModeType } from "@scom/scom-map/interface.ts";
    interface ScomImageConfigElement extends ControlElement {
        long?: number;
        lat?: number;
        viewMode?: ViewModeType;
        zoom?: number;
        address?: string;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ["i-scom-map-config"]: ScomImageConfigElement;
            }
        }
    }
    export default class ScomMapConfig extends Module {
        private formEl;
        private iframeMap;
        private _data;
        private searchTimer;
        constructor(parent?: Container, options?: any);
        get data(): IData;
        set data(value: IData);
        updateData(): Promise<void>;
        private renderUI;
        private onInputChanged;
        disconnectedCallback(): void;
        init(): Promise<void>;
        render(): any;
    }
}
/// <amd-module name="@scom/scom-map/model.ts" />
declare module "@scom/scom-map/model.ts" {
    import { Module, Panel, VStack } from '@ijstech/components';
    import { IData, ViewModeType } from "@scom/scom-map/interface.ts";
    export const DEFAULT_ZOOM = 14;
    export class Model {
        private module;
        private data;
        private map;
        constructor(module: Module);
        get long(): number;
        set long(value: number);
        get lat(): number;
        set lat(value: number);
        get viewMode(): ViewModeType;
        set viewMode(value: ViewModeType);
        get address(): string;
        set address(value: string);
        get zoom(): number;
        set zoom(value: number);
        getConfigurators(): ({
            name: string;
            target: string;
            getActions: () => {
                name: string;
                icon: string;
                command: (builder: any, userInputData: any) => {
                    execute: () => void;
                    undo: () => void;
                    redo: () => void;
                };
                customUI: {
                    render: (data?: any, onConfirm?: (result: boolean, data: any) => void) => VStack;
                };
            }[];
            getLinkParams: () => {
                data: string;
            };
            setLinkParams: (params: any) => Promise<void>;
            getData: any;
            setData: any;
            getTag: any;
            setTag: any;
        } | {
            name: string;
            target: string;
            getActions: () => {
                name: string;
                icon: string;
                command: (builder: any, userInputData: any) => {
                    execute: () => void;
                    undo: () => void;
                    redo: () => void;
                };
                customUI: {
                    render: (data?: any, onConfirm?: (result: boolean, data: any) => void) => VStack;
                };
            }[];
            getData: any;
            setData: any;
            getTag: any;
            setTag: any;
            getLinkParams?: undefined;
            setLinkParams?: undefined;
        })[];
        private _getActions;
        setData(value: IData): Promise<void>;
        getData(): IData;
        getTag(): any;
        setTag(value: any): Promise<void>;
        initGoogleMap(pnlMap: Panel): Promise<void>;
        getPlacePredictions(input: string): Promise<import("@scom/scom-map/interface.ts").IMapPlacePrediction[]>;
        markPlaceOnMap(placeId: string): Promise<void>;
    }
}
/// <amd-module name="@scom/scom-map" />
declare module "@scom/scom-map" {
    import { Module, Container, ControlElement } from '@ijstech/components';
    import { IData, ViewModeType } from "@scom/scom-map/interface.ts";
    import "@scom/scom-map/index.css.ts";
    interface ScomMapElement extends ControlElement {
        lazyLoad?: boolean;
        long?: number;
        lat?: number;
        viewMode?: ViewModeType;
        zoom?: number;
        address?: string;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['i-scom-map']: ScomMapElement;
            }
        }
    }
    export default class ScomMap extends Module {
        private model;
        private pnlMap;
        tag: any;
        defaultEdit?: boolean;
        validate?: () => boolean;
        constructor(parent?: Container, options?: any);
        static create(options?: ScomMapElement, parent?: Container): Promise<ScomMap>;
        get long(): number;
        get lat(): number;
        get viewMode(): ViewModeType;
        get address(): string;
        get zoom(): number;
        getConfigurators(): ({
            name: string;
            target: string;
            getActions: () => {
                name: string;
                icon: string;
                command: (builder: any, userInputData: any) => {
                    execute: () => void;
                    undo: () => void;
                    redo: () => void;
                };
                customUI: {
                    render: (data?: any, onConfirm?: (result: boolean, data: any) => void) => import("@ijstech/components").VStack;
                };
            }[];
            getLinkParams: () => {
                data: string;
            };
            setLinkParams: (params: any) => Promise<void>;
            getData: any;
            setData: any;
            getTag: any;
            setTag: any;
        } | {
            name: string;
            target: string;
            getActions: () => {
                name: string;
                icon: string;
                command: (builder: any, userInputData: any) => {
                    execute: () => void;
                    undo: () => void;
                    redo: () => void;
                };
                customUI: {
                    render: (data?: any, onConfirm?: (result: boolean, data: any) => void) => import("@ijstech/components").VStack;
                };
            }[];
            getData: any;
            setData: any;
            getTag: any;
            setTag: any;
            getLinkParams?: undefined;
            setLinkParams?: undefined;
        })[];
        getData(): IData;
        setData(value: Partial<IData>): Promise<void>;
        getTag(): any;
        setTag(value: any): Promise<void>;
        getPlacePredictions(input: string): Promise<import("@scom/scom-map/interface.ts").IMapPlacePrediction[]>;
        markPlaceOnMap(placeId: string): Promise<void>;
        initGoogleMap(): Promise<void>;
        private initModel;
        init(): void;
        render(): any;
    }
}
