import { store } from '../../runtime/store';
import { RefObject, useMemo } from 'react';
import { scaleState } from '../scale/state';
import { IBlockType } from '../store/storetype';
import { deepCopy } from '../utils';
import React from 'react';
import classnames from 'classnames';
import styles from '../../index.less';
interface BlockResizerProps {
	data: IBlockType;
	rect: RefObject<HTMLDivElement>;
}
interface resizeStateType {
	startX: number;
	startY: number;
	item: null | IBlockType;
	isResize: boolean;
	direction: directionType;
	ref: RefObject<HTMLDivElement> | null;
	current: number;
}
type directionType =
	| 'top'
	| 'topleft'
	| 'topright'
	| 'left'
	| 'bottomleft'
	| 'bottom'
	| 'bottomright'
	| 'right';
export const resizeState: resizeStateType = {
	startX: 0,
	startY: 0,
	item: null,
	isResize: false,
	direction: 'bottom',
	ref: null,
	current: 0,
};

const onMouseDown = (
	e: React.MouseEvent,
	direction: directionType,
	item: IBlockType,
	ref: RefObject<HTMLDivElement>
) => {
	e.stopPropagation();
	resizeState.isResize = true;
	resizeState.item = item;
	resizeState.startX = e.clientX;
	resizeState.startY = e.clientY;
	resizeState.direction = direction;
	resizeState.ref = ref;
	resizeState.current = store.getIndex();
};

export const resizerMouseUp = () => {
	resizeState.isResize = false;
	resizeState.item = null;
	if (resizeState.current) {
		const endindex = store.getIndex();
		store.getStoreList().splice(resizeState.current, endindex - resizeState.current);
		store.setIndex(resizeState.current);
	}
	resizeState.current = 0;
};
const changePosition = (v: IBlockType, durX: number, durY: number) => {
	const direction = resizeState.direction;
	const { width, height } = resizeState.ref!.current!.getBoundingClientRect();
	const scale = scaleState.value;
	let tmpy = height / scale - durY;
	let tmpx = width / scale - durX;
	switch (direction) {
		case 'right':
			v.width = width / scale + durX;
			break;
		case 'bottom':
			v.height = height / scale + durY;
			break;
		case 'left':
			v.left = width / scale > 0 ? v.left + durX : v.left;
			v.width = tmpx > 0 ? tmpx : 0;
			break;
		case 'top':
			v.top = height / scale > 0 ? v.top + durY : v.top;
			v.height = tmpy > 0 ? tmpy : 0;
			break;
		case 'bottomright':
			v.width = width / scale + durX;
			v.height = height / scale + durY;
			break;
		case 'topright':
			v.width = width / scale + durX;
			v.top = height / scale > 0 ? v.top + durY : v.top;
			v.height = tmpy > 0 ? tmpy : 0;
			break;
		case 'topleft':
			v.top = height / scale > 0 ? v.top + durY : v.top;
			v.height = tmpy > 0 ? tmpy : 0;
			v.left = width / scale > 0 ? v.left + durX : v.left;
			v.width = tmpx > 0 ? tmpx : 0;
			break;
		case 'bottomleft':
			v.left = width / scale > 0 ? v.left + durX : v.left;
			v.width = tmpx > 0 ? tmpx : 0;
			v.height = height / scale + durY;
			break;
		default:
			break;
	}
};

export const resizerMouseMove = (e: React.MouseEvent) => {
	//根据direction修改位置
	if (resizeState.isResize && resizeState.item) {
		let { clientX: moveX, clientY: moveY } = e;
		const { startX, startY } = resizeState;
		const scale = scaleState.value;
		let durX = (moveX - startX) / scale;
		let durY = (moveY - startY) / scale;
		const clonedata = deepCopy(store.getData());
		const newblock: IBlockType[] = clonedata.block.map((v: IBlockType) => {
			if (v.id === resizeState.item!.id) {
				changePosition(v, durX, durY);
			}
			return v;
		});
		resizeState.startX = moveX;
		resizeState.startY = moveY;
		store.setData({ ...clonedata, block: newblock });
	}
};

export function BlockResizer(props: BlockResizerProps) {
	const render = useMemo(() => {
		if (props.data.focus && props.data.resize) {
			return (
				<>
					<div
						className={classnames(styles.resizepoint, styles.top)}
						onMouseDown={(e) => {
							onMouseDown(e, 'top', props.data, props.rect);
						}}
						onMouseUp={resizerMouseUp}
					></div>
					<div
						className={classnames(styles.resizepoint, styles.topleft)}
						onMouseDown={(e) => {
							onMouseDown(e, 'topleft', props.data, props.rect);
						}}
						onMouseUp={resizerMouseUp}
					></div>
					<div
						className={classnames(styles.resizepoint, styles.left)}
						onMouseDown={(e) => {
							onMouseDown(e, 'left', props.data, props.rect);
						}}
						onMouseUp={resizerMouseUp}
					></div>
					<div
						className={classnames(styles.resizepoint, styles.topright)}
						onMouseDown={(e) => {
							onMouseDown(e, 'topright', props.data, props.rect);
						}}
						onMouseUp={resizerMouseUp}
					></div>
					<div
						className={classnames(styles.resizepoint, styles.bottomleft)}
						onMouseDown={(e) => {
							onMouseDown(e, 'bottomleft', props.data, props.rect);
						}}
						onMouseUp={resizerMouseUp}
					></div>
					<div
						className={classnames(styles.resizepoint, styles.bottom)}
						onMouseDown={(e) => {
							onMouseDown(e, 'bottom', props.data, props.rect);
						}}
						onMouseUp={resizerMouseUp}
					></div>
					<div
						className={classnames(styles.resizepoint, styles.right)}
						onMouseDown={(e) => {
							onMouseDown(e, 'right', props.data, props.rect);
						}}
						onMouseUp={resizerMouseUp}
					></div>
					<div
						className={classnames(styles.resizepoint, styles.bottomright)}
						onMouseDown={(e) => {
							onMouseDown(e, 'bottomright', props.data, props.rect);
						}}
						onMouseUp={resizerMouseUp}
					></div>
				</>
			);
		} else {
			return null;
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.data.focus, props.data.resize]);

	return <>{render}</>;
}