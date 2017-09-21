"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const activity_window_1 = require("../activity-window");
class WindowManager extends React.Component {
    constructor(props) {
        super(props);
        this.onWindowFocus = (openWindow, element) => {
            this.setState({
                activeWindow: Object.assign({}, openWindow, { element, isMoving: false, mouseOffset: { x: 0, y: 0 } })
            });
        };
        this.onWindowDragStart = (openWindow, element, mouseOffset) => {
            this.setState(state => ({
                activeWindow: Object.assign({}, state.activeWindow, { element, isMoving: true, mouseOffset })
            }));
        };
        this.onMouseUp = (e) => {
            const activeWindow = this.state.activeWindow;
            if (!activeWindow || !activeWindow.isMoving || !activeWindow.element) {
                return;
            }
            e.preventDefault();
            this.setState({
                activeWindow: Object.assign({}, activeWindow, { isMoving: false, mouseOffset: { x: 0, y: 0 } })
            });
            this.props.onWindowAction(activity_window_1.WindowAction.Move, activeWindow, {
                x: activeWindow.element.offsetLeft,
                y: activeWindow.element.offsetTop
            });
        };
        this.onMouseMove = (e) => {
            const activeWindow = this.state.activeWindow;
            if (!activeWindow || !activeWindow.isMoving || !activeWindow.element) {
                return;
            }
            e.preventDefault();
            const x = e.clientX - activeWindow.mouseOffset.x;
            const y = e.clientY - activeWindow.mouseOffset.y;
            activeWindow.element.style.left = `${x}px`;
            activeWindow.element.style.top = `${y}px`;
        };
        this.state = { activeWindow: undefined };
    }
    render() {
        const openWindows = this.props.openWindows
            .filter(x => !x.position.isMinimized)
            .map((openWindow, i) => (React.createElement(activity_window_1.default, { key: i, depth: i, window: openWindow, availableActivities: this.props.availableActivities, onFocus: this.onWindowFocus, onDragStart: this.onWindowDragStart, onWindowAction: (action, options) => { this.props.onWindowAction(action, openWindow, options); } })));
        const dockedWindows = this.props.openWindows
            .filter(x => x.position.isMinimized)
            .map((openWindow, i) => (React.createElement("li", { onClick: () => { this.props.onWindowAction(activity_window_1.WindowAction.Restore, openWindow); }, key: i },
            React.createElement("button", null,
                openWindow.activity.icon ? React.createElement("i", { className: `fa fa-${openWindow.activity.icon}` }) : undefined,
                openWindow.activity.title))));
        return (React.createElement("div", null,
            openWindows,
            React.createElement("ul", { className: "dock" }, dockedWindows)));
    }
    componentDidUpdate(props, state) {
        const wasMoving = state.activeWindow ? state.activeWindow.isMoving : false;
        const isMoving = this.state.activeWindow ? this.state.activeWindow.isMoving : false;
        if (!wasMoving && isMoving) {
            document.addEventListener('mousemove', this.onMouseMove);
            document.addEventListener('mouseup', this.onMouseUp);
        }
        else if (wasMoving && !isMoving) {
            document.removeEventListener('mousemove', this.onMouseMove);
            document.removeEventListener('mouseup', this.onMouseUp);
        }
    }
}
exports.default = WindowManager;
