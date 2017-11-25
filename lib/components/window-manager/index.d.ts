/// <reference types="react" />
import * as React from 'react';
import { Activity, OpenWindow } from '../activity-window';
export declare type WindowManagerProps = {
    availableActivities: Activity[];
    openWindows: OpenWindow[];
};
export declare type ActiveWindowDetails = {
    isMoving: boolean;
    mouseOffset: {
        x: number;
        y: number;
    };
    windowSize: {
        width: number;
        height: number;
    };
};
export declare type WindowManagerState = {
    availableActivities: Activity[];
    openWindows: OpenWindow[];
    activeWindow?: ActiveWindowDetails;
};
export default class WindowManager extends React.Component<WindowManagerProps, WindowManagerState> {
    private windowCount;
    private element?;
    constructor(props: WindowManagerProps);
    render(): JSX.Element;
    componentDidUpdate(props: WindowManagerProps, state: WindowManagerState): void;
    private onWindowFocus;
    private onWindowDragStart;
    private onMouseUp;
    private onMouseMove;
    private onWindowAction;
    private getBoundedCoordinates(x, y);
}
