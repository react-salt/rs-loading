import React from 'react';
import loading from '../src/loading.js';

window.loading = loading;

export default class Example extends React.Component {
    loading(){
        loading();
    }

    render() {
        return <button onClick={this.loading}>loading</button>;
    }
}
