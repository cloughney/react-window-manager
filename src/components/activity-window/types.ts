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
	state: 'NORMAL' | 'MAXIMIZED' | 'MINIMIZED';
}

export type ActivityComponent = React.ComponentType<ActivityProps>;
export type Activity = {
	locator: string;
	title: string;
	icon?: string;
	component: ActivityComponent;
	attributes?: { [key: string]: string };
}

export interface OpenWindow {
	key: string;
	activity: Activity;
	position: WindowPosition;
}
