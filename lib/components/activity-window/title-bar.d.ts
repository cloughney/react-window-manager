/// <reference types="react" />
import * as React from 'react';
import { OpenWindow, ActivityProps } from './types';
export declare type Props = {
    onMouseDown: React.MouseEventHandler<HTMLDivElement>;
    onWindowAction: ActivityProps['onWindowAction'];
    window: OpenWindow;
};
declare const TitleBar: React.SFC<Props>;
export default TitleBar;
