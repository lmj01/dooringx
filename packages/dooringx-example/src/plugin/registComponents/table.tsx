import { useEffect, useMemo, useState } from 'react';
import {
	createComponent,
	createPannelOptions,
} from 'dooringx-lib';
import { FormMap } from '../formTypes';
import { ComponentRenderConfigProps } from 'dooringx-lib/dist/core/components/componentItem';

function TableColumn({columns}:{columns:Array<string>}) {
	return (
		<thead>
			<tr>
				{columns.map((col,index)=>{
					return <th key={index}>{col}</th>
				})}
			</tr>
		</thead>
	)
}
function TableFooter({footers}:{footers:Array<string>}) {
	return (
		<footer>
			<tr>
				{footers.map((footer, index)=>{
					return <th key={index}>{footer}</th>
				})}
			</tr>
		</footer>
	)
}
function TableSingleRow({rowData}:{rowData:Array<string>}) {
	return (
		<tr>
			{rowData.map((row, index)=>{
				return <td key={index}>{row}</td>
			})}
		</tr>
	)
}
function TableRows({rows}:{rows:Array<Array<string>>}) {
	return (
		<tbody>
			{rows.map((row,index)=>{
				return <TableSingleRow key={index} rowData={row} />
			})}
		</tbody>
	)
}
function TableComponent(pr: ComponentRenderConfigProps) {
	const props = pr.data.props;	
	const [columns, setColumns] = useState(['col1','col2']);
	useEffect(()=> setColumns(props.tableColumn), [props.tableColumn]);

	const [footers, setFooters] = useState(['footer1','footer2']);
	const [rows, setRows] = useState([
		['row1a','row1b'],
		['row2a','row2b'],
	]);
	return (
		<table style={{
			width: pr.data.width ? pr.data.width : props.sizeData[0],
			height: pr.data.height ? pr.data.height : props.sizeData[1],
		}}>
			<TableColumn columns={columns} />
			<TableRows rows={rows} />
			{/* <TableFooter footers={footers} /> */}
      </table>
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
			createPannelOptions<FormMap, 'opTable'>('opTable', {
				label: '表格',
				field:['tableType','tableColumn']
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
			tableType: '',
			tableColumn: [],
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
