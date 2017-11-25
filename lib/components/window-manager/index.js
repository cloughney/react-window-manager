"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const activity_window_1 = require("../activity-window");
const defaultPosition = {
    x: 50,
    y: 25,
    width: 640,
    height: 480,
    state: 'NORMAL'
};
class WindowManager extends React.Component {
    constructor(props) {
        super(props);
        this.onWindowFocus = (openWindow) => {
            this.setState(state => ({
                openWindows: [
                    openWindow,
                    ...state.openWindows.filter(x => x !== openWindow)
                ],
                activeWindow: {
                    isMoving: false,
                    mouseOffset: { x: 0, y: 0 }
                }
            }));
        };
        this.onWindowDragStart = (openWindow, mouseOffset) => {
            this.setState(state => ({
                activeWindow: Object.assign({}, state.activeWindow, { isMoving: true, mouseOffset, windowSize: {
                        width: openWindow.position.width,
                        height: openWindow.position.height
                    } })
            }));
        };
        this.onMouseUp = (e) => {
            const activeWindow = this.state.activeWindow;
            if (!activeWindow || !activeWindow.isMoving) {
                return;
            }
            e.preventDefault();
            const x = e.clientX - activeWindow.mouseOffset.x;
            const y = e.clientY - activeWindow.mouseOffset.y;
            this.setState(state => ({
                openWindows: [
                    Object.assign({}, state.openWindows[0], { position: Object.assign({}, state.openWindows[0].position, this.getBoundedCoordinates(x, y)) }),
                    ...state.openWindows.slice(1)
                ],
                activeWindow: Object.assign({}, state.activeWindow, { isMoving: false, mouseOffset: { x: 0, y: 0 }, windowSize: { width: 0, height: 0 } })
            }));
        };
        this.onMouseMove = (e) => {
            const activeWindow = this.state.activeWindow;
            if (!activeWindow || !activeWindow.isMoving) {
                return;
            }
            e.preventDefault();
            const x = e.clientX - activeWindow.mouseOffset.x;
            const y = e.clientY - activeWindow.mouseOffset.y;
            this.setState(state => ({
                openWindows: [
                    Object.assign({}, state.openWindows[0], { position: Object.assign({}, state.openWindows[0].position, this.getBoundedCoordinates(x, y)) }),
                    ...state.openWindows.slice(1)
                ]
            }));
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
                    return this.setState(state => ({
                        openWindows: [
                            Object.assign({}, openWindow, { position: Object.assign({}, openWindow.position, { state: 'NORMAL' }) }),
                            ...state.openWindows.filter(x => x !== openWindow)
                        ]
                    }));
                case activity_window_1.WindowAction.Maximize:
                    return this.setState(state => ({
                        openWindows: [
                            Object.assign({}, openWindow, { position: Object.assign({}, openWindow.position, { state: 'MAXIMIZED' }) }),
                            ...state.openWindows.filter(x => x !== openWindow)
                        ]
                    }));
                case activity_window_1.WindowAction.Minimize:
                    return this.setState(state => ({
                        openWindows: [
                            ...state.openWindows.filter(x => x !== openWindow),
                            Object.assign({}, openWindow, { position: Object.assign({}, openWindow.position, { state: 'MINIMIZED' }) })
                        ]
                    }));
            }
        };
        const availableActivities = props.availableActivities || [];
        const openWindows = props.openWindows || [];
        const activeWindow = {
            isMoving: false,
            mouseOffset: { x: 0, y: 0 },
            windowSize: { width: 0, height: 0 }
        };
        this.state = { availableActivities, openWindows, activeWindow };
    }
    render() {
        const openWindows = this.state.openWindows
            .filter(x => x.position.state !== 'MINIMIZED')
            .map((openWindow, i) => (React.createElement(activity_window_1.default, { key: i, depth: i, window: openWindow, availableActivities: this.state.availableActivities, onFocus: this.onWindowFocus, onDragStart: this.onWindowDragStart, onWindowAction: (action, options) => { this.onWindowAction(action, openWindow, options); } })));
        const dockedWindows = this.state.openWindows
            .filter(x => x.position.state === 'MINIMIZED')
            .map((openWindow, i) => (React.createElement("li", { onClick: () => { this.onWindowAction(activity_window_1.WindowAction.Restore, openWindow); }, key: i },
            React.createElement("button", null,
                openWindow.activity.icon ? React.createElement("i", { className: `fa fa-${openWindow.activity.icon}` }) : undefined,
                openWindow.activity.title))));
        return (React.createElement("div", { ref: x => { this.element = x; } },
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
    getBoundedCoordinates(x, y) {
        if (!this.state.activeWindow || !this.element) {
            return { x: 0, y: 0 };
        }
        const containerWidth = this.element.clientWidth;
        const containerHeight = this.element.clientHeight;
        const windowWidth = this.state.activeWindow.windowSize.width;
        const windowHeight = this.state.activeWindow.windowSize.height;
        const [minX, maxX, minY, maxY] = [
            0, containerWidth - windowWidth,
            0, containerHeight - windowHeight
        ];
        x = x >= minX ? x : minX;
        x = x <= maxX ? x : maxX;
        y = y >= minY ? y : minY;
        y = y <= maxY ? y : maxY;
        return { x, y };
    }
}
exports.default = WindowManager;
