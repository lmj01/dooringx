import { useState, useEffect } from 'react';
import { ComponentRenderConfigProps } from '../../../../dooringx-lib/dist/core/components/componentItem';
import { ComponentItemFactory, createPannelOptions } from 'dooringx-lib';
import { FormMap } from '../formTypes';
import { colorToString } from '../utils';


function ShapeLineComponent(pr: ComponentRenderConfigProps) {
	const data = pr.data;
	const props = data.props;
	const [color, setColor] = useState(props.borderColor);
	useEffect(()=>{
		setColor(colorToString(props.borderColor));
	}, [props.borderColor]);
	return (
		<div
			style={{
				display: 'inline-block',
				zIndex: data.zIndex,
				width: data.width,
				height: data.height,
				overflow: 'hidden',
				borderWidth: (data.height as number)/2,
				borderStyle: props.borderStyle,
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
			createPannelOptions<FormMap, 'elBorder'>('elBorder', {
				label: '样式',
				editWidth:false,
			}),
		],
	},
	{ // initial option value
		props: {
			borderColor: 'rgba(0,0,0,1)',
			borderStyle: 'solid',
		},
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