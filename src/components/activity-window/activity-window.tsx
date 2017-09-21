import * as React from 'react';
import { ActivityProps, OpenWindow, WindowPosition, WindowAction } from './types';
import TitleBar from './title-bar';

const getActivityWindowStyle = (depth: number, position: WindowPosition): React.CSSProperties => {
	const styles: React.CSSProperties = {
		position: 'absolute',
		zIndex: (100 - depth) * 100,
		overflow: 'hidden'
	};

	if (position.isMaximized) {
		styles.top = 0,
		styles.left =  0,
		styles.right = 0,
		styles.bottom =  0
	} else {
		styles.top = `${position.y}px`,
		styles.left =  `${position.x}px`,
		styles.width =  `${position.width}px`,
		styles.height =  `${position.height}px`
	}

	return styles;
}

export type ActivityWindowProps = {
	availableActivities: ActivityProps['availableActivities'];
	window: OpenWindow;
	depth: number;
	onFocus: (window: OpenWindow, element: HTMLElement) => void;
	onDragStart: (window: OpenWindow, element: HTMLElement) => void;
	onWindowAction: ActivityProps['onWindowAction'];
}

export type ActivityWindowState = {
	readonly isMoving: boolean;
	readonly offset: { top: number, left: number };
	readonly windowStyle: React.CSSProperties;
}

export default class ActivityWindow extends React.Component<ActivityWindowProps, ActivityWindowState> {
	private element?: HTMLElement | null;

	public constructor(props: ActivityWindowProps) {
		super(props);
		this.state = {
			isMoving: false,
			offset: { top: 0, left: 0 },
			windowStyle: getActivityWindowStyle(props.depth, props.window.position)
		};
	}

	private get windowClassName(): string {
		const classList: string[] = ['activity'];

		if (this.props.window.position.isMaximized) {
			classList.push('maximized');
		}

		if (this.state.isMoving) {
			classList.push('dragging');
		}

		return classList.join(' ');
	}

	public render(): JSX.Element {
		const ActivityComponent = this.props.window.activity.component;

		return (
			<div
				ref={ ref => { this.element = ref; } }
				className={ this.windowClassName }
				style={ this.state.windowStyle }
				onMouseOver={ this.onMouseOver }
				onMouseDown={ this.onMouseDown }>
				<TitleBar window={ this.props.window } onWindowAction={ this.props.onWindowAction } onMouseDown={ this.onDragStart } />
				<ActivityComponent
					availableActivities={ this.props.availableActivities }
					onWindowAction={ (action, options) => { this.props.onWindowAction(action, options); } } />
			</div>
		);
	}

	public componentWillReceiveProps(props: ActivityWindowProps): void {
		this.setState(state => ({
			...state,
			windowStyle: getActivityWindowStyle(props.depth, props.window.position)
		}));
	}

	private onDragStart = (e: React.MouseEvent<any>): void => {
		if (this.state.isMoving || this.props.window.position.isMaximized || !this.element) { return; }
		e.preventDefault();

		const top = e.clientY - this.element.offsetTop;
		const left = e.clientX - this.element.offsetLeft;

		this.setState({
			isMoving: true,
			offset: { top, left }
		});
	}

	private onMouseDown = (e: React.MouseEvent<any>): void => {
		if (this.props.depth !== 0) {
			this.props.onFocus(this.props.window, this.element as HTMLElement);
		}
	}

	private onMouseOver = (e: React.MouseEvent<any>): void => {
		// const { left: x, top: y } = this.element.getBoundingClientRect();
		// const mouse = { x: e.clientX, y: e.clientY };
		//
		// const topOffset = mouse.y - y;
		// const bottomOffset = mouse.y - y - height;
		// const leftOffset = mouse.x - x;
		// const rightOffset = mouse.x - x - width;
		//
		// console.log(topOffset);
		// console.log(bottomOffset);
		// console.log(leftOffset);
		// console.log(rightOffset);
		//
		// if (-10 <= topOffset && topOffset <= 10) {
		// 	console.log('top edge');
		// } else if (-10 <= bottomOffset && bottomOffset <= 10) {
		// 	console.log('bottom edge');
		// } else if (-10 <= leftOffset && leftOffset <= 10) {
		// 	console.log('left edge');
		// } else if (-10 <= rightOffset && rightOffset <= 10) {
		// 	console.log('right edge');
		// }
	}
}
