import React, { Component } from 'react';
import styles from './assets/css/layout.css';

class Editor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editor: true,
    };
  }
  render() {
    return (
      <div className={styles.componentContainer}>
        
      </div>
    );
  }
}

export default Editor;