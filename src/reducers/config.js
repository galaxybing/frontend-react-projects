/* 
  es6
    import config from './config';
*/
const initialState = {
  user: null,
  isLoading: false
}

export default function config(state = initialState, action){ // {type, source}
  if(action.type === 'USER_LOGGING_IN') {
    return {
      ...initialState,
      isLoading: true,
    }
  }
  // 
  if(action.type === 'USER_LOGGED_IN') {
    let data = action.data
    return {
      user: data,
      isLoading: false,
    }
  }
  if(action.type === 'USER_LOGGED_OUT') {
    return initialState
  }
  return state
}
