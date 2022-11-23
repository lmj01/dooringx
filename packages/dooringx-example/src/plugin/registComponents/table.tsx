import { Table } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import {
	createComponent,
	createPannelOptions,
	useDynamicAddEventCenter,
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

	const columns = [
		{
		  title: 'Name',
		  dataIndex: 'name',
		  key: 'name',
		  width: '80',
		},
		{
		  title: 'Age',
		  dataIndex: 'age',
		  key: 'age',
		  width: '80',
		},
		{
		  title: 'Address',
		  dataIndex: 'address',
		  key: 'address',
		  width: '80',
		},
	];
	const dataSource = [
		{
		  key: '1',
		  name: '',
		  age: null,
		  address: '',
		},
		{
		  key: '2',
		  name: '',
		  age: null,
		  address: '',
		},
	];

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
			tableLayout={'fixed'}
			dataSource={dataSource}
			columns={columns}
		>
		</Table>
	);
}

const RegTable = createComponent({
	name: 'table',
	display: '表格',
	props: {
		style: [
			createPannelOptions<FormMap, 'elPosition'>('elPosition', {
				label:'位置'
			}),
			createPannelOptions<FormMap, 'elSize'>('elSize', {
				label: '大小'
			}),
		],
	},
	initData: {
		props: {
			text: 'button',
			sizeData: [100, 30],
			backgroundColor: 'rgba(0,132,255,1)',
			lineHeight: 1,
			borderRadius: 0,
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
		width: 400,
		height: 200,
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
