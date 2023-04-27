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
/// <amd-module name="@scom/scom-map/scconfig.json.ts" />
declare module "@scom/scom-map/scconfig.json.ts" {
    const _default: {
        name: string;
        version: string;
        env: string;
        moduleDir: string;
        main: string;
        modules: {};
        apiKey: string;
        apiUrl: string;
        embeddedUrl: string;
    };
    export default _default;
}
/// <amd-module name="@scom/scom-map/index.css.ts" />
declare module "@scom/scom-map/index.css.ts" { }
/// <amd-module name="@scom/scom-map" />
declare module "@scom/scom-map" {
    import { Module, IDataSchema, Container, ControlElement } from '@ijstech/components';
    import { IData, PageBlock, ViewModeType } from "@scom/scom-map/interface.ts";
    import "@scom/scom-map/index.css.ts";
    interface ScomMapElement extends ControlElement {
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
    export default class ScomMap extends Module implements PageBlock {
        private data;
        private oldData;
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
        getConfigSchema(): {
            type: string;
            required: any[];
            properties: {
                width: {
                    type: string;
                };
                height: {
                    type: string;
                };
            };
        };
        getData(): IData;
        private getUrl;
        setData(value: IData): Promise<void>;
        getTag(): any;
        setTag(value: any): Promise<void>;
        private getPropertiesSchema;
        getEmbedderActions(): {
            name: string;
            icon: string;
            command: (builder: any, userInputData: any) => {
                execute: () => void;
                undo: () => void;
                redo: () => void;
            };
            userInputDataSchema: IDataSchema;
        }[];
        getActions(): {
            name: string;
            icon: string;
            command: (builder: any, userInputData: any) => {
                execute: () => void;
                undo: () => void;
                redo: () => void;
            };
            userInputDataSchema: IDataSchema;
        }[];
        _getActions(settingSchema: IDataSchema, themeSchema: IDataSchema): {
            name: string;
            icon: string;
            command: (builder: any, userInputData: any) => {
                execute: () => void;
                undo: () => void;
                redo: () => void;
            };
            userInputDataSchema: IDataSchema;
        }[];
        render(): any;
    }
}
