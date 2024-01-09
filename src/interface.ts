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
    // Properties
    getActions: () => IPageBlockAction[];
    getData: () => any;
    setData: (data: any) => Promise<void>;
    getTag: () => any;
    setTag: (tag: any) => Promise<void>
    defaultEdit?: boolean;
    tag?: any;
    validate?: () => boolean;
}

export type ViewModeType = 'roadmap' | 'satellite'

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

export interface IMapPlacePrediction {
    description: string;
    placeId: string;
    mainText: string;
    secondaryText?: string;
    types: string[];
}