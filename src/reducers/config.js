const initialState = {
  data: null,
  version: undefined,
}

export default function config(state = initialState, action){
  if (action.type === 'APP_VERSION_UPDATE') {
    const version = action.data;
    return {
      ...state,
      version,
    }
  }
  return state
}
