import { ComponentItemFactory, createPannelOptions } from 'dooringx-lib';
import { Input } from 'antd';
import { FormMap } from '../formTypes';
import { ComponentRenderConfigProps } from '../../../../dooringx-lib/dist/core/components/componentItem';


function InputTtextComponent(pr: ComponentRenderConfigProps) {
	const props = pr.data.props;
	return (
		<div>{props.text}</div>
	);
}

const DInputText = new ComponentItemFactory(
	'inputText', // component-id
	'文本', // label literal
	{ // right-part option style
		style: [
			createPannelOptions<FormMap, 'input'>('input', {
				receive: 'text',
				label: '内容',
			}),
			createPannelOptions<FormMap, 'elPosition'>('elPosition', {
				label:'位置'
			}),
			createPannelOptions<FormMap, 'elSize'>('elSize', {
				label: '大小'
			}),
		],
	},
	{ // initial option value
		props: {
			text: '文本',
		},
		width: 200,
		height: 55,
	},
	(data, context, store, config) => {
	return <InputTtextComponent data={data} context={context} store={store} config={config}></InputTtextComponent>;
	},	
	true,
);
export default DInputText;