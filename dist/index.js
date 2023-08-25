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
define("@scom/scom-map/data.json.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ///<amd-module name='@scom/scom-map/data.json.ts'/> 
    exports.default = {
        "apiKey": "AIzaSyDc7PnOq3Hxzq6dxeUVaY8WGLHIePl0swY",
        "apiUrl": "https://www.google.com/maps/embed/v1/place",
        "defaultBuilderData": {
            "lat": 40.748817,
            "long": -73.985428,
            "address": "Empire State Building, 350 5th Ave, New York, NY 10118, USA",
            "zoom": 15
        }
    };
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
define("@scom/scom-map/config/index.css.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Theme = components_2.Styles.Theme.ThemeVars;
    exports.default = components_2.Styles.cssRule('i-scom-map-config', {
        $nest: {}
    });
});
define("@scom/scom-map/config/index.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-map/utils.ts", "@scom/scom-map/config/index.css.ts"], function (require, exports, components_3, utils_1) {
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
            this.formEl.jsonSchema = (0, utils_1.getPropertiesSchema)();
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
            const url = (0, utils_1.getUrl)(Object.assign({}, this._data));
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
                const url = (0, utils_1.getUrl)(Object.assign({}, data));
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
            const long = this.getAttribute('long', true, utils_1.DEFAULT_LONG);
            const lat = this.getAttribute('lat', true, utils_1.DEFAULT_LAT);
            const viewMode = this.getAttribute('viewMode', true, utils_1.DEFAULT_VIEW_MODE);
            const zoom = this.getAttribute('zoom', true, utils_1.DEFAULT_ZOOM);
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
define("@scom/scom-map", ["require", "exports", "@ijstech/components", "@scom/scom-map/store.ts", "@scom/scom-map/data.json.ts", "@scom/scom-map/utils.ts", "@scom/scom-map/config/index.tsx", "@scom/scom-map/index.css.ts"], function (require, exports, components_4, store_2, data_json_1, utils_2, index_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Theme = components_4.Styles.Theme.ThemeVars;
    let ScomMap = class ScomMap extends components_4.Module {
        constructor(parent, options) {
            super(parent, options);
            this.data = {};
            if (data_json_1.default) {
                (0, store_2.setDataFromSCConfig)(data_json_1.default);
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
            const lazyLoad = this.getAttribute('lazyLoad', true, false);
            if (!lazyLoad) {
                this.data.long = this.getAttribute('long', true, utils_2.DEFAULT_LONG);
                this.data.lat = this.getAttribute('lat', true, utils_2.DEFAULT_LAT);
                this.data.viewMode = this.getAttribute('viewMode', true, utils_2.DEFAULT_VIEW_MODE);
                this.data.zoom = this.getAttribute('zoom', true, utils_2.DEFAULT_ZOOM);
                this.data.address = this.getAttribute('address', true, '');
                this.data.showHeader = this.getAttribute('showHeader', true, false);
                this.data.showFooter = this.getAttribute('showFooter', true, false);
                this.setData(this.data);
            }
        }
        static async create(options, parent) {
            let self = new this(parent, options);
            await self.ready();
            return self;
        }
        get long() {
            var _a;
            return (_a = this.data.long) !== null && _a !== void 0 ? _a : utils_2.DEFAULT_LONG;
        }
        set long(value) {
            this.data.long = value;
        }
        get lat() {
            var _a;
            return (_a = this.data.lat) !== null && _a !== void 0 ? _a : utils_2.DEFAULT_LAT;
        }
        set lat(value) {
            this.data.lat = value;
        }
        get viewMode() {
            var _a;
            return (_a = this.data.viewMode) !== null && _a !== void 0 ? _a : utils_2.DEFAULT_VIEW_MODE;
        }
        set viewMode(value) {
            this.data.viewMode = value;
        }
        get address() {
            var _a;
            return (_a = this.data.address) !== null && _a !== void 0 ? _a : '';
        }
        set address(value) {
            this.data.address = value;
        }
        get zoom() {
            var _a;
            return (_a = this.data.zoom) !== null && _a !== void 0 ? _a : utils_2.DEFAULT_ZOOM;
        }
        set zoom(value) {
            this.data.zoom = value;
        }
        get showFooter() {
            var _a;
            return (_a = this.data.showFooter) !== null && _a !== void 0 ? _a : false;
        }
        set showFooter(value) {
            this.data.showFooter = value;
            if (this.dappContainer)
                this.dappContainer.showFooter = this.showFooter;
        }
        get showHeader() {
            var _a;
            return (_a = this.data.showHeader) !== null && _a !== void 0 ? _a : false;
        }
        set showHeader(value) {
            this.data.showHeader = value;
            if (this.dappContainer)
                this.dappContainer.showHeader = this.showHeader;
        }
        getConfigurators() {
            const self = this;
            return [
                {
                    name: 'Builder Configurator',
                    target: 'Builders',
                    getActions: () => {
                        const propertiesSchema = (0, utils_2.getPropertiesSchema)();
                        const themeSchema = (0, utils_2.getThemeSchema)();
                        return this._getActions(propertiesSchema, themeSchema);
                    },
                    getData: this.getData.bind(this),
                    setData: async (data) => {
                        const defaultData = data_json_1.default.defaultBuilderData;
                        await this.setData(Object.assign(Object.assign({}, defaultData), data));
                    },
                    getTag: this.getTag.bind(this),
                    setTag: this.setTag.bind(this)
                },
                {
                    name: 'Emdedder Configurator',
                    target: 'Embedders',
                    getActions: () => {
                        const propertiesSchema = (0, utils_2.getPropertiesSchema)();
                        const themeSchema = (0, utils_2.getThemeSchema)(true);
                        return this._getActions(propertiesSchema, themeSchema);
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
                            let resultingData = Object.assign(Object.assign({}, self.data), newData);
                            await this.setData(resultingData);
                        }
                    },
                    getData: this.getData.bind(this),
                    setData: this.setData.bind(this),
                    getTag: this.getTag.bind(this),
                    setTag: this.setTag.bind(this)
                }
            ];
        }
        getData() {
            return this.data;
        }
        async setData(value) {
            this.data = value;
            const url = (0, utils_2.getUrl)(Object.assign({}, this.data));
            this.iframeElm.url = url;
            if (this.dappContainer) {
                this.dappContainer.setData({
                    showHeader: this.showHeader,
                    showFooter: this.showFooter
                });
            }
        }
        getTag() {
            return this.tag;
        }
        async setTag(value) {
            var _a, _b;
            this.tag = value;
            if (this.dappContainer) {
                if ((_a = this.tag) === null || _a === void 0 ? void 0 : _a.width)
                    this.dappContainer.width = this.tag.width;
                if ((_b = this.tag) === null || _b === void 0 ? void 0 : _b.height)
                    this.dappContainer.height = this.tag.height;
            }
        }
        _getActions(settingSchema, themeSchema) {
            const actions = [
                {
                    name: 'Edit',
                    icon: 'edit',
                    command: (builder, userInputData) => {
                        let oldData = {};
                        return {
                            execute: () => {
                                oldData = Object.assign({}, this.data);
                                if ((userInputData === null || userInputData === void 0 ? void 0 : userInputData.long) !== undefined)
                                    this.data.long = userInputData.long;
                                if ((userInputData === null || userInputData === void 0 ? void 0 : userInputData.lat) !== undefined)
                                    this.data.lat = userInputData.lat;
                                if ((userInputData === null || userInputData === void 0 ? void 0 : userInputData.viewMode) !== undefined)
                                    this.data.viewMode = userInputData.viewMode;
                                if ((userInputData === null || userInputData === void 0 ? void 0 : userInputData.zoom) !== undefined)
                                    this.data.zoom = userInputData.zoom;
                                if ((userInputData === null || userInputData === void 0 ? void 0 : userInputData.address) !== undefined)
                                    this.data.address = userInputData.address;
                                if ((userInputData === null || userInputData === void 0 ? void 0 : userInputData.apiKey) !== undefined)
                                    this.data.apiKey = userInputData.apiKey;
                                this.iframeElm.url = (0, utils_2.getUrl)(Object.assign({}, this.data));
                                if (builder === null || builder === void 0 ? void 0 : builder.setData)
                                    builder.setData(this.data);
                            },
                            undo: () => {
                                this.data = Object.assign({}, oldData);
                                this.iframeElm.url = (0, utils_2.getUrl)(Object.assign({}, this.data));
                                if (builder === null || builder === void 0 ? void 0 : builder.setData)
                                    builder.setData(this.data);
                            },
                            redo: () => { },
                        };
                    },
                    customUI: {
                        render: (data, onConfirm) => {
                            const vstack = new components_4.VStack(null, { gap: '1rem' });
                            const config = new index_1.default(null, Object.assign({}, this.data));
                            const hstack = new components_4.HStack(null, {
                                verticalAlignment: 'center',
                                horizontalAlignment: 'end'
                            });
                            const button = new components_4.Button(null, {
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
                                    onConfirm(true, Object.assign(Object.assign({}, this.data), config.data));
                                }
                            };
                            return vstack;
                        }
                    }
                },
            ];
            return actions;
        }
        render() {
            return (this.$render("i-scom-dapp-container", { id: "dappContainer", showWalletNetwork: false, display: "block", maxWidth: "100%" },
                this.$render("i-iframe", { id: "iframeElm", width: "100%", height: "100%", display: "flex" })));
        }
    };
    ScomMap = __decorate([
        components_4.customModule,
        (0, components_4.customElements)('i-scom-map')
    ], ScomMap);
    exports.default = ScomMap;
});
