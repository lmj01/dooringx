import { ComponentItemFactory } from 'dooringx-lib';
import { Table } from 'antd';
import { ComponentRenderConfigProps } from '../../../../dooringx-lib/dist/core/components/componentItem';


function TableComponent(props: ComponentRenderConfigProps) {
  return (
    <Table />
  );
}

const DTable = new ComponentItemFactory(
  'table', // component-id
  '文本', // label literal
  { // right-part option style
  },
  { // initial option value
    props: {

    },
    width: 200,
    height: 55,
  },
  (data, context, store, config) => {
		return <TableComponent data={data} context={context} store={store} config={config}></TableComponent>;
	},	
  true,
);
export default DTable;