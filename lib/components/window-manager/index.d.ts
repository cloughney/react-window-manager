/// <reference types="react" />
import * as React from 'react';
import { Activity, OpenWindow } from '../activity-window';
export declare type WindowManagerProps = {
    availableActivities: Activity[];
    openWindows: OpenWindow[];
};
export declare type ActiveWindow = OpenWindow & {
    element: HTMLElement;
    isMoving: boolean;
    mouseOffset: {
        x: number;
        y: number;
    };
};
export declare type WindowManagerState = {
    availableActivities: Activity[];
    openWindows: OpenWindow[];
    activeWindow?: ActiveWindow;
};
export default class WindowManager extends React.Component<WindowManagerProps, WindowManagerState> {
    constructor(props: WindowManagerProps);
    render(): JSX.Element;
    componentDidUpdate(props: WindowManagerProps, state: WindowManagerState): void;
    private onWindowFocus;
    private onWindowDragStart;
    private onMouseUp;
    private onMouseMove;
    private onWindowAction;
    private setActiveWindowPosition(positionUpdates, windowUpdates?);
}
