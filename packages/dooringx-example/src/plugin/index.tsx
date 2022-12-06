/*
 * @Author: yehuozhili
 * @Date: 2021-02-27 21:33:36
 * @LastEditors: yehuozhili
 * @LastEditTime: 2022-04-29 23:35:58
 * @FilePath: \dooringx\packages\dooringx-example\src\plugin\index.tsx
 */

import { InitConfig, LeftDataPannel } from 'dooringx-lib';
import { LeftRegistComponentMapItem } from 'dooringx-lib/dist/core/crossDrag';
import { ContainerOutlined, PlayCircleOutlined, HighlightOutlined, TableOutlined, LineOutlined, MessageOutlined, FieldNumberOutlined } from '@ant-design/icons';
import commandModules from './commanderModules';
import { functionMap } from './functionMap';
import { Formmodules } from './formComponentModules';
import InputCo from './registComponents/inputCo';

const LeftRegistMap: LeftRegistComponentMapItem[] = [
	// {
	// 	type: 'basic',
	// 	component: 'button',
	// 	img: 'icon-anniu',
	// 	imgCustom: <PlayCircleOutlined />,
	// 	displayName: '按钮',
	// 	urlFn: () => import('./registComponents/button'),
	// },
	// {
	// 	type: 'basic',
	// 	component: 'input',
	// 	img: 'https://img.guguzhu.com/d/file/android/ico/2021/09/08/rytzi2w34tm.png',
	// 	displayName: '输入框',
	// },
	// {
	// 	type: 'basic',
	// 	component: 'testco',
	// 	img: 'icon-anniu',
	// 	imgCustom: <PlayCircleOutlined />,
	// 	displayName: '测试按钮',
	// 	urlFn: () => import('./registComponents/testco'),
	// },
	{
		type: 'basic',
		component: 'shapeLine',
		img: 'icon-anniu',
		imgCustom: <LineOutlined />,
		displayName: '直线',
		urlFn: () => import('./registComponents/shapeLine'),
	},
	{
		type: 'basic',
		component: 'inputText',
		img: 'icon-anniu',
		imgCustom: <MessageOutlined />,
		displayName: '文本',
		urlFn: () => import('./registComponents/text'),
	},
	{
		type: 'basic',
		component: 'table',
		img: 'icon-anniu',
		imgCustom: <TableOutlined />,
		displayName: '表格',
		urlFn: () => import('./registComponents/table'),
	},
	{
		type: 'basic',
		component: 'title',
		img: 'icon-anniu',
		imgCustom: <FieldNumberOutlined />,
		displayName: '编号',
		urlFn: () => import('./registComponents/title'),
	},
];

export const defaultConfig: Partial<InitConfig> = {
	leftAllRegistMap: LeftRegistMap,
	leftRenderListCategory: [
		{
			type: 'basic',
			icon: <HighlightOutlined />,
			displayName: '基础',
		},
		// {
		// 	type: 'media',
		// 	icon: <PlayCircleOutlined />,
		// 	displayName: '媒体组件',
		// },
		// {
		// 	type: 'datax',
		// 	icon: <ContainerOutlined />,
		// 	custom: true,
		// 	displayName: '数据源',
		// 	customRender: (config) => <LeftDataPannel config={config}></LeftDataPannel>,
		// },
		// {
		// 	type: 'xxc',
		// 	icon: <ContainerOutlined />,
		// 	custom: true,
		// 	displayName: '自定义',
		// 	customRender: () => <div>我是自定义渲染</div>,
		// },
	],
	initComponentCache: {
		input: { component: InputCo },
	},
	rightRenderListCategory: [
		{
			type: 'style',
			icon: (
				<div className="right-tab-item" style={{ width: 50, textAlign: 'center' }}>
					外观
				</div>
			),
		},
		// {
		// 	type: 'animate',
		// 	icon: (
		// 		<div className="right-tab-item" style={{ width: 50, textAlign: 'center' }}>
		// 			动画
		// 		</div>
		// 	),
		// },
		// {
		// 	type: 'fn',
		// 	icon: (
		// 		<div className="right-tab-item" style={{ width: 50, textAlign: 'center' }}>
		// 			函数
		// 		</div>
		// 	),
		// },
		// {
		// 	type: 'actions',
		// 	icon: (
		// 		<div className="right-tab-item" style={{ width: 50, textAlign: 'center' }}>
		// 			事件
		// 		</div>
		// 	),
		// },
	],
	initFunctionMap: functionMap,
	initCommandModule: commandModules,
	initFormComponents: Formmodules,
};

export default defaultConfig;
