import * as React from 'react';
import ActivityWindow, { Activity, ActivityProps, OpenWindow, WindowAction } from '../activity-window';

export type WindowManagerProps = {
	availableActivities: Activity[];
	openWindows: OpenWindow[];
	onWindowAction: (action: WindowAction, window: OpenWindow, options?: any) => void; //TODO types for options
}

export type WindowManagerState = {
	activeWindow?: OpenWindow & {
		element: HTMLElement;
		isMoving: boolean;
		mouseOffset: { x: number, y: number };
	}
}

export default class WindowManager extends React.Component<WindowManagerProps, WindowManagerState> {
	public constructor(props: WindowManagerProps) {
		super(props);
		this.state = { activeWindow: undefined };
	}

	public render(): JSX.Element {
		const openWindows = this.props.openWindows
			.filter(x => !x.position.isMinimized)
			.map((openWindow, i) => (
				<ActivityWindow
					key={ i } depth={ i } window={ openWindow }
					availableActivities={ this.props.availableActivities }
					onFocus={ this.onWindowFocus }
					onDragStart={ this.onWindowDragStart }
					onWindowAction={ (action, options) => { this.props.onWindowAction(action, openWindow, options) } } />
				));

		const dockedWindows = this.props.openWindows
			.filter(x => x.position.isMinimized)
			.map((openWindow, i) => (
				<li onClick={ () => { this.props.onWindowAction(WindowAction.Restore, openWindow) } } key={ i }>
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
		//TODO move redux stuff into here

		this.setState({
			activeWindow: {
				...openWindow,
				element,
				isMoving: false,
				mouseOffset: { x: 0, y: 0 }
			}
		});
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

		this.setState({
			activeWindow: {
				...activeWindow,
				isMoving: false,
				mouseOffset: { x: 0, y: 0 }
			}
		});

		this.props.onWindowAction(WindowAction.Move, activeWindow, {
			x: activeWindow.element.offsetLeft,
			y: activeWindow.element.offsetTop
		});
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
}