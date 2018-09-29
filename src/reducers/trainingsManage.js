const initialState = {
    list: [],
    total: null,
    page: null,
    visible: false,
    current: {}, // 添加 自定义人员 数据对象
    releaseLoading: false,
    insertQuestionsModalVisible: false,
    checkMemberModalVisible: false,
    query: {},
    // filter: initialFilter,
}

function trainingsManage(state = initialState, action) {
    if (action.type === 'trainingsManage/showChooseModal') {
      // const { current } = action.payload;
      return { ...state, visible: true, /* current, */releaseLoading: false };
    }
    
    if (action.type === 'trainingsManage/hiddenChooseModal') {
      return { ...state, visible: false };
    }
    
    if (action.type === 'trainingsManage/showReleaseLoading') {
      return { ...state, releaseLoading: true };
    }
    
    if (action.type === 'trainingsManage/showCheckMemberModal') { // 添加 自定义人员
      const { current } = action.payload;
      return { ...state, checkMemberModalVisible: true, current, releaseLoading: false };
    }
    
    if (action.type === 'trainingsManage/hideCheckMemberModal') {
      return { ...state, checkMemberModalVisible: false };
    }
    
    return state;
}

module.exports = trainingsManage;
