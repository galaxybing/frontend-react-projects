import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import createClass from 'create-react-class';

// console.log(createClass);// function createClass(spec) { console.log("galaxyw run ...");
/*
function Welcome(props) {
    function a(){
        // debugger;
        return 1+3;
    }
    // alert(a());
  return <h1>Hello, {props.name}<a href="javascript:;">链接指向</a>有人吗？</h1>;
}
*/

class Welcome extends React.Component{
    static defaultProps = {
        demo: false,
    };
    constructor(props){
        super(props);
        this.state = {
            userName: "galaxyw",
        };
    }
    render(){
        var props = this.props;
        console.log(props);
        return <h1>Hello, {props.name}<a href="javascript:;">链接指向</a>有人吗？</h1>;
    }
}

const element = <Welcome name="galaxyw" />;

ReactDOM.render(element, document.getElementById("app"));
