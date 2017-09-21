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
    if (position.isMaximized) {
        styles.top = 0,
            styles.left = 0,
            styles.right = 0,
            styles.bottom = 0;
    }
    else {
        styles.top = `${position.y}px`,
            styles.left = `${position.x}px`,
            styles.width = `${position.width}px`,
            styles.height = `${position.height}px`;
    }
    return styles;
};
class ActivityWindow extends React.Component {
    constructor(props) {
        super(props);
        this.onDragStart = (e) => {
            if (this.props.window.position.isMaximized || !this.element) {
                return;
            }
            e.preventDefault();
            const offset = {
                x: e.clientX - this.element.offsetLeft,
                y: e.clientY - this.element.offsetTop
            };
            this.setState({ isMoving: true });
            this.props.onDragStart(this.props.window, this.element, offset);
        };
        this.onMouseDown = (e) => {
            if (!this.element) {
                return;
            }
            if (this.props.depth !== 0) {
                this.props.onFocus(this.props.window, this.element);
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
        if (this.props.window.position.isMaximized) {
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
