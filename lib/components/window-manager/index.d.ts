/// <reference types="react" />
import * as React from 'react';
import { Activity, OpenWindow, WindowAction } from '../activity-window';
export declare type WindowManagerProps = {
    availableActivities: Activity[];
    openWindows: OpenWindow[];
    onWindowAction: (action: WindowAction, window: OpenWindow, options?: any) => void;
};
export declare type WindowManagerState = {
    activeWindow?: OpenWindow & {
        element: HTMLElement;
        isMoving: boolean;
        mouseOffset: {
            x: number;
            y: number;
        };
    };
};
export default class WindowManager extends React.Component<WindowManagerProps, WindowManagerState> {
    constructor(props: WindowManagerProps);
    render(): JSX.Element;
    componentDidUpdate(props: WindowManagerProps, state: WindowManagerState): void;
    private onWindowFocus;
    private onWindowDragStart;
    private onMouseUp;
    private onMouseMove;
}
