import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Table, Popconfirm, Pagination, Popover } from 'antd';
import { getSelectedCode, getLabelArraysByValue, strOrNumConvert } from '../../../core/_utils/common';
import styles from './index.css';

class QuestionsTableList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mutilLineEllipsis: [],
    };
  }
  componentWillReceiveProps(nextProps) {
    setTimeout(() => {  // 防止setState时没有值， 延迟500ms再执行
      if (this.mutilLineEllipsis.length) {
        this.setState({ mutilLineEllipsis: this.mutilLineEllipsis });
      }
    }, 500);

  }
  render() {
    this.mutilLineEllipsis = [];
    const { loading, listData, actionPanel, rowSelection, table = {}, isPublicHospital } = this.props;
    let columns = [
      {
        title: '试题题目',
        dataIndex: 'name',
        key: 'name',
        width: actionPanel ? '16%' : '19%',
        render: (text, record, index) => {
          const { mutilLineEllipsis } = this.state;
          let offsetHeight = 0;
          if (mutilLineEllipsis[index]) {
            offsetHeight = mutilLineEllipsis[index].offsetHeight;
          }
          let tpl = '';
          let color = '';
          switch (record.type) {
            case 1:
              tpl = (<span>单选题</span>);
              color = 'single';
              break;
            case 2:
              tpl = (<span>多选题</span>);
              color = 'multiple';
              break;
            case 3:
              tpl = (<span>判断题</span>);
              color = 'trueFalse';
              break;
            case 4:
              tpl = (<span>填空题</span>);
              color = 'fillBlank';
              break;
            default:
              break;
          }
          return (
            <Popover
              placement="bottomLeft"
              content={
                <div className={styles.infoWrap}>
                  <p className={styles.infoTitle}>
                    <span className={`question-type-lable ${color}`} style={{ marginRight: 10 }}>{tpl}</span>
                    <span>{text}</span>
                    {
                      record.type !== 4 ? <span style={{ float: 'right' }}>({record.answer})</span> : ''
                    }
                  </p>
                  <div className={styles.infoContent}>
                    {record.exerciseItemDOList.map((r, idx) => {
                      return (
                        <p key={r.no}>
                          <span>{record.type !== 4 ? r.no : `第${strOrNumConvert(idx + 1)}处答案`}</span>
                          <span style={{ marginLeft: 10 }}>{r.name}</span>
                        </p>
                      );
                    })}
                  </div>
                </div>
              }
              getPopupContainer={trigger => trigger.parentNode}
              overlayClassName={styles.questionsInfo}
            >
              <div className={styles.mutilLineEllipsis}>
                <a
                  className={styles.mutilLineEllipsisCont}
                  ref={(mutil) => {
                    if (mutil) {
                      this.mutilLineEllipsis.push(mutil);
                    }
                  }}
                  id={`mutil-${index}`}
                >
                  {text}
                  {
                    offsetHeight > 40 ? <span className={styles.ellipsis}>...</span> : ''
                  }
                </a>
              </div>
            </Popover>
          );
        }
      },
      {
        title: '试题类型',
        dataIndex: 'type',
        key: 'type',
        width: '8%',
        render: (text) => {
          let tpl = '';
          switch (text) {
            case 1:
              tpl = (<span>单选题</span>);
              break;
            case 2:
              tpl = (<span>多选题</span>);
              break;
            case 3:
              tpl = (<span>判断题</span>);
              break;
            case 4:
              tpl = (<span>填空题</span>);
              break;
            default:
              break;
          }
          return tpl;
        }
      },
      {
        title: '层级',
        dataIndex: 'levelShowName',
        key: 'levelShowName',
        width: actionPanel ? '8%' : '10%',
        render: (text, record) => {
          let tpl;
          if (isPublicHospital) {
            const levelCode = getSelectedCode(record.levelCode);
            const levelList = this.props.filter.publicLevelList;
            tpl = getLabelArraysByValue(levelCode, levelList).join(',');
          } else if (text) {
            tpl = text;
          }
          return (
            <Popover content={<span>{tpl}</span>} placement="bottomLeft" getPopupContainer={trigger => trigger.parentNode}>
              <span className={`question-label-overflow ${styles.textOverflow}`}>{tpl}</span>
            </Popover >
          );
        }
      },
      {
        title: isPublicHospital ? '学科' : '科室',
        dataIndex: 'departmentName',
        key: 'departmentName',
        width: actionPanel ? '8%' : '11%',
        render: (text, record) => {
          let tpl;
          if (isPublicHospital) {
            const department = getSelectedCode(record.department);
            const departmentList = this.props.filter.publicDepartmentList;
            tpl = getLabelArraysByValue(department, departmentList).join(',');
          } else if (text) {
            tpl = text;
          }
          return (
            <Popover content={<span>{tpl}</span>} placement="bottomLeft" getPopupContainer={trigger => trigger.parentNode}>
              <span className={`question-label-overflow ${styles.textOverflow}`}>{tpl}</span>
            </Popover >
          );
        }
      },
      {
        title: '科目',
        dataIndex: 'subjectName',
        key: 'subjectName',
        width: actionPanel ? '8%' : '11%',
        render: (text, record) => {
          let tpl;
          if (isPublicHospital) {
            const subject = getSelectedCode(record.subject);
            const subjectList = this.props.filter.publicSubjectList;
            tpl = getLabelArraysByValue(subject, subjectList).join(',');
          } else if (text) {
            tpl = text;
          }
          return (
            <Popover content={<span>{tpl}</span>} placement="bottomLeft" getPopupContainer={trigger => trigger.parentNode}>
              <span className={`question-label-overflow ${styles.textOverflow}`}>{tpl}</span>
            </Popover >
          );
        }
      },
      {
        title: '难易度',
        dataIndex: 'difficulty',
        key: 'difficulty',
        width: '7%',
        render: (text) => {
          let tpl = '';
          switch (text) {
            case 1:
              tpl = (<span>容易</span>);
              break;
            case 2:
              tpl = (<span>一般</span>);
              break;
            case 3:
              tpl = (<span>困难</span>);
              break;

            default:
              break;
          }
          return tpl;
        }
      },
      {
        title: '创建者',
        dataIndex: 'createByName',
        key: 'createByName',
        width: actionPanel ? '8%' : '10%',
      },
      {
        title: '使用人次',
        dataIndex: 'useCount',
        key: 'useCount',
        width: '9%',
        render: (text) => {
          return (<span>{text}次</span>);
        }
      },
      {
        title: '正确率',
        dataIndex: 'accuracy',
        key: 'accuracy',
        width: '8%',
        render: (text) => {
          return (<span>{(text * 100).toFixed(1)}%</span>);
        }
      },
      {
        title: '更新时间',
        dataIndex: 'updateTime',
        key: 'updateTime',
        // width: '11%',
        render: (text) => {
          if (text) {
            return (
              <span className="table-time">
                <span>&nbsp;{text.split(' ')[0]}</span>
                <span>&nbsp;{text.split(' ')[1]}</span>
              </span>
            );
          } else {
            return null;
          }
        }
      },
      {
        title: '操作',
        key: 'action',
        width: '6%',
        render: (text, record) => {
          if (record.canEdit === 0) {
            return ('');
          } else {
            return (
              <span className={styles.operate}>
                <a onClick={() => actionPanel.onEdit(record)} title="编辑">编辑</a>
                <br />
                <Popconfirm title="确定删除？" onConfirm={() => actionPanel.onDel(record)}>
                  <a title="删除">删除</a>
                </Popconfirm>
              </span>
            );
          }
        }
      }
    ];
    if (actionPanel && this.props.isPublicHospital) {  // 试题库
      columns.splice(5, 2);
      columns.splice(8, 1);
    }
    if (actionPanel && !this.props.isPublicHospital) {
      table.rowSelection = {
        ...table.rowSelection,
        getCheckboxProps: record => ({
          disabled: record.canEdit == 0,
        }),
      }
    }
    if (!actionPanel) {  // 选择试题弹框
      if (this.props.isPublicHospital) {  // 公共试题
        columns.splice(1, 1);
        columns.splice(4, 2);
        columns.splice(7, 1);
      } else {
        columns.splice(1, 1);
        columns.splice(4, 1);
        columns.splice(8, 1);
      }
    }
    return (
      <div>
        <Table
          columns={columns}
          pagination={false}
          rowKey={record => record.id}
          {...table}
        />
      </div>
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

export default connect(select, actions)(QuestionsTableList);
