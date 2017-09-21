/// <reference types="react" />
import * as React from 'react';
import { ActivityProps, OpenWindow } from './types';
export declare type ActivityWindowProps = {
    availableActivities: ActivityProps['availableActivities'];
    window: OpenWindow;
    depth: number;
    onFocus: () => void;
    onDragStart: () => void;
    onWindowAction: ActivityProps['onWindowAction'];
};
export declare type ActivityWindowState = {
    readonly isMoving: boolean;
    readonly offset: {
        top: number;
        left: number;
    };
    readonly windowStyle: React.CSSProperties;
};
export default class ActivityWindow extends React.Component<ActivityWindowProps, ActivityWindowState> {
    private element?;
    constructor(props: ActivityWindowProps);
    private readonly windowClassName;
    render(): JSX.Element;
    componentWillReceiveProps(props: ActivityWindowProps): void;
    componentDidUpdate(props: ActivityWindowProps, state: ActivityWindowState): void;
    private onDragStart;
    private onMouseDown;
    private onMouseOver;
    private onMouseUp;
    private onMouseMove;
}
