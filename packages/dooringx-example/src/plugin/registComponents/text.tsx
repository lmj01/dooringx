import { ComponentItemFactory, createPannelOptions } from 'dooringx-lib';
import { Input } from 'antd';
import { ComponentRenderConfigProps } from '../../../../dooringx-lib/dist/core/components/componentItem';


function InputTtextComponent(props: ComponentRenderConfigProps) {
  return (
    <Input />
  );
}

const DInputText = new ComponentItemFactory(
	'inputText', // component-id
	'文本', // label literal
	{ // right-part option style
	},
	{ // initial option value
		width: 200,
		height: 55,
	},
	(data, context, store, config) => {
	return <InputTtextComponent data={data} context={context} store={store} config={config}></InputTtextComponent>;
	},	
	true,
);
export default DInputText;