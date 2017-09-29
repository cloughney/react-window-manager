import * as React from 'react';
import ActivityWindow, { Activity, ActivityProps, OpenWindow, WindowAction, WindowPosition } from '../activity-window';

export type WindowManagerProps = {
	availableActivities: Activity[];
	openWindows: OpenWindow[];
	//onWindowAction: (action: WindowAction, window: OpenWindow, options?: any) => void; //TODO types for options
}

export type ActiveWindowDetails = {
	isMoving: boolean;
	mouseOffset: { x: number, y: number };
}

export type WindowManagerState = {
	availableActivities: Activity[];
	openWindows: OpenWindow[];
	activeWindow?: ActiveWindowDetails;
}

const defaultPosition: WindowPosition = {
	x: 0,
	y: 0,
	width: 500,
	height: 300,
	state: 'NORMAL'
};

export default class WindowManager extends React.Component<WindowManagerProps, WindowManagerState> {
	public constructor(props: WindowManagerProps) {
		super(props);

		const availableActivities = props.availableActivities || [];
		const openWindows = props.openWindows || [];
		const activeWindow = {
			isMoving: false,
			mouseOffset: { x: 0, y: 0 }
		};

		this.state = { availableActivities, openWindows, activeWindow };
	}

	public render(): JSX.Element {
		const openWindows = this.state.openWindows
			.filter(x => x.position.state !== 'MINIMIZED')
			.map((openWindow, i) => (
				<ActivityWindow
					key={ i } depth={ i } window={ openWindow }
					availableActivities={ this.state.availableActivities }
					onFocus={ this.onWindowFocus }
					onDragStart={ this.onWindowDragStart }
					onWindowAction={ (action, options) => { this.onWindowAction(action, openWindow, options) } } />
				));

		const dockedWindows = this.state.openWindows
			.filter(x => x.position.state === 'MINIMIZED')
			.map((openWindow, i) => (
				<li onClick={ () => { this.onWindowAction(WindowAction.Restore, openWindow) } } key={ i }>
					<button>
						{ openWindow.activity.icon ? <i className={ `fa fa-${openWindow.activity.icon}` } /> : undefined }
						{ openWindow.activity.title }
					</button>
				</li>
			));

		return (
			<div>
				{ openWindows }
				<ul className="dock">
					{ dockedWindows }
				</ul>
			</div>
		);
	}
	
	public componentDidUpdate(props: WindowManagerProps, state: WindowManagerState): void {
		const wasMoving = state.activeWindow ? state.activeWindow.isMoving : false;
		const isMoving = this.state.activeWindow ? this.state.activeWindow.isMoving : false;

		if (!wasMoving && isMoving) {
			document.addEventListener('mousemove', this.onMouseMove);
			document.addEventListener('mouseup', this.onMouseUp);
		} else if (wasMoving && !isMoving) {
			document.removeEventListener('mousemove', this.onMouseMove);
			document.removeEventListener('mouseup', this.onMouseUp);
		}
	}

	private onWindowFocus = (openWindow: OpenWindow): void => {
		this.setState(state => ({
			openWindows: [
				openWindow,
				...state.openWindows.filter(x => x !== openWindow)
			],
			activeWindow: {
				isMoving: false,
				mouseOffset: { x: 0, y: 0 }
			}
		}));
	}

	private onWindowDragStart = (openWindow: OpenWindow, mouseOffset: { x: number, y: number }): void => {
		this.setState(state => ({
			activeWindow: {
				...state.activeWindow,
				isMoving: true,
				mouseOffset
			}
		}));
	}

	private onMouseUp = (e: MouseEvent): void => {
		const activeWindow = this.state.activeWindow;
		if (!activeWindow || !activeWindow.isMoving) {
			return;
		}

		e.preventDefault();
		
		const x = e.clientX - activeWindow.mouseOffset.x;
		const y = e.clientY - activeWindow.mouseOffset.y;

		this.setState(state => ({
			openWindows: [
				{ ...state.openWindows[0], position: { ...state.openWindows[0].position, x, y } },
				...state.openWindows.slice(1)
			],
			activeWindow: {
				...state.activeWindow,
				isMoving: false,
				mouseOffset: { x: 0, y: 0 }
			}
		}));
	}

	private onMouseMove = (e: MouseEvent): void => {
		const activeWindow = this.state.activeWindow;
		if (!activeWindow || !activeWindow.isMoving) {
			return;
		}
		
		e.preventDefault();

		const x = e.clientX - activeWindow.mouseOffset.x;
		const y = e.clientY - activeWindow.mouseOffset.y;

		this.setState(state => ({
			openWindows: [
				{ ...state.openWindows[0], position: { ...state.openWindows[0].position, x, y } },
				...state.openWindows.slice(1)
			]
		}));
	}

	private onWindowAction = (action: WindowAction, openWindow: OpenWindow, options?: any): void => {
		switch (action) {
			case WindowAction.Open:
				return this.setState(state => ({
					openWindows: [
						{
							activity: options.activity,
							position: { ...defaultPosition }
						},
						...state.openWindows
					]
				}));
			case WindowAction.Close:
				return this.setState(state => ({ 
					openWindows: state.openWindows.filter(x => x !== openWindow)
				}));

			case WindowAction.Restore:
				return this.setState(state => ({
					openWindows: [
						{ ...openWindow, position: { ...openWindow.position, state: 'NORMAL' } },
						...state.openWindows.filter(x => x !== openWindow)
					]
				}));
			case WindowAction.Maximize:
				return this.setState(state => ({
					openWindows: [
						{ ...openWindow, position: { ...openWindow.position, state: 'MAXIMIZED' } },
						...state.openWindows.filter(x => x !== openWindow)
					]
				}));
			case WindowAction.Minimize:
				return this.setState(state => ({
					openWindows: [
						...state.openWindows.filter(x => x !== openWindow),
						{ ...openWindow, position: { ...openWindow.position, state: 'MINIMIZED' } }
					]
				}));
		}
	}
}