import React,{ Component } from 'react'
import { connect } from 'react-redux'
import { Modal,Table,Button,Icon,Input, Popconfirm } from 'antd';
const Search = Input.Search;
import moment from 'moment'
import { queryTestStatisticsPage } from '../../../actions/createCourse'
import { PAGE_SIZE_OPTIONS } from '../../../constants'
import styles from './style.css'

class AddTestStatisticsModal extends Component{
  constructor(props){
    super(props)
    this.state={
      visible: true,
      paperDetail:props.paperDetail || {}, //当前选中的数据项
      pagination:{
        showSizeChanger:true,
        loading:false,
        pageSizeOptions: PAGE_SIZE_OPTIONS,
        pageNum:1,
        pageSize:10
      },
      dataList:[],

    }
  }
  componentWillMount(){
    let { pageNum,pageSize } = this.state.pagination
    this.getTrainList({
      pageSize: pageSize,
      pageNum: pageNum,
      paperName: '',
    })
  }
  getTrainList = (params) =>{
    this.setState({ loading: true })
    let { pagination } = this.state;
    this.props.dispatch(queryTestStatisticsPage({
      paperName: params.paperName,
      createrId: '',
      pageSize: params.pageSize,
      currentPage: params.pageNum,
    })).then((data)=>{
      let res = data.data;
      pagination.total = res.totalCount
      pagination.pageSize = params.pageSize
      pagination.current = params.pageNum;
      this.setState({
        dataList:res.result, 
        pagination,
        paperName: params.paperName ? params.paperName : '',
        loading:false
      })
    })
  }
  setColums = () =>{
    return [{
        title: '序号',
        key: 'num',
        render:(text,record,index) =>{
          let { pageNum,pageSize } = this.state.pagination
          return (
            <span>{(pageNum-1)*pageSize + index + 1}</span>
          )
        }
      },{
        title: '问卷名称',
        dataIndex: 'paperName',
        width: '150px',
      },{
        title: '创建人',
        dataIndex: 'paperCreaterName'
      },{
        title: '创建时间',
        dataIndex: 'paperCreaterTime',
        render:(text)=>{
          return (<span>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</span>)
        }
      },{
        title: '操作',
        key: 'actions',
        render: (text, record) => {
          return(
            <Button type="primary" onClick={()=>{
              this.setState({
                paperDetail:Object.assign({},this.state.paperDetail,record)
              },()=>{
                const currentSelectedItemData = this.state.paperDetail;
                this.props.dispatch({
                  type: 'course/saveCurrentSelectedTestStatisticsData',
                  payload: {
                    currentSelectedTestStatisticsData: currentSelectedItemData
                  }
                })
                this.props.onClose({ currentSelectedItemData });
              })
            }}>选择</Button>
          )
        }
      }
    ]
  }
  handleTableChange = (pagination)=>{
    const pager = { ...this.state.pagination };
    pager.pageNum = pagination.current;
    this.setState({
      pagination: pager,
    },()=>{
      this.getTrainList({
        pageSize: pagination.pageSize,
        pageNum: pagination.current,
        paperName: this.state.paperName,
      })
    })
  }
  searchHandler(val){
    this.getTrainList({
      pageSize: this.state.pagination.pageSize,
      pageNum: 1,
      paperName: val,
    })
  }
  loadedResetHandler(){
    this.getTrainList({
      pageSize: this.state.pagination.pageSize,
      pageNum: 1,
      paperName: '',
    });
    
  }
  render(){
    const defaultProps = {
      width:730,
      title:'选择调查问卷',
      footer:null,
      visible: this.state.visible,
      onCancel: this.props.onClose
    }
    return(
      <div>
        <Modal
          {...defaultProps}
          className={styles.addTestStatisticsModal}
        >
          <div className={styles.content}>
              {
                <div style={{paddingTop: 10}}>
                  <div className={`flex-sprite `}>
                    <p className={`flex-inner flex-inner-2 `}>
                      <Icon type="exclamation-circle" style={{color: '#ff9853'}} />&nbsp;&nbsp;未找到合适的问卷，你可以进入满意度问卷 <a href={`/hospital-admin/employee-satisfaction-paper/employee/paperList`} target="_blank">新建问卷</a>。
                      <Icon type="reload" className={this.isLoadedReset ? styles.loadResetIco :`${styles.loadResetIco} ${styles.loadResetIcoActive}`} onClick={()=>{
                        this.isLoadedReset = !this.isLoadedReset;
                        this.loadedResetHandler();
                      }} />
                    </p>
                    <div className={`${styles.searchbarRows} flex-inner flex-inner-1`}>
                      <Search
                        placeholder="请输入课件名称查询"
                        style={{ width: 180, float: 'right' }}
                        onSearch={value => this.searchHandler(value)}
                        className={styles.searchInput}
                        size='default'
                        onChange={e => this.setState({paperName: e.target.value})}
                        value={this.state.paperName}
                        // key={ Math.random() } // 即时 清除搜索文本
                      />
                    </div>
                  </div>
                  <Table
                    columns={this.setColums()}
                    dataSource={this.state.dataList}
                    rowKey={record => record.paperId}
                    bordered={true}
                    loading={this.state.loading}
                    onChange={this.handleTableChange}
                    pagination={this.state.pagination}
                    style={{marginTop:10}}
                  >
                  </Table>
                </div>
              }
          </div>
        </Modal>

      </div>
    )
  }
}
function select(store) {
    return {
    }
};
function actions(dispatch, ownProps) {
    return {
        dispatch,
    };
}
export default connect(select,actions)(AddTestStatisticsModal)