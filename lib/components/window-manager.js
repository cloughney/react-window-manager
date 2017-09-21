"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const activity_window_1 = require("./activity-window");
class WindowManager extends React.Component {
    constructor(props) {
        super(props);
        this.onFocus = (openWindow, element) => {
            this.setState({ activeWindow: Object.assign({}, openWindow, { element }) });
        };
        this.state = { activeWindow: undefined };
    }
    render() {
        const openWindows = this.props.openWindows
            .filter(x => !x.position.isMinimized)
            .map((openWindow, i) => (React.createElement(activity_window_1.default, { key: i, depth: i, window: openWindow, availableActivities: this.props.availableActivities, onFocus: this.onFocus, onDragStart: (w, e) => void 0, onWindowAction: (action, options) => { this.props.onWindowAction(action, openWindow, options); } })));
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
}
exports.default = WindowManager;
