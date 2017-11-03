const push = (loc) => {
  let url = loc.props.basename + loc.pathname;
  loc.pathname = url;
  return (history)=>{
    history? history.push(loc): loc.props.history.push(loc);
  }
}

export default push