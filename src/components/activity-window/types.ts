export type ActivityProps = {
	availableActivities: Activity[];
	onWindowAction: (action: WindowAction, options?: object) => void;
}

export enum WindowAction {
	Open,
	Close,
	Focus,
	Restore,
	Minimize,
	Maximize,
	Resize,
	Move
}

export interface WindowPosition {
	x: number;
	y: number;
	width: number;
	height: number;
	isMaximized: boolean;
	isMinimized: boolean;
}

export type ActivityComponent = React.ComponentType<ActivityProps>;
export type Activity = {
	locator: string;
	title: string;
	icon?: string;
	component: ActivityComponent;
}

export interface OpenWindow {
	activity: Activity;
	position: WindowPosition;
}
