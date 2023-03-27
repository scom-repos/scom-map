export const state = {
  embeddedUrl: "",
  apiKey: "",
  apiUrl: ""
}

export const setDataFromSCConfig = (options: any) => {
  if (options.apiKey) {
    setAPIKey(options.apiKey);
  }
  if (options.apiUrl) {
    setAPIUrl(options.apiUrl);
  }
  if (options.embeddedUrl) {
    setEmbeddedUrl(options.embeddedUrl);
  }
}

export const setEmbeddedUrl = (url: string) => {
  state.embeddedUrl = url;
}

export const getEmbeddedUrl = () => {
  return state.embeddedUrl;
}

export const setAPIKey = (value: string) => {
  state.apiKey = value;
}

export const getAPIKey = () => {
  return state.apiKey;
}

export const setAPIUrl = (value: string) => {
  state.apiUrl = value;
}

export const getAPIUrl = () => {
  return state.apiUrl;
}
