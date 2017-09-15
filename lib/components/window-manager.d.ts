/// <reference types="react" />
import * as React from 'react';
import { Activity, OpenWindow, WindowAction } from './activity-window';
export declare type Props = {
    availableActivities: Activity[];
    openWindows: OpenWindow[];
    onWindowAction: (action: WindowAction, window: OpenWindow, options?: any) => void;
};
declare const WindowManager: React.SFC<Props>;
export default WindowManager;
