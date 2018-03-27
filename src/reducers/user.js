const initialState = {
  data: null,
  isLoading: false
}

function user (state = initialState, action) { // { type, data }
  if (action.type === 'USER_LOGGING_IN') {
    return {
      ...initialState,
      isLoading: true
    }
  }
  if (action.type === 'USER_LOGGED_IN') {
    const { data } = action;
    return {
      data: data,
      isLoading: false
    }
  }
  if (action.type === 'USER_LOGGED_OUT') {
    return initialState
  }

  return state;
}

module.exports = user
