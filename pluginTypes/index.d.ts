/// <amd-module name="@scom/scom-map/interface.ts" />
declare module "@scom/scom-map/interface.ts" {
    import { IDataSchema } from "@ijstech/components";
    export interface ICommand {
        execute(): void;
        undo(): void;
        redo(): void;
    }
    export interface IPageBlockAction {
        name: string;
        icon: string;
        command: (builder: any, userInputData: any) => ICommand;
        userInputDataSchema: IDataSchema;
    }
    export interface PageBlock {
        getActions: () => IPageBlockAction[];
        getData: () => any;
        setData: (data: any) => Promise<void>;
        getTag: () => any;
        setTag: (tag: any) => Promise<void>;
        defaultEdit?: boolean;
        tag?: any;
        validate?: () => boolean;
        readonly onEdit: () => Promise<void>;
        readonly onConfirm: () => Promise<void>;
        readonly onDiscard: () => Promise<void>;
        edit: () => Promise<void>;
        confirm: () => Promise<void>;
        discard: () => Promise<void>;
    }
    export type ViewModeType = 'roadmap' | 'satellite';
    export interface IData {
        long?: number;
        lat?: number;
        viewMode?: ViewModeType;
        zoom?: number;
        address?: string;
        apiKey?: string;
        showHeader?: boolean;
        showFooter?: boolean;
    }
}
/// <amd-module name="@scom/scom-map/store.ts" />
declare module "@scom/scom-map/store.ts" {
    export const state: {
        embeddedUrl: string;
        apiKey: string;
        apiUrl: string;
    };
    export const setDataFromSCConfig: (options: any) => void;
    export const setEmbeddedUrl: (url: string) => void;
    export const getEmbeddedUrl: () => string;
    export const setAPIKey: (value: string) => void;
    export const getAPIKey: () => string;
    export const setAPIUrl: (value: string) => void;
    export const getAPIUrl: () => string;
}
/// <amd-module name="@scom/scom-map/data.json.ts" />
declare module "@scom/scom-map/data.json.ts" {
    const _default: {
        apiKey: string;
        apiUrl: string;
        embeddedUrl: string;
        defaultBuilderData: {
            lat: number;
            long: number;
            address: string;
            zoom: number;
        };
    };
    export default _default;
}
/// <amd-module name="@scom/scom-map/index.css.ts" />
declare module "@scom/scom-map/index.css.ts" { }
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
    export const getUrl: (data: IData) => string;
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
    global {
        interface Window {
            initMap: () => void;
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
        disconnectCallback(): void;
        init(): Promise<void>;
        render(): any;
    }
}
/// <amd-module name="@scom/scom-map" />
declare module "@scom/scom-map" {
    import { Module, Container, ControlElement, VStack } from '@ijstech/components';
    import { IData, ViewModeType } from "@scom/scom-map/interface.ts";
    import "@scom/scom-map/index.css.ts";
    interface ScomMapElement extends ControlElement {
        lazyLoad?: boolean;
        long?: number;
        lat?: number;
        viewMode?: ViewModeType;
        zoom?: number;
        address?: string;
        showHeader?: boolean;
        showFooter?: boolean;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['i-scom-map']: ScomMapElement;
            }
        }
    }
    export default class ScomMap extends Module {
        private data;
        private iframeElm;
        private dappContainer;
        tag: any;
        readonly onConfirm: () => Promise<void>;
        readonly onDiscard: () => Promise<void>;
        readonly onEdit: () => Promise<void>;
        defaultEdit?: boolean;
        validate?: () => boolean;
        edit: () => Promise<void>;
        confirm: () => Promise<void>;
        discard: () => Promise<void>;
        constructor(parent?: Container, options?: any);
        init(): void;
        static create(options?: ScomMapElement, parent?: Container): Promise<ScomMap>;
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
        get showFooter(): boolean;
        set showFooter(value: boolean);
        get showHeader(): boolean;
        set showHeader(value: boolean);
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
            getData: any;
            setData: (data: IData) => Promise<void>;
            getTag: any;
            setTag: any;
            getLinkParams?: undefined;
            setLinkParams?: undefined;
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
            getLinkParams: () => {
                data: string;
            };
            setLinkParams: (params: any) => Promise<void>;
            getData: any;
            setData: any;
            getTag: any;
            setTag: any;
        })[];
        private getData;
        private setData;
        private getTag;
        private setTag;
        private _getActions;
        render(): any;
    }
}
