/**
 * @实现路由配置中基准路径的功能：
 *   设置基准路径字符
 */

const setBasename = (str) => {
  return (dispatch)=>{
    dispatch({type:"SET_ROUTER_BASENAME", data: str});
  }
}
export default setBasename