import * as React from 'react';
import ActivityWindow, { Activity, ActivityProps, OpenWindow, WindowAction, WindowPosition } from '../activity-window';

export type WindowManagerProps = {
	availableActivities: Activity[];
	openWindows: OpenWindow[];
	//onWindowAction: (action: WindowAction, window: OpenWindow, options?: any) => void; //TODO types for options
}

export type ActiveWindow = {
	window: OpenWindow;
	element: HTMLElement;
	isMoving: boolean;
	mouseOffset: { x: number, y: number };
}

export type WindowManagerState = {
	availableActivities: Activity[];
	openWindows: OpenWindow[];
	activeWindow?: ActiveWindow;
}

const defaultPosition: WindowPosition = {
	x: 0,
	y: 0,
	width: 500,
	height: 300,
	isMaximized: true,
	isMinimized: false
};

export default class WindowManager extends React.Component<WindowManagerProps, WindowManagerState> {
	public constructor(props: WindowManagerProps) {
		super(props);
		this.state = {
			availableActivities: props.availableActivities || [],
			openWindows: props.openWindows || [],
			activeWindow: undefined
		};
	}

	public render(): JSX.Element {
		const openWindows = this.state.openWindows
			.filter(x => !x.position.isMinimized)
			.map((openWindow, i) => (
				<ActivityWindow
					key={ i } depth={ i } window={ openWindow }
					availableActivities={ this.state.availableActivities }
					onFocus={ this.onWindowFocus }
					onDragStart={ this.onWindowDragStart }
					onWindowAction={ (action, options) => { this.onWindowAction(action, openWindow, options) } } />
				));

		const dockedWindows = this.state.openWindows
			.filter(x => x.position.isMinimized)
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

	private onWindowFocus = (openWindow: OpenWindow, element: HTMLElement): void => {
		this.setState(state => ({
			openWindows: [
				openWindow,
				...state.openWindows.filter(x => x !== openWindow)
			],
			activeWindow: {
				window: openWindow,
				element,
				isMoving: false,
				mouseOffset: { x: 0, y: 0 }
			}
		}));
	}

	private onWindowDragStart = (openWindow: OpenWindow, element: HTMLElement, mouseOffset: { x: number, y: number }): void => {
		this.setState(state => ({
			activeWindow: {
				...state.activeWindow,
				element,
				isMoving: true,
				mouseOffset
			}
		}));
	}

	private onMouseUp = (e: MouseEvent): void => {
		const activeWindow = this.state.activeWindow;
		if (!activeWindow || !activeWindow.isMoving || !activeWindow.element) {
			return;
		}

		e.preventDefault();
		
		const x = e.clientX - activeWindow.mouseOffset.x;
		const y = e.clientY - activeWindow.mouseOffset.y;

		this.setActiveWindowPosition({ x, y }, { isMoving: false, mouseOffset: { x: 0, y: 0 } });
	}

	private onMouseMove = (e: MouseEvent): void => {
		const activeWindow = this.state.activeWindow;
		if (!activeWindow || !activeWindow.isMoving || !activeWindow.element) {
			return;
		}
		
		e.preventDefault();

		const x = e.clientX - activeWindow.mouseOffset.x;
		const y = e.clientY - activeWindow.mouseOffset.y;

		activeWindow.element.style.left = `${x}px`;
		activeWindow.element.style.top = `${y}px`;
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
				return this.setActiveWindowPosition({ isMaximized: false, isMinimized: false });
			case WindowAction.Maximize:
				return this.setActiveWindowPosition({ isMaximized: true, isMinimized: false });
			case WindowAction.Minimize:
				return this.setActiveWindowPosition({ isMaximized: false, isMinimized: true });
		}
	}

	private setActiveWindowPosition(positionUpdates: Partial<WindowPosition>, windowUpdates?: Partial<ActiveWindow>): void {
		this.setState(state => {
			if (!state.activeWindow) {
				return;
			}

			const activeWindow = state.activeWindow;
			const position = { ...activeWindow.window.position, ...positionUpdates };

			return {
				activeWindow: {
					...activeWindow,
					...windowUpdates,
					position
				},
				openWindows: state.openWindows.map(openWindow => {
					if (openWindow !== activeWindow.window) { return openWindow; }
					return { ...openWindow, position };
				})
			};
		});
	}
}