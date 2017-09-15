/// <reference types="react" />
import * as React from 'react';
import { ActivityProps, OpenWindow } from './types';
export declare type Props = {
    availableActivities: ActivityProps['availableActivities'];
    window: OpenWindow;
    depth: number;
    onWindowAction: ActivityProps['onWindowAction'];
};
export declare type State = {
    readonly isMoving: boolean;
    readonly offset: {
        top: number;
        left: number;
    };
    readonly windowStyle: React.CSSProperties;
};
export default class ActivityWindow extends React.Component<Props, State> {
    private element?;
    constructor(props: Props);
    private readonly windowClassName;
    render(): JSX.Element;
    componentWillReceiveProps(props: Props): void;
    componentDidUpdate(props: Props, state: State): void;
    private onDragStart;
    private onMouseDown;
    private onMouseOver;
    private onMouseUp;
    private onMouseMove;
}
