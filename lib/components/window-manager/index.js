"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const activity_window_1 = require("../activity-window");
const defaultPosition = {
    x: 0,
    y: 0,
    width: 500,
    height: 300,
    isMaximized: true,
    isMinimized: false
};
class WindowManager extends React.Component {
    constructor(props) {
        super(props);
        this.onWindowFocus = (openWindow, element) => {
            this.setState(state => ({
                openWindows: [
                    openWindow,
                    ...state.openWindows.filter(x => x !== openWindow)
                ],
                activeWindow: Object.assign({}, openWindow, { element, isMoving: false, mouseOffset: { x: 0, y: 0 } })
            }));
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
            const x = e.clientX - activeWindow.mouseOffset.x;
            const y = e.clientY - activeWindow.mouseOffset.y;
            this.setActiveWindowPosition({ x, y }, { isMoving: false, mouseOffset: { x: 0, y: 0 } });
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
        this.onWindowAction = (action, openWindow, options) => {
            switch (action) {
                case activity_window_1.WindowAction.Open:
                    return this.setState(state => ({
                        openWindows: [
                            {
                                activity: options.activity,
                                position: Object.assign({}, defaultPosition)
                            },
                            ...state.openWindows
                        ]
                    }));
                case activity_window_1.WindowAction.Close:
                    return this.setState(state => ({
                        openWindows: state.openWindows.filter(x => x !== openWindow)
                    }));
                case activity_window_1.WindowAction.Restore:
                    return this.setActiveWindowPosition({ isMaximized: false, isMinimized: false });
                case activity_window_1.WindowAction.Maximize:
                    return this.setActiveWindowPosition({ isMaximized: true, isMinimized: false });
                case activity_window_1.WindowAction.Minimize:
                    return this.setActiveWindowPosition({ isMaximized: false, isMinimized: true });
            }
        };
        this.state = {
            availableActivities: props.availableActivities || [],
            openWindows: props.openWindows || [],
            activeWindow: undefined
        };
    }
    render() {
        const openWindows = this.state.openWindows
            .filter(x => !x.position.isMinimized)
            .map((openWindow, i) => (React.createElement(activity_window_1.default, { key: i, depth: i, window: openWindow, availableActivities: this.state.availableActivities, onFocus: this.onWindowFocus, onDragStart: this.onWindowDragStart, onWindowAction: (action, options) => { this.onWindowAction(action, openWindow, options); } })));
        const dockedWindows = this.state.openWindows
            .filter(x => x.position.isMinimized)
            .map((openWindow, i) => (React.createElement("li", { onClick: () => { this.onWindowAction(activity_window_1.WindowAction.Restore, openWindow); }, key: i },
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
    setActiveWindowPosition(positionUpdates, windowUpdates) {
        this.setState(state => {
            if (!state.activeWindow) {
                return;
            }
            const position = Object.assign({}, state.activeWindow.position, positionUpdates);
            return {
                activeWindow: Object.assign({}, state.activeWindow, windowUpdates, { position }),
                openWindows: state.openWindows.map(openWindow => {
                    if (openWindow !== state.activeWindow) {
                        return openWindow;
                    }
                    return Object.assign({}, openWindow, { position });
                })
            };
        });
    }
}
exports.default = WindowManager;
