import React from 'react';
import loading from '../src/loading.js';
import '../assets/index.less';

window.loading = loading;

export default class Example extends React.Component {
    loading(){
        loading();
    }

    render() {
        return <button onClick={this.loading}>loading</button>;
    }
}
