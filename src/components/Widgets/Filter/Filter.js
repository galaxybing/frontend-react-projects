import React from 'react';
import classnames from 'classnames';

export default class Filter extends React.Component {
  static defaultProps = {
    style: {}
  }
  constructor(props) {
    super(props);
  }
  componentDidMount() {

  }
  componentWillReceiveProps(nextProps) {

  }
  componentWillUnmount() {

  }
  render() {
    return (
      <div style={{ ...this.props.style }}>
        {this.props.children}
        {/* {
          React.Children.map(this.props.children, (child) => {
            return { child };
          })
        } */}
      </div>
    );
  }
}
