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
    exports.getAPIUrl = exports.setAPIUrl = exports.getAPIKey = exports.setAPIKey = exports.getEmbeddedUrl = exports.setEmbeddedUrl = exports.setDataFromSCConfig = exports.state = void 0;
    ///<amd-module name='@scom/scom-map/store.ts'/> 
    exports.state = {
        embeddedUrl: "",
        apiKey: "",
        apiUrl: ""
    };
    const setDataFromSCConfig = (options) => {
        if (options.apiKey) {
            exports.setAPIKey(options.apiKey);
        }
        if (options.apiUrl) {
            exports.setAPIUrl(options.apiUrl);
        }
        if (options.embeddedUrl) {
            exports.setEmbeddedUrl(options.embeddedUrl);
        }
    };
    exports.setDataFromSCConfig = setDataFromSCConfig;
    const setEmbeddedUrl = (url) => {
        exports.state.embeddedUrl = url;
    };
    exports.setEmbeddedUrl = setEmbeddedUrl;
    const getEmbeddedUrl = () => {
        return exports.state.embeddedUrl;
    };
    exports.getEmbeddedUrl = getEmbeddedUrl;
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
define("@scom/scom-map/index.css.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Theme = components_1.Styles.Theme.ThemeVars;
    components_1.Styles.cssRule('#pnlImage', {
        $nest: {
            '.custom-img img': {
                objectFit: 'cover',
                objectPosition: 'center',
                width: '100%',
                height: '100%',
                maxWidth: 'none',
                maxHeight: 'none'
            },
            '#imgLink span': {
                display: 'block'
            },
            '#edtLink input': {
                border: `1px solid ${Theme.divider}`
            },
            ".angle": {
                zIndex: '200',
                position: 'absolute',
                width: '30px',
                height: '30px',
                background: 'black',
                clipPath: "polygon(0 0, 0 100%, 20% 100%, 20% 20%, 100% 20%, 100% 0)"
            },
            ".transform": {
                transformOrigin: "left top"
            },
            ".angle-nw:hover": {
                cursor: 'nw-resize',
                background: 'blue'
            },
            ".angle-ne:hover": {
                cursor: 'ne-resize',
                background: 'blue'
            },
            ".angle-sw:hover": {
                cursor: 'sw-resize',
                background: 'blue'
            },
            ".angle-se:hover": {
                cursor: 'se-resize',
                background: 'blue'
            },
            ".angle-ne": {
                transform: "rotate(90deg)"
            },
            ".angle-se": {
                transform: "rotate(180deg)"
            },
            ".angle-sw": {
                transform: "rotate(270deg)"
            },
            ".canvas": {
                zIndex: '180',
                position: 'absolute',
                top: '0px',
                left: '0px'
            },
            ".canvas-line": {
                zIndex: '190',
                position: 'absolute',
                top: '0px',
                left: '0px'
            }
        }
    });
});
define("@scom/scom-map/scconfig.json.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ///<amd-module name='@scom/scom-map/scconfig.json.ts'/> 
    exports.default = {
        "name": "@scom-map/main",
        "version": "0.1.0",
        "env": "",
        "moduleDir": "src",
        "main": "@scom-map/main",
        "modules": {},
        "apiKey": "AIzaSyDlYg9elOfuDfsnEyzONb5kf62pplJKlzM",
        "apiUrl": "https://maps.googleapis.com/maps/api/js?key={API_KEY}&callback=initMap",
        "embeddedUrl": "https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q={lat},{long}&amp;t=h&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
        // "embeddedUrl": "https://www.google.com/maps/embed/v1/place?key={API_KEY}&q={lat},{long}"
    };
});
define("@scom/scom-map", ["require", "exports", "@ijstech/components", "@scom/scom-map/store.ts", "@scom/scom-map/scconfig.json.ts", "@scom/scom-map/index.css.ts"], function (require, exports, components_2, store_1, scconfig_json_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const configSchema = {
        type: 'object',
        required: [],
        properties: {
            width: {
                type: 'string',
            },
            height: {
                type: 'string',
            },
        },
    };
    let ScomMap = class ScomMap extends components_2.Module {
        constructor(parent, options) {
            super(parent, options);
            this.data = {
                long: 0,
                lat: 0
            };
            this.oldData = {
                long: 0,
                lat: 0
            };
            if (scconfig_json_1.default) {
                store_1.setDataFromSCConfig(scconfig_json_1.default);
            }
        }
        get apiUrl() {
            return store_1.getAPIUrl().replace('{API_KEY}', store_1.getAPIKey());
        }
        get embeddedUrl() {
            return store_1.getEmbeddedUrl()
                .replace('{API_KEY}', store_1.getAPIKey());
        }
        // private loadScript() {
        //   const scripts = document.getElementsByTagName('script')
        //   const added = Array.from(scripts).find(script => script.id === 'embeddedScript')
        //   if (added) return;
        //   let newScript = document.createElement('script');
        //   newScript.id = 'embeddedScript'
        //   newScript.setAttribute('src', this.apiUrl);
        //   document.body.appendChild(newScript);
        // }
        // private initMap() {
        //   let self = this;
        //   let map: google.maps.Map;
        //   map = new google.maps.Map(self.pnlMap as HTMLElement, {
        //     center: { lat: -34.397, lng: 150.644 },
        //     zoom: 8,
        //   });
        // }
        init() {
            super.init();
            const width = this.getAttribute('width', true);
            const height = this.getAttribute('height', true);
            this.setTag({
                width: width ? this.width : '500px',
                height: height ? this.height : '300px'
            });
            const long = this.getAttribute('long', true, 0);
            const lat = this.getAttribute('lat', true, 0);
            this.setData({ long, lat });
        }
        static async create(options, parent) {
            let self = new this(parent, options);
            await self.ready();
            return self;
        }
        get long() {
            var _a;
            return (_a = this.data.long) !== null && _a !== void 0 ? _a : 0;
        }
        set long(value) {
            this.data.long = value;
        }
        get lat() {
            var _a;
            return (_a = this.data.lat) !== null && _a !== void 0 ? _a : 0;
        }
        set lat(value) {
            this.data.lat = value;
        }
        getConfigSchema() {
            return configSchema;
        }
        getData() {
            return this.data;
        }
        async setData(value) {
            this.oldData = this.data;
            this.data = value;
            const url = this.embeddedUrl.replace('{lat}', this.data.lat.toString()).replace('{long}', this.data.long.toString());
            this.iframeElm.url = url;
        }
        getTag() {
            return this.tag;
        }
        async setTag(value) {
            this.tag = value;
            if (this.iframeElm) {
                this.iframeElm.display = "block";
                this.iframeElm.width = this.tag.width;
                this.iframeElm.height = this.tag.height;
            }
        }
        getEmbedderActions() {
            const propertiesSchema = {
                type: 'object',
                properties: {
                    url: {
                        type: 'string',
                        minLength: 1,
                        required: true,
                    },
                },
            };
            const themeSchema = {
                type: 'object',
                properties: {
                    width: {
                        type: 'string',
                        readOnly: true,
                    },
                    height: {
                        type: 'string',
                        readOnly: true,
                    },
                },
            };
            return this._getActions(propertiesSchema, themeSchema);
        }
        getActions() {
            const propertiesSchema = {
                type: 'object',
                properties: {
                    url: {
                        type: 'string',
                        minLength: 1,
                        required: true,
                    },
                },
            };
            const themeSchema = {
                type: 'object',
                properties: {
                    width: {
                        type: 'string',
                    },
                    height: {
                        type: 'string',
                    },
                },
            };
            return this._getActions(propertiesSchema, themeSchema);
        }
        _getActions(settingSchema, themeSchema) {
            const actions = [
                {
                    name: 'Settings',
                    icon: 'cog',
                    command: (builder, userInputData) => {
                        return {
                            execute: () => {
                                if (builder === null || builder === void 0 ? void 0 : builder.setData)
                                    builder.setData(userInputData);
                                this.setData(userInputData);
                            },
                            undo: () => {
                                if (builder === null || builder === void 0 ? void 0 : builder.setData)
                                    builder.setData(this.oldData);
                                this.setData(this.oldData);
                            },
                            redo: () => { },
                        };
                    },
                    userInputDataSchema: settingSchema,
                },
            ];
            return actions;
        }
        render() {
            return (this.$render("i-panel", null,
                this.$render("i-iframe", { id: "iframeElm" })));
        }
    };
    ScomMap = __decorate([
        components_2.customModule,
        components_2.customElements('i-scom-map')
    ], ScomMap);
    exports.default = ScomMap;
});
