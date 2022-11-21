import { Table } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import {
	changeUserValue,
	createComponent,
	createPannelOptions,
	useDynamicAddEventCenter,
	useRegistFunc,
} from 'dooringx-lib';
import { FormMap } from '../formTypes';
import { ComponentRenderConfigProps } from 'dooringx-lib/dist/core/components/componentItem';

function TableComponent(pr: ComponentRenderConfigProps) {
	const props = pr.data.props;
	const eventCenter = useMemo(() => {
		return pr.config.getEventCenter();
	}, [pr.config]);

	useDynamicAddEventCenter(pr, `${pr.data.id}-init`, '初始渲染时机'); //注册名必须带id 约定！
	useDynamicAddEventCenter(pr, `${pr.data.id}-click`, '点击执行时机');
	useEffect(() => {
		// 模拟抛出事件
		if (pr.context === 'preview') {
			eventCenter.runEventQueue(`${pr.data.id}-init`, pr.config);
		}
	}, [eventCenter, pr.config, pr.context, pr.data.id]);

	const [text, setText] = useState('');
	const op1 = props.op1;

	const fn = useMemo(() => {
		const functionCenter = eventCenter.getFunctionCenter();
		return functionCenter.register({
			id: `${pr.data.id}+changeText`,
			fn: async (ctx, next, config, args: any, _eventList, iname) => {
				console.log('-table-op1-b-')
				const userSelect = iname.data;
				const ctxVal = changeUserValue(
					userSelect['改变文本数据源'],
					args,
					'_changeval',
					config,
					ctx
				);
				const text = ctxVal[0];
				setText(text);
				next();
			},
			config: [
				{
					name: '改变文本数据源',
					data: ['ctx', 'input', 'dataSource'],
					options: {
						receive: '_changeval',
						multi: false,
					},
				},
			],
			name: `${pr.data.id}+改变文本函数`,
			componentId: pr.data.id,
		});
	}, []);

	useRegistFunc(op1, pr.context, fn);

	return (
		<Table
			style={{
				width: pr.data.width ? pr.data.width : props.sizeData[0],
				height: pr.data.height ? pr.data.height : props.sizeData[1],
				borderRadius: props.borderRadius + 'px',
				border: `${props.borderData.borderWidth}px ${props.borderData.borderStyle} ${props.borderData.borderColor}`,
				backgroundColor: props.backgroundColor,
				color: props.fontData.color,
				fontSize: props.fontData.fontSize,
				fontWeight: props.fontData.fontWeight,
				fontStyle: props.fontData.fontStyle,
				textDecoration: props.fontData.textDecoration,
				lineHeight: props.lineHeight,
			}}
			onClick={() => {
				eventCenter.runEventQueue(`${pr.data.id}-click`, pr.config);
			}}
		>
			{text ? text : props.text}
		</Table>
	);
}

const RegTable = createComponent({
	name: 'table',
	display: '表格',
	props: {
		style: [
			createPannelOptions<FormMap, 'input'>('input', {
				receive: 'text',
				label: '文字',
			}),
			createPannelOptions<FormMap, 'switch'>('switch', {
				receive: 'op1',
				label: '改变文本函数',
			}),
		],
		fn: [
			createPannelOptions<FormMap, 'switch'>('switch', {
				receive: 'op1',
				label: '改变文本函数',
			}),
		],
		animate: [createPannelOptions<FormMap, 'animateControl'>('animateControl', {})],
		actions: [createPannelOptions<FormMap, 'actionButton'>('actionButton', {})],
	},
	initData: {
		props: {
			text: 'button',
			sizeData: [100, 30],
			backgroundColor: 'rgba(0,132,255,1)',
			lineHeight: 1,
			borderRadius: 0,
			op1: false,
			borderData: {
				borderWidth: 0,
				borderColor: 'rgba(0,0,0,1)',
				borderStyle: 'solid',
			},
			fontData: {
				fontSize: 14,
				textDecoration: 'none',
				fontStyle: 'normal',
				color: 'rgba(255,255,255,1)',
				fontWeight: 'normal',
			},
		},
		width: 100,
		height: 30,
		rotate: {
			canRotate: true,
			value: 0,
		},
		canDrag: true,
	},
	render: (data, context, store, config) => {
		return <TableComponent data={data} store={store} context={context} config={config}></TableComponent>;
	},
	resize: true,
});

export default RegTable;
