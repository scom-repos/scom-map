var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define("@scom/scom-map/interface.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("@scom/scom-map/index.css.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Theme = components_1.Styles.Theme.ThemeVars;
    components_1.Styles.cssRule('i-scom-map', {
        $nest: {
            '#pnlModule': {
                height: '100%'
            }
        }
    });
});
define("@scom/scom-map/store.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getAPIUrl = exports.setAPIUrl = exports.getAPIKey = exports.setAPIKey = exports.setDataFromSCConfig = exports.state = void 0;
    ///<amd-module name='@scom/scom-map/store.ts'/> 
    exports.state = {
        apiKey: "",
        apiUrl: ""
    };
    const setDataFromSCConfig = (options) => {
        if (options.apiKey) {
            (0, exports.setAPIKey)(options.apiKey);
        }
        if (options.apiUrl) {
            (0, exports.setAPIUrl)(options.apiUrl);
        }
    };
    exports.setDataFromSCConfig = setDataFromSCConfig;
    const setAPIKey = (value) => {
        exports.state.apiKey = value;
    };
    exports.setAPIKey = setAPIKey;
    const getAPIKey = () => {
        return exports.state.apiKey;
    };
    exports.getAPIKey = getAPIKey;
    const setAPIUrl = (value) => {
        exports.state.apiUrl = value;
    };
    exports.setAPIUrl = setAPIUrl;
    const getAPIUrl = () => {
        return exports.state.apiUrl;
    };
    exports.getAPIUrl = getAPIUrl;
});
define("@scom/scom-map/utils.ts", ["require", "exports", "@scom/scom-map/store.ts"], function (require, exports, store_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getUrl = exports.getThemeSchema = exports.getPropertiesSchema = exports.DEFAULT_VIEW_MODE = exports.DEFAULT_LAT = exports.DEFAULT_LONG = exports.DEFAULT_ZOOM = void 0;
    exports.DEFAULT_ZOOM = 14;
    exports.DEFAULT_LONG = 0;
    exports.DEFAULT_LAT = 0;
    exports.DEFAULT_VIEW_MODE = 'roadmap';
    const getPropertiesSchema = () => {
        const propertiesSchema = {
            type: 'object',
            properties: {
                address: {
                    type: 'string'
                },
                // lat: {
                //   type: 'number',
                //   title: 'Latitude',
                //   readOnly: true
                // },
                // long: {
                //   type: 'number',
                //   title: 'Longitude',
                //   readOnly: true
                // },
                zoom: {
                    type: 'number',
                    minimum: 0,
                    maximum: 21,
                    default: exports.DEFAULT_ZOOM
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
        };
        return propertiesSchema;
    };
    exports.getPropertiesSchema = getPropertiesSchema;
    const getThemeSchema = (readOnly = false) => {
        const themeSchema = {
            type: 'object',
            properties: {
                width: {
                    type: 'string',
                    readOnly
                },
                height: {
                    type: 'string',
                    readOnly
                },
            },
        };
        return themeSchema;
    };
    exports.getThemeSchema = getThemeSchema;
    const getUrl = (data, isCentered) => {
        const { address = '', lat = exports.DEFAULT_LAT, long = exports.DEFAULT_LONG, zoom = exports.DEFAULT_ZOOM, viewMode = exports.DEFAULT_VIEW_MODE } = data || {};
        const baseUrl = (0, store_1.getAPIUrl)();
        const params = new URLSearchParams();
        const apiKey = data.apiKey || (0, store_1.getAPIKey)() || '';
        params.append('key', apiKey);
        const position = `${lat},${long}`;
        if (address) {
            params.append('q', address);
            if ((lat || long) && isCentered)
                params.append('center', position);
        }
        else {
            params.append('q', position);
        }
        params.append('zoom', zoom.toString());
        params.append('maptype', viewMode);
        return `${baseUrl}?${params.toString()}`;
    };
    exports.getUrl = getUrl;
});
define("@scom/scom-map/data.json.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ///<amd-module name='@scom/scom-map/data.json.ts'/> 
    exports.default = {
        "apiKey": "AIzaSyDc7PnOq3Hxzq6dxeUVaY8WGLHIePl0swY",
        "apiUrl": "https://www.google.com/maps/embed/v1/place",
        "defaultBuilderData": {
            "zoom": 15
        }
    };
});
define("@scom/scom-map/googleMap.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.GoogleMap = void 0;
    class GoogleMap {
        constructor(pnlMap) {
            this.markers = [];
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
                mapTypeControl: false,
                gestureHandling: 'cooperative'
            });
            if (!this.placeService)
                this.placeService = new google.maps.places.PlacesService(this.map);
            if (!this.autocompleteService)
                this.autocompleteService = new google.maps.places.AutocompleteService();
        }
        getZoom() {
            let value;
            if (this.map) {
                value = this.map.getZoom();
            }
            return value;
        }
        getCenter() {
            let value;
            if (this.map) {
                const center = this.map.getCenter();
                value = {
                    "lat": center.lat(),
                    "lng": center.lng()
                };
            }
            return value;
        }
        createMapMarker(location) {
            if (!location)
                return;
            const marker = new google.maps.Marker({
                map: this.map,
                position: location,
            });
            this.markers.push(marker);
        }
        createLatLngObject(lat, lng) {
            return new google.maps.LatLng(lat, lng);
        }
        searchPlaces(lat, lng, value) {
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
                                let lat2 = item.geometry.location.lat();
                                let lng2 = item.geometry.location.lng();
                                item['distance'] = self.getDistance(lat, lng, lat2, lng2);
                            }
                            resolve(result);
                        }
                        else {
                            reject(new Error('Failed to search places'));
                        }
                    });
                }
                else {
                    reject(new Error('Geocoder is not initialized'));
                }
            });
        }
        getDistance(lat1, lng1, lat2, lng2) {
            function deg2rad(deg) {
                return deg * (Math.PI / 180);
            }
            let R = 6371; // Radius of the earth in km
            let dLat = deg2rad(lat2 - lat1); // deg2rad below
            let dLng = deg2rad(lng2 - lng1);
            let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
                    Math.sin(dLng / 2) * Math.sin(dLng / 2);
            let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            let d = R * c; // Distance in km
            return Math.round(d * 1000);
        }
        getLatLngFromAddress(value) {
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
                            };
                            resolve(point);
                        }
                        else {
                            reject(new Error('Failed to get location'));
                        }
                    });
                }
                else {
                    reject(new Error('Map is not initialized'));
                }
            });
        }
        getPlacePredictions(input) {
            if (!input)
                return Promise.resolve([]);
            return new Promise((resolve, reject) => {
                this.autocompleteService.getPlacePredictions({ input }, (predictions, status) => {
                    if (status !== google.maps.places.PlacesServiceStatus.OK) {
                        reject(status);
                    }
                    else {
                        resolve(predictions.map(prediction => {
                            return {
                                description: prediction.description,
                                placeId: prediction.place_id,
                                mainText: prediction.structured_formatting.main_text,
                                secondaryText: prediction.structured_formatting.secondary_text,
                                types: prediction.types
                            };
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
        markPlaceOnMapByLatLng(lat, lng) {
            if (!lat || !lng)
                return;
            this.clearMarkers();
            const location = new google.maps.LatLng(lat, lng);
            this.map.setCenter(location);
            this.createMapMarker(location);
        }
        markPlaceOnMapByPlaceId(placeId) {
            if (!placeId)
                return Promise.resolve({ lat: 0, lng: 0, address: '' });
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
                    }
                    else {
                        reject(status);
                    }
                });
            });
        }
        markPlaceOnMapByQuery(query) {
            if (!query)
                return Promise.resolve({ lat: 0, lng: 0, address: '' });
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
                    }
                    else {
                        reject(status);
                    }
                });
            });
        }
    }
    exports.GoogleMap = GoogleMap;
});
define("@scom/scom-map/model.ts", ["require", "exports", "@scom/scom-map/data.json.ts", "@scom/scom-map/store.ts", "@scom/scom-map/googleMap.ts", "@scom/scom-map/utils.ts"], function (require, exports, data_json_1, store_2, googleMap_1, utils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Model = exports.DEFAULT_ZOOM = void 0;
    exports.DEFAULT_ZOOM = 14;
    class Model {
        constructor(module) {
            this.data = {};
            if (data_json_1.default) {
                (0, store_2.setDataFromSCConfig)(data_json_1.default);
            }
            this.module = module;
        }
        get long() {
            return this.data.long ?? utils_1.DEFAULT_LONG;
        }
        set long(value) {
            this.data.long = value;
        }
        get lat() {
            return this.data.lat ?? utils_1.DEFAULT_LAT;
        }
        set lat(value) {
            this.data.lat = value;
        }
        get viewMode() {
            return this.data.viewMode ?? utils_1.DEFAULT_VIEW_MODE;
        }
        set viewMode(value) {
            this.data.viewMode = value;
        }
        get address() {
            return this.data.address ?? '';
        }
        set address(value) {
            this.data.address = value;
        }
        get zoom() {
            return this.data.zoom ?? exports.DEFAULT_ZOOM;
        }
        set zoom(value) {
            this.data.zoom = value;
        }
        getConfigurators(formAction) {
            const self = this;
            return [
                {
                    name: 'Builder Configurator',
                    target: 'Builders',
                    getActions: () => {
                        return this._getActions(formAction);
                    },
                    getData: this.getData.bind(this),
                    setData: async (data) => {
                        const defaultData = data_json_1.default.defaultBuilderData;
                        await this.setData({ ...defaultData, ...data });
                    },
                    getTag: this.getTag.bind(this),
                    setTag: this.setTag.bind(this)
                },
                {
                    name: 'Emdedder Configurator',
                    target: 'Embedders',
                    getActions: () => {
                        return this._getActions(formAction);
                    },
                    getLinkParams: () => {
                        const data = this.data || {};
                        return {
                            data: window.btoa(JSON.stringify(data))
                        };
                    },
                    setLinkParams: async (params) => {
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
                },
                {
                    name: 'Editor',
                    target: 'Editor',
                    getActions: () => {
                        return this._getActions(formAction);
                    },
                    getData: this.getData.bind(this),
                    setData: this.setData.bind(this),
                    getTag: this.getTag.bind(this),
                    setTag: this.setTag.bind(this)
                }
            ];
        }
        _getActions(formAction) {
            const actions = [
                {
                    name: 'Edit',
                    icon: 'edit',
                    command: (builder, userInputData) => {
                        let oldData = {};
                        return {
                            execute: () => {
                                oldData = { ...this.data };
                                if (userInputData?.long !== undefined)
                                    this.data.long = userInputData.long;
                                if (userInputData?.lat !== undefined)
                                    this.data.lat = userInputData.lat;
                                if (userInputData?.viewMode !== undefined)
                                    this.data.viewMode = userInputData.viewMode;
                                if (userInputData?.zoom !== undefined)
                                    this.data.zoom = userInputData.zoom;
                                if (userInputData?.address !== undefined)
                                    this.data.address = userInputData.address;
                                if (userInputData?.apiKey !== undefined)
                                    this.data.apiKey = userInputData.apiKey;
                                if (builder?.setData)
                                    builder.setData(this.data);
                            },
                            undo: () => {
                                this.data = { ...oldData };
                                if (builder?.setData)
                                    builder.setData(this.data);
                            },
                            redo: () => { },
                        };
                    },
                    customUI: formAction
                },
            ];
            return actions;
        }
        async setData(value) {
            this.data = {
                ...this.data,
                ...value
            };
            if (this.map) {
                if (this.data.lat && this.data.long) {
                    this.map.markPlaceOnMapByLatLng(this.data.lat, this.data.long);
                }
                else if (this.data.address) {
                    let { lat, lng } = await this.map.markPlaceOnMapByQuery(this.data.address);
                    this.data.lat = lat;
                    this.data.long = lng;
                }
            }
        }
        getData() {
            return this.data;
        }
        getTag() {
            return this.module.tag;
        }
        async setTag(value) {
            this.module.tag = value;
        }
        async initGoogleMap(pnlMap) {
            if (!window['google']?.maps)
                return;
            this.map = new googleMap_1.GoogleMap(pnlMap);
            this.map.handleMapsAPICallback();
        }
        async getPlacePredictions(input) {
            let predictions = await this.map.getPlacePredictions(input);
            return predictions;
        }
        async markPlaceOnMap(placeId) {
            let { lat, lng, address } = await this.map.markPlaceOnMapByPlaceId(placeId);
            this.data.lat = lat;
            this.data.long = lng;
            this.data.address = address;
        }
    }
    exports.Model = Model;
});
define("@scom/scom-map/config/index.css.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Theme = components_2.Styles.Theme.ThemeVars;
    exports.default = components_2.Styles.cssRule('i-scom-map-config', {
        $nest: {}
    });
});
define("@scom/scom-map/config/index.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-map/utils.ts", "@scom/scom-map/config/index.css.ts"], function (require, exports, components_3, utils_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let ScomMapConfig = class ScomMapConfig extends components_3.Module {
        constructor(parent, options) {
            super(parent, options);
            this.searchTimer = null;
            this.onInputChanged = this.onInputChanged.bind(this);
        }
        get data() {
            return this._data;
        }
        set data(value) {
            this._data = value;
            this.renderUI();
        }
        async updateData() {
            this._data = await this.formEl.getFormData();
        }
        renderUI() {
            this.formEl.clearInnerHTML();
            this.formEl.jsonSchema = (0, utils_2.getPropertiesSchema)();
            this.formEl.formOptions = {
                columnWidth: '100%',
                columnsPerRow: 2,
                confirmButtonOptions: {
                    hide: true
                }
            };
            this.formEl.renderForm();
            this.formEl.clearFormData();
            this.formEl.setFormData(this._data);
            const url = (0, utils_2.getUrl)({ ...this._data });
            this.iframeMap.url = url;
            const inputs = this.formEl.querySelectorAll('[scope]');
            for (let input of inputs) {
                const inputEl = input;
                // const scope: string = inputEl.getAttribute('scope', true, '')
                // if (scope.includes('/long') || scope.includes('/lat'))
                //   inputEl.readOnly = true
                inputEl.onChanged = this.onInputChanged;
            }
        }
        onInputChanged(target) {
            if (this.searchTimer)
                clearTimeout(this.searchTimer);
            this.searchTimer = setTimeout(async () => {
                const data = await this.formEl.getFormData();
                const url = (0, utils_2.getUrl)({ ...data });
                this.iframeMap.url = url;
            }, 500);
        }
        disconnectedCallback() {
            super.disconnectedCallback();
            if (this.searchTimer)
                clearTimeout(this.searchTimer);
        }
        async init() {
            super.init();
            const long = this.getAttribute('long', true, utils_2.DEFAULT_LONG);
            const lat = this.getAttribute('lat', true, utils_2.DEFAULT_LAT);
            const viewMode = this.getAttribute('viewMode', true, utils_2.DEFAULT_VIEW_MODE);
            const zoom = this.getAttribute('zoom', true, utils_2.DEFAULT_ZOOM);
            const address = this.getAttribute('address', true, '');
            this.data = { long, lat, viewMode, zoom, address };
        }
        render() {
            return (this.$render("i-panel", null,
                this.$render("i-vstack", { gap: '0.5rem' },
                    this.$render("i-panel", { id: 'pnlForm' },
                        this.$render("i-form", { id: 'formEl' })),
                    this.$render("i-panel", null,
                        this.$render("i-iframe", { id: 'iframeMap', width: '100%', height: 500, display: 'flex' })))));
        }
    };
    ScomMapConfig = __decorate([
        components_3.customModule,
        (0, components_3.customElements)('i-scom-map-config')
    ], ScomMapConfig);
    exports.default = ScomMapConfig;
});
define("@scom/scom-map", ["require", "exports", "@ijstech/components", "@scom/scom-map/utils.ts", "@scom/scom-map/model.ts", "@scom/scom-map/config/index.tsx", "@scom/scom-map/index.css.ts"], function (require, exports, components_4, utils_3, model_1, index_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Theme = components_4.Styles.Theme.ThemeVars;
    let ScomMap = class ScomMap extends components_4.Module {
        constructor(parent, options) {
            super(parent, options);
            this.initModel();
        }
        static async create(options, parent) {
            let self = new this(parent, options);
            await self.ready();
            return self;
        }
        get long() {
            return this.model.long ?? utils_3.DEFAULT_LONG;
        }
        get lat() {
            return this.model.lat ?? utils_3.DEFAULT_LAT;
        }
        get viewMode() {
            return this.model.viewMode ?? utils_3.DEFAULT_VIEW_MODE;
        }
        get address() {
            return this.model.address ?? '';
        }
        get zoom() {
            return this.model.zoom ?? utils_3.DEFAULT_ZOOM;
        }
        customUI() {
            return {
                render: (data, onConfirm) => {
                    const vstack = new components_4.VStack(null, { gap: '1rem' });
                    const config = new index_1.default(null, { ...this.model.getData() });
                    const hstack = new components_4.HStack(null, {
                        verticalAlignment: 'center',
                        horizontalAlignment: 'end'
                    });
                    const button = new components_4.Button(null, {
                        caption: 'Confirm',
                        height: 40,
                        font: { color: Theme.colors.primary.contrastText },
                        padding: { left: '1rem', right: '1rem' }
                    });
                    hstack.append(button);
                    vstack.append(config);
                    vstack.append(hstack);
                    button.onClick = async () => {
                        await config.updateData();
                        if (onConfirm) {
                            onConfirm(true, { ...this.model.getData(), ...config.data });
                        }
                    };
                    return vstack;
                }
            };
        }
        getConfigurators() {
            this.initModel();
            const customUI = this.customUI();
            return this.model.getConfigurators(customUI);
        }
        getData() {
            return this.model.getData();
        }
        async setData(value) {
            await this.model.setData(value);
        }
        getTag() {
            return this.tag;
        }
        async setTag(value) {
            await this.model.setTag(value);
        }
        async getPlacePredictions(input) {
            const predictions = await this.model.getPlacePredictions(input);
            return predictions;
        }
        async markPlaceOnMap(placeId) {
            await this.model.markPlaceOnMap(placeId);
        }
        async initGoogleMap() {
            await this.model.initGoogleMap(this.pnlMap);
        }
        initModel() {
            if (!this.model) {
                this.model = new model_1.Model(this);
            }
        }
        init() {
            super.init();
            const width = this.getAttribute('width', true);
            const height = this.getAttribute('height', true);
            this.setTag({
                width: width ? this.width : '500px',
                height: height ? this.height : '300px'
            });
            this.initGoogleMap();
            const lazyLoad = this.getAttribute('lazyLoad', true, false);
            if (!lazyLoad) {
                this.model.long = this.getAttribute('long', true, utils_3.DEFAULT_LONG);
                this.model.lat = this.getAttribute('lat', true, utils_3.DEFAULT_LAT);
                this.model.viewMode = this.getAttribute('viewMode', true, utils_3.DEFAULT_VIEW_MODE);
                this.model.zoom = this.getAttribute('zoom', true, utils_3.DEFAULT_ZOOM);
                this.model.address = this.getAttribute('address', true, '');
                const data = this.model.getData();
                this.setData(data);
            }
        }
        render() {
            return (this.$render("i-panel", { id: "pnlMap", width: "100%", height: "100%" }));
        }
    };
    ScomMap = __decorate([
        components_4.customModule,
        (0, components_4.customElements)('i-scom-map')
    ], ScomMap);
    exports.default = ScomMap;
});
