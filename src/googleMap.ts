import { Panel } from "@ijstech/components";
import { IMapPlacePrediction } from "./interface";

declare var google: any;

export class GoogleMap {
    private pnlMap: Panel;
    private map: any;
    private geocoder: any;
    private center: any;
    private placeService: any;
    private autocompleteService: any;
    private markers: any[] = [];
    private zoom: number;

    constructor(pnlMap: Panel) {
        this.pnlMap = pnlMap;
    }

    handleMapsAPICallback() {
        this.zoom = this.getZoom() + 1;
        this.center = this.getCenter();
        this.initializeMap();
    }

    initializeMap() {
        this.markers = [];
        this.map = undefined;
        this.geocoder = new google.maps.Geocoder();
        this.map = new google.maps.Map(this.pnlMap, {
            zoom: 15,
            mapTypeControl: false
        });

        if (!this.placeService)
            this.placeService = new google.maps.places.PlacesService(this.map);

        if (!this.autocompleteService)
            this.autocompleteService = new google.maps.places.AutocompleteService();
    }

    getZoom(): number {
        let value;
        if (this.map) {
            value = this.map.getZoom();
        }
        return value;
    }

    getCenter(): { lat: number, lng: number } {
        let value;
        if (this.map) {
            const center = this.map.getCenter();
            value = {
                "lat": center.lat(),
                "lng": center.lng()
            }
        }
        return value;
    }

    createMapMarker(location: { lat: number, lng: number }) {
        if (!location) return;
        const marker = new google.maps.Marker({
            map: this.map,
            position: location,
        });
        this.markers.push(marker);
    }

    createLatLngObject(lat: number, lng: number) {
        return new google.maps.LatLng(lat, lng)
    }

    searchPlaces(lat: number, lng: number, value: string): Promise<any> {
        return new Promise((resolve, reject) => {
            if (this.geocoder) {
                let keyword = value;
                let latlng = this.createLatLngObject(lat, lng);
                let request = {
                    'location': latlng,
                    'rankBy': google.maps.places.RankBy.DISTANCE,
                    'keyword': keyword
                };
                let self = this;
                if (!this.placeService)
                    this.placeService = new google.maps.places.PlacesService(this.map);

                this.placeService.search(request, function (result, status, next_page_token) {
                    if (status == google.maps.places.PlacesServiceStatus.OK) {
                        for (let i = 0; i < result.length; i++) {
                            let item = result[i];
                            let lat2 = item.geometry.location.lat()
                            let lng2 = item.geometry.location.lng()
                            item['distance'] = self.getDistance(lat, lng, lat2, lng2);
                        }
                        resolve(result);
                    } else {
                        reject(new Error('Failed to search places'));
                    }
                });
            } else {
                reject(new Error('Geocoder is not initialized'));
            }
        });
    }

    getDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
        function deg2rad(deg: number) {
            return deg * (Math.PI / 180)
        }
        let R = 6371; // Radius of the earth in km
        let dLat = deg2rad(lat2 - lat1); // deg2rad below
        let dLng = deg2rad(lng2 - lng1);
        let a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        let d = R * c; // Distance in km
        return Math.round(d * 1000);
    }

    getLatLngFromAddress(value: string): Promise<{ lat: number, lng: number }> {
        return new Promise((resolve, reject) => {
            if (this.map) {
                this.geocoder.geocode({
                    'address': value
                }, function (results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        let latlng = results[0].geometry.location;
                        let point = {
                            "lat": latlng.lat(),
                            "lng": latlng.lng()
                        }
                        resolve(point);
                    } else {
                        reject(new Error('Failed to get location'));
                    }
                });
            } else {
                reject(new Error('Map is not initialized'));
            }
        });
    }

    getPlacePredictions(input: string): Promise<IMapPlacePrediction[]> {
        if (!input) return Promise.resolve([]);
        return new Promise((resolve, reject) => {
            this.autocompleteService.getPlacePredictions({ input }, (predictions, status) => {
                if (status !== google.maps.places.PlacesServiceStatus.OK) {
                    reject(status);
                } else {
                    resolve(predictions.map(prediction => {
                        return {
                            description: prediction.description,
                            placeId: prediction.place_id,
                            mainText: prediction.structured_formatting.main_text,
                            secondaryText: prediction.structured_formatting.secondary_text,
                            types: prediction.types
                        }
                    }));
                }
            });
        });
    }

    clearMarkers() {
        this.markers.forEach(marker => {
            marker.setMap(null);
        });
        this.markers = [];
    }

    markPlaceOnMapByLatLng(lat: number, lng: number): void {
        if (!lat || !lng) return;
        this.clearMarkers();
        const location = new google.maps.LatLng(lat, lng);
        this.map.setCenter(location);
        this.createMapMarker(location);
    }

    markPlaceOnMapByPlaceId(placeId: string): Promise<{ lat: number, lng: number, address: string }> {
        if (!placeId) return Promise.resolve({ lat: 0, lng: 0, address: '' })
        this.clearMarkers();
        return new Promise((resolve, reject) => {
            const request = {
                placeId: placeId,
                fields: ['name', 'formatted_address', 'geometry']
            };

            this.placeService.getDetails(request, (place, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    this.map.setCenter(place.geometry.location);
                    this.createMapMarker(place.geometry.location);
                    resolve({
                        lat: place.geometry.location.lat(),
                        lng: place.geometry.location.lng(),
                        address: `${place.name}, ${place.formatted_address}`
                    });
                } else {
                    reject(status);
                }
            });
        });
    }

    markPlaceOnMapByQuery(query: string): Promise<{ lat: number, lng: number, address: string }> {
        if (!query) return Promise.resolve({ lat: 0, lng: 0, address: '' });
        this.clearMarkers();
        return new Promise((resolve, reject) => {
            const request = {
                query,
                fields: ['name', 'formatted_address', 'geometry']
            };

            this.placeService.findPlaceFromQuery(request, (results, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                    let firstResult = results[0];
                    let firstLocation = firstResult.geometry.location;
                    // for (let i = 0; i < results.length; i++) {
                    //     this.createMapMarker(results[i].geometry.location);
                    // }
                    this.map.setCenter(firstLocation);
                    this.createMapMarker(firstLocation);
                    resolve({
                        lat: firstLocation.lat(),
                        lng: firstLocation.lng(),
                        address: `${firstResult.name}, ${firstResult.formatted_address}`
                    });
                } else {
                    reject(status);
                }
            });
        });
    }
}