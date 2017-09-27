/// <reference types="react" />
export declare type ActivityProps = {
    availableActivities: Activity[];
    onWindowAction: (action: WindowAction, options?: object) => void;
};
export declare enum WindowAction {
    Open = 0,
    Close = 1,
    Focus = 2,
    Restore = 3,
    Minimize = 4,
    Maximize = 5,
    Resize = 6,
    Move = 7,
}
export interface WindowPosition {
    x: number;
    y: number;
    width: number;
    height: number;
    state: 'NORMAL' | 'MAXIMIZED' | 'MINIMIZED';
}
export declare type ActivityComponent = React.ComponentType<ActivityProps>;
export declare type Activity = {
    locator: string;
    title: string;
    icon?: string;
    component: ActivityComponent;
};
export interface OpenWindow {
    activity: Activity;
    position: WindowPosition;
}
