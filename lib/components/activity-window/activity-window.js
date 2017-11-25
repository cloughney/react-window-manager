"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const title_bar_1 = require("./title-bar");
const getActivityWindowStyle = (depth, position) => {
    const styles = {
        position: 'absolute',
        zIndex: (100 - depth) * 100,
        overflow: 'hidden'
    };
    switch (position.state) {
        case 'MAXIMIZED':
            return Object.assign({}, styles, { top: 0, left: 0, right: 0, bottom: 0 });
        case 'MINIMIZED':
            return styles;
        case 'NORMAL':
        default:
            return Object.assign({}, styles, { top: `${position.y}px`, left: `${position.x}px`, width: `${position.width}px`, height: `${position.height}px` });
    }
};
class ActivityWindow extends React.Component {
    constructor(props) {
        super(props);
        this.onDragStart = (e) => {
            if (this.props.window.position.state !== 'NORMAL' || !this.element) {
                return;
            }
            const offset = {
                x: e.clientX - this.element.offsetLeft,
                y: e.clientY - this.element.offsetTop
            };
            this.setState({ isMoving: true });
            this.props.onDragStart(this.props.window, offset);
        };
        this.onMouseDown = (e) => {
            if (!this.element) {
                return;
            }
            if (this.props.depth !== 0) {
                this.props.onFocus(this.props.window);
            }
        };
        this.onMouseOver = (e) => {
        };
        this.state = {
            isMoving: false,
            windowStyle: getActivityWindowStyle(props.depth, props.window.position)
        };
    }
    get windowClassName() {
        const classList = ['activity'];
        if (this.props.window.position.state === 'MAXIMIZED') {
            classList.push('maximized');
        }
        if (this.state.isMoving) {
            classList.push('dragging');
        }
        return classList.join(' ');
    }
    render() {
        const ActivityComponent = this.props.window.activity.component;
        return (React.createElement("div", { ref: ref => { this.element = ref; }, className: this.windowClassName, style: this.state.windowStyle, onMouseOver: this.onMouseOver, onMouseDown: this.onMouseDown },
            React.createElement(title_bar_1.default, { window: this.props.window, onWindowAction: this.props.onWindowAction, onMouseDown: this.onDragStart }),
            React.createElement(ActivityComponent, { availableActivities: this.props.availableActivities, onWindowAction: (action, options) => { this.props.onWindowAction(action, options); } })));
    }
    componentWillReceiveProps(props) {
        this.setState(state => (Object.assign({}, state, { windowStyle: getActivityWindowStyle(props.depth, props.window.position) })));
    }
}
exports.default = ActivityWindow;
