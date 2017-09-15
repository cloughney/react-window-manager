"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const types_1 = require("./types");
const stopPropagation = (e) => e.stopPropagation();
const getMaximizeToggleAction = (window) => window.position.isMaximized ? types_1.WindowAction.Restore : types_1.WindowAction.Maximize;
const getMaximizeToggleClassName = (window) => window.position.isMaximized ? 'fa fa-window-restore' : 'fa fa-window-maximize';
const TitleBar = (props) => (React.createElement("div", { className: "titlebar", onMouseDown: props.onMouseDown },
    React.createElement("div", { className: "title" },
        props.window.activity.icon
            ? React.createElement("i", { className: `fa fa-${props.window.activity.icon}` })
            : undefined,
        props.window.activity.title),
    React.createElement("button", { onMouseDown: stopPropagation, onClick: () => { props.onWindowAction(types_1.WindowAction.Close); } },
        React.createElement("i", { className: "fa fa-window-close" })),
    React.createElement("button", { onMouseDown: stopPropagation, onClick: () => { props.onWindowAction(getMaximizeToggleAction(props.window)); } },
        React.createElement("i", { className: getMaximizeToggleClassName(props.window) })),
    React.createElement("button", { onMouseDown: stopPropagation, onClick: () => { props.onWindowAction(types_1.WindowAction.Minimize); } },
        React.createElement("i", { className: "fa fa-window-minimize" }))));
exports.default = TitleBar;
