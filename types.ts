export enum MarkerType {
    Activity = 'activity',
    Warning = 'warning',
    User = 'user',
}

export interface LocationData {
    locationName: string;
    latitude: number;
    longitude: number;
    type: MarkerType.Activity | MarkerType.Warning;
    time: string | null;
    originalText: string;
}

export interface MarkerData extends LocationData {
    id: string;
}

export type UserLocation = {
    latitude: number;
    longitude: number;
};