import React, { Component } from 'react';
import { message, Icon, Button, Popover, Radio, Modal } from 'antd';
import { strMapToObj } from '../../../core/_utils/common';
import Service from '../../../actions/common';
import styles from './assets/css/index.css';
import { getDataByDicName } from '../../../constants'


class FiltrateComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filterData: {
        courseClassifyList: [],  // 课程分类
        trainClassifyList: [],  // 培训分类
        exerciseClassifyList: [],  // 试题分类
        levelList: [],  // 层级
        departmentList: [],  // 科室
        subjectList: [],  // 科目
        typeList: [
          {
            id: 1,
            name: '单选题',
          }, {
            id: 2,
            name: '多选题',
          },
          {
            id: 3,
            name: '判断题',
          },
          {
            id: 4,
            name: '填空题',
          },
        ],  // 试题类型
        difficultyList: [
          {
            id: 3,
            name: '困难',
          }, {
            id: 2,
            name: '一般',
          },
          {
            id: 1,
            name: '容易',
          },
        ],  // 难易度
      },
      optionsHeight: new Map(),
      showMoreFiltrate: false,
      isShowMoreMap: new Map([]),   // 是否显示多行
      isShowSubFiltrateMap: new Map([]),  // 是否显示子级
      subFiltrateMap: new Map([]),   // 子级list
      selectedOptionsMap: new Map([]),
    };
  }
  componentDidMount() {
    const { filtrateItem, defaultSelectedValue } = this.props;
    const { filterData, selectedOptionsMap, subFiltrateMap, isShowSubFiltrateMap } = this.state;
    if (filtrateItem.indexOf('courseClassify') > -1) {
      Service.getCategories({ groupId: 3, type: 0 }).then(data => {
        if (!data.success) {
          message.error(data.errMsg);
          return;
        }
        filterData.courseClassifyList = data.data;
        this.setState({ filterData }, () => {
          this.setFiltrateItemHeight('courseClassify');
        });
      });
    }
    if (filtrateItem.indexOf('level') > -1) {
      Service.getDicData().then(data => {
        if (!data.success) {
          message.error(data.errMsg);
          return;
        }
        filterData.levelList = getDataByDicName(data.data,'层级');
        this.setState({ filterData }, () => {
          this.setFiltrateItemHeight('level');
        });
      })
    }
    if (filtrateItem.indexOf('trainClassify') > -1) {
      Service.getClassifyList({ type: 'TRAINCLASSIFY' }).then(data => {
        if (!data.success) {
          message.error(data.errMsg);
          return;
        }
        filterData.trainClassifyList = data.data;
        this.setState({ filterData }, () => {
          this.setFiltrateItemHeight('trainClassify');
        });
      });
    }
    if (filtrateItem.indexOf('exerciseClassify') > -1) {
      Service.getClassifyList({ type: 'EXERCISE' }).then(data => {
        if (!data.success) {
          message.error(data.errMsg);
          return;
        }
        filterData.exerciseClassifyList = data.data;
        this.setState({ filterData }, () => {
          this.setFiltrateItemHeight('exerciseClassify');
          if (defaultSelectedValue.exerciseClassifyChildren) {
            filterData.exerciseClassifyList.map((item) => {
              if (item.code == defaultSelectedValue.exerciseClassify) {
                subFiltrateMap.set('exerciseClassify', item.children);
                isShowSubFiltrateMap.set('exerciseClassify', true);
                this.setState({ subFiltrateMap, isShowSubFiltrateMap });
              }
            })
          }
        });
      });
    }
    if (filtrateItem.indexOf('department') > -1) {
      Service.getTagDict({ type: 'DEPARTMENT' }).then(data => {
        if (!data.success) {
          message.error(data.errMsg);
          return;
        }
        filterData.departmentList = data.data;
        this.setState({ filterData }, () => {
          this.setFiltrateItemHeight('department');
        });
      });
    }
    if (filtrateItem.indexOf('subject') > -1) {
      Service.getTagDict({ type: 'SUBJECT' }).then(data => {
        if (!data.success) {
          message.error(data.errMsg);
          return;
        }
        filterData.subjectList = data.data;
        this.setFiltrateItemHeight('subject');
        this.setState({ filterData }, () => {
          this.setFiltrateItemHeight('department');
        });
      });
    }
    if (defaultSelectedValue) {
      selectedOptionsMap.set('exerciseClassify', defaultSelectedValue.exerciseClassify)
        .set('exerciseClassifyChildren', defaultSelectedValue.exerciseClassifyChildren)
        .set('level', defaultSelectedValue.level);
    }
  }
  setFiltrateItemHeight(type) {
    if (this.refs[type]) {
      const { optionsHeight } = this.state;
      optionsHeight.set(type, this.refs[type].clientHeight > 37);
      this.setState({ optionsHeight });
    }
  }
  clickMoreHandler(type) {
    const { isShowMoreMap } = this.state;
    const isShowMore = isShowMoreMap.get(type) || false;
    isShowMoreMap.set(type, !isShowMore);
    this.setState({ isShowMoreMap })
  }
  clickMoreFiltrateHandler() {
    const { showMoreFiltrate } = this.state;
    this.setState({
      showMoreFiltrate: !showMoreFiltrate
    });
  }
  onSelectedChange(type, id, subFiltrate, checkName, bugFlag) { // 选中
    if (!this.props.disabled) {
      const { subFiltrateMap, selectedOptionsMap, isShowSubFiltrateMap } = this.state;
      selectedOptionsMap.set(type, id);
      selectedOptionsMap.set(`${type}Name`, checkName);
      if (type.indexOf('Children') < 0 && subFiltrate) {  // 是第一级并且有子级
        subFiltrateMap.set(type, subFiltrate);
        isShowSubFiltrateMap.set(type, true);
        selectedOptionsMap.set(`${type}Children`, null);
        selectedOptionsMap.set(`${type}ChildrenName`, null);
        this.setState({ bugFlag });
      } else if (type.indexOf('Children') < 0 && !subFiltrate) {
        subFiltrateMap.set(type, []);
        isShowSubFiltrateMap.set(type, false);
        selectedOptionsMap.set(`${type}ChildrenName`, null);
        selectedOptionsMap.set(`${type}Children`, null);
      }
      this.setState({
        subFiltrateMap,
        selectedOptionsMap,
        isShowSubFiltrateMap
      });
      this.props.onChange(strMapToObj(selectedOptionsMap));
    }
  }
  renderFiltrateOption = (filtrateList, selectedId, type) => {
    // filtrateList: 需要渲染的list   selectedId: 当前选中id    type: 每个option的type
    return (
      <div>
        <div
          onClick={() => this.onSelectedChange(type, null, null, '全部')}
          className={selectedId === undefined || selectedId === null ? `${styles.active} ${styles.filtrateItemOption}` : styles.filtrateItemOption}
        >全部</div>
        {
          filtrateList.map((item) => {
            let filterItemCls = `${styles.filtrateItemOption}`;
            if (selectedId === (item.code || item.id)) {
              filterItemCls += ` ${styles.active}`;
            }
            return (
              <div
                key={item.code || item.id.toString()}
                onClick={() => this.onSelectedChange(type, (item.code || item.id), (item.children || []), item.name)}
                className={filterItemCls}
              >
                {item.name}
              </div>
            );
          })
        }
      </div>
    );
  }
  render() {
    const { filterData, optionsHeight, isShowMoreMap, showMoreFiltrate, subFiltrateMap, selectedOptionsMap, isShowSubFiltrateMap } = this.state;
    const { filtrateItem } = this.props;
    const defaultFiltrateSourse = [
      {
        title: '试题类型',
        result: filterData.typeList,
        type: 'type',
      },
      {
        title: '层级',
        result: filterData.levelList,
        type: 'level',
      },
      {
        title: '课程分类',
        result: filterData.courseClassifyList,
        type: 'courseClassify',
      },
      {
        title: '培训分类',
        result: filterData.trainClassifyList,
        type: 'trainClassify',
      },
      {
        title: '试题分类',
        result: filterData.exerciseClassifyList,
        type: 'exerciseClassify',
      },
      {
        title: '难易度',
        result: filterData.difficultyList,
        type: 'difficulty'
      },
      {
        title: '科室',
        result: filterData.departmentList,
        type: 'department',
      },
      {
        title: '科目',
        result: filterData.subjectList,
        type: 'subject',
      },
    ];
    let filtrateSourse = [];
    if (filtrateItem === undefined) {
      filtrateSourse = defaultFiltrateSourse;
    } else {
      for (const f of filtrateItem) {
        for (const item of defaultFiltrateSourse) {
          if (item.type === f) {
            filtrateSourse.push(item);
          }
        }
      }
    }
    const filtrate = filtrateSourse.map((item, index) => {
      const subFiltrateList = subFiltrateMap.get(item.type);
      const selectedId = selectedOptionsMap.get(item.type);
      const isShowSubFiltrate = isShowSubFiltrateMap.get(item.type);
      const selectedChildreId = selectedOptionsMap.get(`${item.type}Children`);
      const isShowMore = isShowMoreMap.get(item.type);
      const optionHeight = optionsHeight.get(item.type);
      return (
        <li
          className={styles.filtrateItem}
          key={item.type}
          style={(!showMoreFiltrate) && index > 3 ? { display: 'none' } : null}
        >
          <label className={styles.filtrateTitle}>{item.title}</label>
          <div className={styles.filtrateBody}>
            <div className={styles.filtrateContent}>
              <div
                className={styles.filtrateOptions}
                style={
                  isShowMore ?
                    { height: 'auto', overflow: 'auto', paddingBottom: 10 } : {}
                }
              >
                <div ref={item.type}>
                  {this.renderFiltrateOption(item.result, selectedId, item.type)}
                </div>
              </div>
              {
                isShowSubFiltrate && subFiltrateList && subFiltrateList.length ?
                  <div className={styles.subFiltrate}>
                    {this.renderFiltrateOption(subFiltrateList, selectedChildreId, `${item.type}Children`)}
                  </div> : ''
              }
            </div>
            {
              optionHeight ?
                <div className={styles.filtrateAction}>
                  <span onClick={() => this.clickMoreHandler(item.type)}>
                    {isShowMore ? '收起' : '展开'}
                    <Icon type={isShowMore ? 'up' : 'down'} style={{ marginLeft: 5 }} />
                  </span>
                </div> : ''
            }
          </div>
        </li>
      );
    });
    return (
      <div style={{ marginBottom: 22 }}>
        <ul className={styles.filtrate}>
          {filtrate}
        </ul>
        {
          filtrateSourse.length > 4 ?
            <div className={styles.moreFiltrate}>
              <span onClick={() => this.clickMoreFiltrateHandler(showMoreFiltrate)} style={{ display: 'inline-block', cursor: 'pointer' }}>
                {showMoreFiltrate ?
                  <a>收起搜索条件<Icon type="up" style={{ marginLeft: 5 }} /></a> :
                  <a>更多搜索条件<Icon type="down" style={{ marginLeft: 5 }} /></a>
                }
              </span>
            </div> : ''
        }
      </div>
    );
  }
}
export default FiltrateComponent;
