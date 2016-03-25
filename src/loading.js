import React from 'react';
import ReactDOM from 'react-dom';

function getStyle(el, props) {
    if (typeof getComputedStyle !== 'undefined')
        return getComputedStyle(el, null).getPropertyValue(props);
    else
        return el.currentStyle[props];
}

//向下兼容，show = undefined
let loading = function (el = loading.defaultDom, show = undefined) {
    let dom = el.nodeType ? el :
        ((el = ReactDOM.findDOMNode(el)) && el.nodeType ? el : loading.defaultDom);

    if (!loading.map.has(dom)) {
        let oldPosition = getStyle(dom, 'position'),
            newPosition = oldPosition,
            loadingDom = document.createElement('div');
        if (oldPosition === 'static' && dom !== document.body && dom !== document.documentElement) {
            dom.style.position = newPosition = 'relative';
        }
        loadingDom.className = 'salt-loading';
        loadingDom.innerHTML =
            `<div class="salt-spinner">
                <i class="glyphicon glyphicon-thumbs-up"></i>
            </div>`;

        dom.appendChild(loadingDom);
        loading.map.set(dom, {
            oldPosition: oldPosition,
            newPosition: newPosition,
            loadingDom: loadingDom,
            show: true,
            count: 1
        });
    } else {
        let v = loading.map.get(dom);
        if (typeof show === 'boolean') {
            v.count += show ? 1 : -1;
        } else {
            v.count = v.count > 0 ? 0 : 1;
        }
        if (v.count < 0) {
            v.count = 0;
        }
        if (v.count === 0) {
            dom.style.position = v.oldPosition;
            v.loadingDom.style.display = 'none';
            v.show = false;
        } else {
            dom.style.position = v.newPosition;
            v.loadingDom.style.display = 'block';
            v.show = true;
        }
    }
};

loading.map = new WeakMap();

loading.defaultDom = document.body;

loading.setDefault = function (el) {
    if (el.nodeType) {
        loading.defaultDom = el;
    } else if ((el = ReactDOM.getDOMNode(el)) && el.nodeType) {
        loading.defaultDom = el;
    } else {
        console.warn('loading.setDefault方法的参数为dom对象或者react component对象');
    }
};

loading.superagentLoading = function (el) {
    return function (request) {
        loading(el, true);
        request.on('end', loading.bind(undefined, el, false));
    }
};

export default loading;
