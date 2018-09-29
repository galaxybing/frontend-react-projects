import React from 'react';
import { connect } from 'react-redux';
import { message, Icon, Button } from 'antd';
import Service from '../../../actions/common';
// import CustomClassifyModal from '../../QuestionsManage/CustomClassifyModal';
import Filter from '../Filter';
import styles from './index.css';
import { getDataByDicName } from '../../../constants'

class QuestionsFilter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filterData: {
        levelList: [
          {
            value: 0,
            label: '全部',
          }
        ],  // 层级
        departmentList: [
          {
            value: 0,
            label: '全部',
          }
        ],  // 科室
        subjectList: [
          {
            value: 0,
            label: '全部',
          }
        ],  // 科目
        publicLevelList: [
          {
            value: 0,
            label: '全部',
          }
        ],  // 层级
        publicDepartmentList: [
          {
            value: 0,
            label: '全部',
          }
        ],  // 科室
        publicSubjectList: [
          {
            value: 0,
            label: '全部',
          }
        ],  // 科目
        typeList: [
          {
            value: -1,
            label: '全部',
          },
          {
            value: 1,
            label: '单选题',
          },
          {
            value: 2,
            label: '多选题',
          },
          {
            value: 3,
            label: '判断题',
          },
          {
            value: 4,
            label: '填空题',
          },
          {
            value: 5,
            label: '问答题',
          },
          {
            value: 6,
            label: '共用题干题',
          },
        ],  // 试题类型
        difficultyList: [
          {
            value: -1,
            label: '全部',
          },
          {
            value: 3,
            label: '困难',
          },
          {
            value: 2,
            label: '一般',
          },
          {
            value: 1,
            label: '容易',
          },
        ],  // 难易度
        accuracyList: [
          {
            value: -1,
            label: '全部',
          },
          {
            value: 2,
            label: '50%及以下',
          },
          {
            value: 3,
            label: '50~70%',
          },
          {
            value: 4,
            label: '70%以上',
          },
          {
            value: 1,
            label: '未使用',
          },
        ],  // 正确率
        customClassifyList: [
          {
            value: 0,
            label: '全部',
          }
        ],  // 我的分类
        shareClassifyList: [
          {
            value: 0,
            label: '全部',
          }
        ],
        sourceList: [
          {
            value: 0,
            label: '全部',
          }
        ]
      },
      showMoreFilter: false,
      customClassifyModalVisible: false
    }
  }
  componentDidMount() {
    if (this.props.showType == 0) {
      this.loadPublicList();
    } else {
      this.loadList();
    }
  }
  componentWillReceiveProps(nextProps) {
    // console.log(nextProps)
    // if (!!this.props.showType != !!nextProps.showType) {
    //   this.loadPublicList();
    // }
    // console.log(this.props, nextProps)
    // if (nextProps.showType == 0 && !this.props.filter.isLoaded) {
    //   this.loadPublicList();
    // }
  }
  loadList() {
    let filterData = this.state.filterData;
    Service.getDicData().then(data => {
      if (!data.success) {
        message.error(data.errMsg);
        return;
      }
      const list = JSON.parse(JSON.stringify(getDataByDicName(data.data,'层级')).replace(/name":/g, 'label":').replace(/code":/g, 'value":'));
      list.push.apply(filterData.levelList, list);
      this.setState({ filterData });
    });
    Service.getTagDict({ type: 'DEPARTMENT' }).then(data => {
      if (!data.success) {
        message.error(data.errMsg);
        return;
      }
      const list = JSON.parse(JSON.stringify(data.data).replace(/name":/g, 'label":').replace(/code":/g, 'value":'));
      list.push.apply(filterData.departmentList, list);
      this.setState({ filterData });
    });
    Service.getTagDict({ type: 'SUBJECT' }).then(data => {
      if (!data.success) {
        message.error(data.errMsg);
        return;
      }
      const list = JSON.parse(JSON.stringify(data.data).replace(/name":/g, 'label":').replace(/code":/g, 'value":'));
      list.push.apply(filterData.subjectList, list);
      this.setState({ filterData });
    });
    this.queryPrivateClassifyList('load');
    this.queryShareClassifyList('load');
  }
  loadPublicList() {
    let filterData = this.state.filterData;
    Service.getPublicBasicDict('PLEVEL,PDEPARTMENT,PSUBJECT').then(data => {
      if (!data.success) {
        message.error(data.errMsg);
        return;
      }
      for (const item of data.data) {
        if (item.type === 'PLEVEL') {
          const list = JSON.parse(JSON.stringify(item.basicDictSimpleRespDTOList).replace(/name":/g, 'label":').replace(/code":/g, 'value":'));
          list.push.apply(filterData.publicLevelList, list);
        } else if (item.type === 'PDEPARTMENT') {
          const list = JSON.parse(JSON.stringify(item.basicDictSimpleRespDTOList).replace(/name":/g, 'label":').replace(/code":/g, 'value":'));
          list.push.apply(filterData.publicDepartmentList, list);
        } else if (item.type === 'PSUBJECT') {
          const list = JSON.parse(JSON.stringify(item.basicDictSimpleRespDTOList).replace(/name":/g, 'label":').replace(/code":/g, 'value":'));
          list.push.apply(filterData.publicSubjectList, list);
        }
      }
      this.setState({ filterData }, () => {
        this.props.dispatch({
          type: 'filter/save',
          payload: {
            publicLevelList: filterData.publicLevelList,
            publicDepartmentList: filterData.publicDepartmentList,
            publicSubjectList: filterData.publicSubjectList,
            isLoaded: true
          }
        });
      });
    });
    Service.getExerciseSourceList().then(data => {
      if (!data.success) {
        message.error(data.errMsg);
        return;
      }
      const list = JSON.parse(JSON.stringify(data.data).replace(/sourceName":/g, 'label":').replace(/id":/g, 'value":'));
      list.push.apply(filterData.sourceList, list);
      this.setState({ filterData }, () => {
        this.props.dispatch({
          type: 'filter/save',
          payload: {
            sourceList: filterData.sourceList,
          }
        });
      });
    });
  }
  queryPrivateClassifyList = (type) => {
    let filterData = this.state.filterData;
    Service.getPrivateClassifyList().then(data => {
      if (!data.success) {
        message.error(data.errMsg);
        return;
      }
      let list = [];
      if (!data.data || !data.data.length) {
        filterData.customClassifyList = list;
      } else {
        list = JSON.parse(JSON.stringify(data.data).replace(/name":/g, 'label":').replace(/id":/g, 'value":'));
        if (type === 'load') {
          list.push.apply(filterData.customClassifyList, list);
        } else {
          filterData.customClassifyList = [
            {
              value: 0,
              label: '全部',
            },
            ...list
          ];
        }
      }
      this.setState({ filterData });
    });
  }
  queryShareClassifyList = (type) => {
    let filterData = this.state.filterData;
    Service.fetchSharelist().then(data => {
      if (!data.success) {
        message.error(data.errMsg);
        return;
      }
      let list = [];
      if (!data.data || !data.data.length) {
        filterData.shareClassifyList = list;
      } else {
        list = JSON.parse(JSON.stringify(data.data).replace(/name":/g, 'label":').replace(/id":/g, 'value":'));
        if (type === 'load') {
          list.push.apply(filterData.shareClassifyList, list);
        } else {
          filterData.shareClassifyList = [
            {
              value: 0,
              label: '全部',
            },
            ...list
          ];
        }
      }
      this.setState({ filterData });
    })
  }
  filterChange = (activeValue, activeOptions, label) => {
    let obj = {};
    obj[label] = activeValue;
    this.props.onChange(obj);
  }
  render() {
    const { filterData, showMoreFilter, customClassifyModalVisible } = this.state;
    const { showType, defaultValue = {} } = this.props;
    let sourse = [
      {
        title: '层级',
        result: showType == 0 ? filterData.publicLevelList : filterData.levelList,
        type: 'level',
      },
      {
        title: showType == 0 ? '学科' : '科室',
        result: showType == 0 ? filterData.publicDepartmentList : filterData.departmentList,
        type: 'department',
      },
      {
        title: '科目',
        result: showType == 0 ? filterData.publicSubjectList : filterData.subjectList,
        type: 'subject',
      },
      {
        title: '试题类型',
        result: filterData.typeList,
        type: 'type',
      }
    ];
    if (showType != 0) {
      sourse.splice(0, 0,
        {
          title: '自定义分类',
          result: [
            {
              value: 0,
              label: '我的分类',
              children: filterData.customClassifyList
            },
            {
              value: 1,
              label: '院内分享',
              children: filterData.shareClassifyList
            },
          ],
          renderAction: () => this.props.page !== 'chooseQuestions' && <Button onClick={() => this.setState({ customClassifyModalVisible: true })}>我的分类管理</Button>,
          type: 'customClassify',
        },
      )
      sourse.splice(4, 0,
        {
          title: '难易度',
          result: filterData.difficultyList,
          type: 'difficulty'
        },

        {
          title: '正确率',
          result: filterData.accuracyList,
          type: 'accuracy',
        },
        // {
        //   title: '我的分类',
        //   result: filterData.customClassifyList,
        //   type: 'customClassify',
        // }
      )
    } else {
      sourse.splice(4, 0,
        {
          title: '来源',
          result: filterData.sourceList,
          type: 'source'
        },

        {
          title: '正确率',
          result: filterData.accuracyList,
          type: 'accuracy',
        },
      )
      filterData.typeList.splice(5, 2);
    }
    if (this.props.page === 'chooseQuestions') {
      if (showType != 0) {
        sourse.splice(6, 1);
      } else {
        sourse.splice(3, 1);
      }
    }
    const filterItem = sourse.map((item, index) => {
      let curDefaultValue = [];
      if (defaultValue[item.type]) {
        curDefaultValue = defaultValue[item.type];
      } else if (item.result[0] && item.result[0].children && item.result[0].children[0]) {
        curDefaultValue = [item.result[0].value, item.result[0].children[0].value];
      } else {
        curDefaultValue = [item.result[0].value];
      }
      let itemProps = {}
      if (item.type === 'customClassify' && this.props.page !== 'chooseQuestions') {
        let customClassifyValue = [item.result[0].value];
        if (defaultValue.customClassify && defaultValue.customClassify.length) {
          customClassifyValue = defaultValue.customClassify;
        } else if (item.result[0].children && item.result[0].children.length) {
          customClassifyValue = [item.result[0].value, item.result[0].children[0].value]
        }
        itemProps = {
          ...itemProps,
          value: customClassifyValue
        }
      }
      return (
        <Filter.Item
          key={index}
          style={!showMoreFilter && index > 3 ? { display: 'none' } : null}
          label={item.title}
          options={item.result}
          defaultValue={curDefaultValue}
          onChange={(activeValue, activeOptions) => this.filterChange(activeValue, activeOptions, item.type)}
          renderAction={item.renderAction}
          {...itemProps}
        />
      )
    });

    const customClassifyProps = {
      visible: customClassifyModalVisible,
      dataSource: filterData.customClassifyList,
      onCancel: () => {
        this.queryShareClassifyList();
        this.queryPrivateClassifyList();
        this.setState({ customClassifyModalVisible: false })
      },
      onOk: () => {
        if (defaultValue.customClassify && defaultValue.customClassify[0] == 0) {
          this.filterChange([1, 0], [], 'customClassify');
        }
        customClassifyProps.onCancel();
      }
    }
    return (
      <Filter style={{ marginBottom: 15 }}>
        {filterItem}
        {
          sourse.length > 4 ?
            <div className={styles.moreFiltrate}>
              <span onClick={() => this.setState({ showMoreFilter: !showMoreFilter })} style={{ display: 'inline-block', cursor: 'pointer' }}>
                {showMoreFilter ?
                  <a>收起搜索条件<Icon type="up" style={{ marginLeft: 5 }} /></a> :
                  <a>更多搜索条件<Icon type="down" style={{ marginLeft: 5 }} /></a>
                }
              </span>
            </div> : ''
        }
        {/* {customClassifyModalVisible ? <CustomClassifyModal {...customClassifyProps} /> : ''} */}
      </Filter>
    );
  }
}

function select(state) {
  return {
    filter: state.filter,
  };
}
function actions(dispatch, ownProps) {
  return {
    dispatch,
  };
};

export default connect(select, actions)(QuestionsFilter);
