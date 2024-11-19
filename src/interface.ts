import { VStack } from "@ijstech/components";

export type ViewModeType = 'roadmap' | 'satellite'

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

export interface ICustomUI {
    render: () => VStack;
}