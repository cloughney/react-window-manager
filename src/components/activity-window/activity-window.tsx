import * as React from 'react';
import { ActivityProps, OpenWindow, WindowPosition, WindowAction } from './types';
import TitleBar from './title-bar';

const getActivityWindowStyle = (depth: number, position: WindowPosition): React.CSSProperties => {
	const styles: React.CSSProperties = {
		position: 'absolute',
		zIndex: (100 - depth) * 100,
		overflow: 'hidden'
	};

	switch (position.state) {
		case 'MAXIMIZED':
			return { ...styles, top: 0, left: 0, right: 0, bottom: 0 };
		case 'MINIMIZED':
			return styles;
		case 'NORMAL':
		default:
			return {
				...styles,
				top: `${position.y}px`,
				left: `${position.x}px`,
				width: `${position.width}px`,
				height: `${position.height}px`
			};
	}
}

export type ActivityWindowProps = ActivityProps & {
	window: OpenWindow;
	depth: number;
	onFocus: (window: OpenWindow) => void;
	onDragStart: (window: OpenWindow, offset: { x: number, y: number }) => void;
}

export type ActivityWindowState = {
	readonly isMoving: boolean;
	readonly windowStyle: React.CSSProperties;
}

export default class ActivityWindow extends React.Component<ActivityWindowProps, ActivityWindowState> {
	private element?: HTMLElement | null;

	public constructor(props: ActivityWindowProps) {
		super(props);
		this.state = {
			isMoving: false,
			windowStyle: getActivityWindowStyle(props.depth, props.window.position)
		};
	}

	private get windowClassName(): string {
		const classList: string[] = ['activity'];

		if (this.props.window.position.state === 'MAXIMIZED') {
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

	private onDragStart = (e: React.MouseEvent<HTMLElement>): void => {
		if (this.props.window.position.state !== 'NORMAL' || !this.element) {
			return;
		}

		const offset = {
			x: e.clientX - this.element.offsetLeft,
			y: e.clientY - this.element.offsetTop
		};

		this.setState({ isMoving: true });
		this.props.onDragStart(this.props.window, offset);
	}

	private onMouseDown = (e: React.MouseEvent<any>): void => {
		if (!this.element) { return; }

		if (this.props.depth !== 0) {
			this.props.onFocus(this.props.window);
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
