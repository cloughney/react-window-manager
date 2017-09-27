/// <reference types="react" />
import * as React from 'react';
import { ActivityProps, OpenWindow } from './types';
export declare type ActivityWindowProps = ActivityProps & {
    window: OpenWindow;
    depth: number;
    onFocus: (window: OpenWindow) => void;
    onDragStart: (window: OpenWindow, offset: {
        x: number;
        y: number;
    }) => void;
};
export declare type ActivityWindowState = {
    readonly isMoving: boolean;
    readonly windowStyle: React.CSSProperties;
};
export default class ActivityWindow extends React.Component<ActivityWindowProps, ActivityWindowState> {
    private element?;
    constructor(props: ActivityWindowProps);
    private readonly windowClassName;
    render(): JSX.Element;
    componentWillReceiveProps(props: ActivityWindowProps): void;
    private onDragStart;
    private onMouseDown;
    private onMouseOver;
}
