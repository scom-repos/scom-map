export const state = {
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
