"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const activity_window_1 = require("./activity-window");
const WindowManager = (props) => {
    const openWindows = props.openWindows
        .filter(x => !x.position.isMinimized)
        .map((openWindow, i) => (React.createElement(activity_window_1.default, { key: i, depth: i, window: openWindow, availableActivities: props.availableActivities, onWindowAction: (action, options) => { props.onWindowAction(action, openWindow, options); } })));
    const dockedWindows = props.openWindows
        .filter(x => x.position.isMinimized)
        .map((openWindow, i) => (React.createElement("li", { onClick: () => { props.onWindowAction(activity_window_1.WindowAction.Restore, openWindow); }, key: i },
        openWindow.activity.icon ? React.createElement("i", { className: `fa fa-${openWindow.activity.icon}` }) : undefined,
        openWindow.activity.title)));
    return (React.createElement("div", null,
        openWindows,
        React.createElement("ul", { className: "dock" }, dockedWindows)));
};
exports.default = WindowManager;
