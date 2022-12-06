import { useState, useEffect } from 'react';
import { createPannelOptions, createComponent } from 'dooringx-lib';
import { FormMap } from '../formTypes';
import { ComponentRenderConfigProps } from 'dooringx-lib/dist/core/components/componentItem';
import { colorToString } from '../helper/utils';


function InputTtextComponent(pr: ComponentRenderConfigProps) {
	const props = pr.data.props;
	const [color, setColor] = useState(props.color);
	useEffect(()=>setColor(colorToString(props.color)), [props.color]);
	
	const [size, setSize] = useState(props.fontSize);
	useEffect(()=>setSize(props.fontSize), [props.fontSize]);
	
	const [weight, setWeight] = useState<any>();
	const [style, setStyle] = useState<any>();
	const [decoration, setDecoration] = useState<any>();
	
	useEffect(()=>{
		if (Array.isArray(props.styles)) {
			setWeight(props.styles.includes('bold')?'bold':'normal');
			setStyle(props.styles.includes('italic')?'italic':'normal');
			setDecoration(props.styles.includes('underline')?'underline':'none');
		}
	}, [props.styles]);
	
	return (
		<div style={{display:'flex',flexDirection:'row', width:props.width, height:props.height}}>
			<div style={{
				color:color,
				fontSize:size,
				fontWeight:weight,
				fontStyle:style,
				textDecoration:decoration,
				margin:'auto 0',
			}}>
				{props.title}
			</div>
		</div>
	);
}

const DTitle = createComponent({
	name: 'title', // component-id
	display: 'Numbertitle1', // label literal
	props: { // right-part option style
		style: [
			createPannelOptions<FormMap, 'opTitle'>('opTitle', {
				label: '编号',
				field: ['title'],
			}),
			createPannelOptions<FormMap, 'elPosition'>('elPosition', {
				label:'位置'
			}),
			createPannelOptions<FormMap, 'elSize'>('elSize', {
				label: '大小'
			}),
			createPannelOptions<FormMap, 'font'>('font', {
				label: '字号',
				color: 'rgba(0,0,0,1)',
				fontSize:14,
				styles:[],
				field: ['fontSize','color','styles'],
			}),
		],
	},
	initData: { // initial option value
		props: {
			title: '',
			color: 'rgba(0,0,0,1)',
			fontSize: 18,
			styles: [],
		},
		width: 200,
		height: 55,
	},
	render: (data, context, store, config) => {
		return <InputTtextComponent data={data} context={context} store={store} config={config}></InputTtextComponent>;
	},	
	resize: true,
});
export default DTitle;