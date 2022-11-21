import { useState } from 'react';
import { ComponentRenderConfigProps } from '../../../../dooringx-lib/dist/core/components/componentItem';
import { ComponentItemFactory, createPannelOptions } from 'dooringx-lib';
import { FormMap } from '../formTypes';


function ShapeLineComponent(props: ComponentRenderConfigProps) {
	const data = props.data;
	const [color, setColor] = useState('black');
	return (
		<div
			style={{
				display: 'inline-block',
				zIndex: data.zIndex,
				width: data.width,
				height: data.height,
				overflow: 'hidden',
				border:'1px solid',
				borderColor: color,
				position: 'absolute',
				top: '0',
			}}
		>
		</div>
	);
}

const DShapeLine = new ComponentItemFactory(
	'shapeLine', // component-id
	'直线', // label literal
	{ // right-part option style
		style: [
			createPannelOptions<FormMap, 'elPosition'>('elPosition', {
				label:'位置'
			}),
			createPannelOptions<FormMap, 'elSize'>('elSize', {
				label: '大小'
			}),
		],
	},
	{ // initial option value
		width: 200,
		height: 1,
		zIndex: 1,
	},
	(data, context, store, config) => {
	return <ShapeLineComponent data={data} context={context} store={store} config={config}></ShapeLineComponent>;
	},	
	true,
);
export default DShapeLine;