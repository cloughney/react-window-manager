/// <reference types="react" />
import * as React from 'react';
import { Activity, OpenWindow, WindowAction } from './activity-window';
export declare type WindowManagerProps = {
    availableActivities: Activity[];
    openWindows: OpenWindow[];
    onWindowAction: (action: WindowAction, window: OpenWindow, options?: any) => void;
};
declare const WindowManager: React.SFC<WindowManagerProps>;
export default WindowManager;
