"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const types_1 = require("./types");
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
            if (this.state.isMoving || this.props.window.position.isMaximized || !this.element) {
                return;
            }
            e.preventDefault();
            const top = e.clientY - this.element.offsetTop;
            const left = e.clientX - this.element.offsetLeft;
            this.setState({
                isMoving: true,
                offset: { top, left }
            });
        };
        this.onMouseDown = (e) => {
            if (this.props.depth !== 0) {
                this.props.onFocus();
            }
        };
        this.onMouseOver = (e) => {
        };
        this.onMouseUp = (e) => {
            if (!this.state.isMoving || this.props.window.position.isMaximized || !this.element) {
                return;
            }
            e.preventDefault();
            this.setState({ isMoving: false });
            this.props.onWindowAction(types_1.WindowAction.Move, {
                x: this.element.offsetLeft,
                y: this.element.offsetTop
            });
        };
        this.onMouseMove = (e) => {
            if (!this.state.isMoving) {
                return;
            }
            e.preventDefault();
            const x = e.clientX - this.state.offset.left;
            const y = e.clientY - this.state.offset.top;
            this.setState((state, props) => (Object.assign({}, state, { windowStyle: getActivityWindowStyle(props.depth, Object.assign({}, props.window.position, { x, y })) })));
        };
        this.state = {
            isMoving: false,
            offset: { top: 0, left: 0 },
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
    componentDidUpdate(props, state) {
        if (!state.isMoving && this.state.isMoving) {
            document.addEventListener('mousemove', this.onMouseMove);
            document.addEventListener('mouseup', this.onMouseUp);
        }
        else if (state.isMoving && !this.state.isMoving) {
            document.removeEventListener('mousemove', this.onMouseMove);
            document.removeEventListener('mouseup', this.onMouseUp);
        }
    }
}
exports.default = ActivityWindow;
