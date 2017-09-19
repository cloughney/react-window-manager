import * as React from 'react';
import ActivityWindow, { Activity, ActivityProps, OpenWindow, WindowAction } from './activity-window';

export type WindowManagerProps = {
	availableActivities: Activity[];
	openWindows: OpenWindow[];
	onWindowAction: (action: WindowAction, window: OpenWindow, options?: any) => void; //TODO types for options
}

const WindowManager: React.SFC<WindowManagerProps> = (props: WindowManagerProps): JSX.Element => {
	const openWindows = props.openWindows
		.filter(x => !x.position.isMinimized)
		.map((openWindow, i) => (
			<ActivityWindow
				key={ i } depth={ i } window={ openWindow }
				availableActivities={ props.availableActivities }
				onWindowAction={ (action, options) => { props.onWindowAction(action, openWindow, options) } } />
			));

	const dockedWindows = props.openWindows
		.filter(x => x.position.isMinimized)
		.map((openWindow, i) => (
			<li onClick={ () => { props.onWindowAction(WindowAction.Restore, openWindow) } } key={ i }>
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

export default WindowManager;