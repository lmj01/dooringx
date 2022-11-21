import { ComponentItemFactory } from 'dooringx-lib';
import { Input } from 'antd';
import { ComponentRenderConfigProps } from 'dooringx-lib/dist/core/components/componentItem';


function ShapeLineComponent(props: ComponentRenderConfigProps) {
  return (
    <Input />
  );
}

const DShapeLine = new ComponentItemFactory(
	'shapeLine', // component-id
	'直线', // label literal
	{ // right-part option style
	},
	{ // initial option value
		width: 200,
		height: 55,
	},
	(data, context, store, config) => {
	return <ShapeLineComponent data={data} context={context} store={store} config={config}></ShapeLineComponent>;
	},	
	true,
);
export default DShapeLine;