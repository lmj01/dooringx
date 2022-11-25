import { useState, useEffect } from 'react';
import { createPannelOptions, createComponent } from 'dooringx-lib';
import { FormMap } from '../formTypes';
import { ComponentRenderConfigProps } from 'dooringx-lib/dist/core/components/componentItem';
import { colorToString } from '../helper/utils';


function InputTtextComponent(pr: ComponentRenderConfigProps) {
	const props = pr.data.props;
	const [color, setColor] = useState(props.color);
	useEffect(()=>setColor(colorToString(props.color)), [props.color]);
	const [color2, setColor2] = useState(props.color2);
	useEffect(()=>setColor2(colorToString(props.color2)), [props.color2]);
	
	const [size, setSize] = useState(props.fontSize);
	useEffect(()=>setSize(props.fontSize), [props.fontSize]);
	const [size2, setSize2] = useState(props.fontSize2);
	useEffect(()=>setSize2(props.fontSize2), [props.fontSize2]);

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
	const [weight2, setWeight2] = useState<any>();
	const [style2, setStyle2] = useState<any>();
	const [decoration2, setDecoration2] = useState<any>();	
	useEffect(()=>{
		if (Array.isArray(props.styles2)) {
			setWeight2(props.styles2.includes('bold')?'bold':'normal');
			setStyle2(props.styles2.includes('italic')?'italic':'normal');
			setDecoration2(props.styles2.includes('underline')?'underline':'none');
		}
	}, [props.styles2]);
	
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
				{props.title1}:
			</div>
			<div style={{
				color:color2,
				fontSize:size2,
				fontWeight:weight2,
				fontStyle:style2,
				textDecoration:decoration2,
				margin:'auto 0',
			}}>
				{props.title2}
			</div>
		</div>
	);
}

const DTitle1 = createComponent({
	name: 'title1', // component-id
	display: 'Numbertitle1', // label literal
	props: { // right-part option style
		style: [
			createPannelOptions<FormMap, 'opTitle'>('opTitle', {
				label: '编号',
				field: ['title1','title2'],
			}),
			createPannelOptions<FormMap, 'elPosition'>('elPosition', {
				label:'位置'
			}),
			createPannelOptions<FormMap, 'elSize'>('elSize', {
				label: '大小'
			}),
			createPannelOptions<FormMap, 'font'>('font', {
				label: '字号1',
				color: 'rgba(0,0,0,1)',
				fontSize:14,
				styles:[],
				field: ['fontSize','color','styles'],
			}),
			createPannelOptions<FormMap, 'font'>('font', {
				label: '字号2',
				color: 'rgba(0,0,0,1)',
				fontSize:18,
				styles:[],
				field: ['fontSize2','color2','styles2'],
			}),
		],
	},
	initData: { // initial option value
		props: {
			title1: '',
			title2: '',
			color: 'rgba(0,0,0,1)',
			color2: 'rgba(0,0,0,1)',
			fontSize: 14,
			fontSize2: 18,
			styles: [],
			styles2: [],
		},
		width: 200,
		height: 55,
	},
	render: (data, context, store, config) => {
		return <InputTtextComponent data={data} context={context} store={store} config={config}></InputTtextComponent>;
	},	
	resize: true,
});
export default DTitle1;