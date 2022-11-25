import { useEffect, useMemo, useState } from 'react';
import { createComponent, createPannelOptions, deepCopy } from 'dooringx-lib';
import { FormMap } from '../formTypes';
import { ComponentRenderConfigProps } from 'dooringx-lib/dist/core/components/componentItem';
import { ICell, IGridRow, ISingleRow, ITableColumn } from '../helper/table';
import { forkCountArray } from '../helper/utils';
import { updateRegistBlockData } from '../helper/update';

function TableColumn({columns, showHeader}:ITableColumn) {
	if (showHeader) {
		return (
			<thead>
				<tr>
					{columns.map((col,index)=>{
						return <th key={index}>{col.label}</th>
					})}
				</tr>
			</thead>
		)
	}
	return null;
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
function TableSingleRow({cells}:ISingleRow) {
	return (
		<tr>
			{cells.map((row, index)=>{
				return <td key={index}>{row.label}</td>
			})}
		</tr>
	)
}
function TableRows({rows}:IGridRow) {
	return (
		<tbody>
			{rows.map((row,index)=>{
				return <TableSingleRow key={index} cells={row.cells} />
			})}
		</tbody>
	)
}
function TableComponent(pr: ComponentRenderConfigProps) {
	const props = pr.data.props;	

	const [columns, setColumns] = useState<Array<ICell>>([]);
	useEffect(()=> {
		const tmp = props.tableColumn.map((e:string,i:number)=>({x:i,y:0,label:e} as ICell));
		setColumns(tmp)
		updateColumnAndRow();
	}, [props.tableColumn]);

	useEffect(()=>{
		updateColumnAndRow();
	}, [props.tableRowCount, props.tableColCount]);

	
	const [ccount, setCcount] = useState<number>(0);
	const [header, setHeader] = useState(props.tableShowHeader);
	useEffect(()=> {
		setHeader(props.tableShowHeader)
		updateColumnAndRow();
	}, [props.tableShowHeader]);

	// const [footers, setFooters] = useState(['footer1','footer2']);
	const [rows, setRows] = useState<Array<ISingleRow>>([]);

	function updateColumnAndRow() {
		let c1 = props.tableRowCount;
		let c2 = props.tableShowHeader ? props.tableColumn.length : props.tableColCount;
		setCcount(c2);
		const arrRow = forkCountArray(c1);
		const arrCol = forkCountArray(c2);
		let tmp:Array<ISingleRow> = [];
		arrRow.map((r,ir) => {			
			let tmpRow:Array<ICell> = [];
			arrCol.map((c,ic)=>{
				tmpRow.push({x:ir,y:ic,label:`${ir}-${ic}`});
			})
			tmp.push({cells:tmpRow});
		})
		console.log('-232', c1, c2, tmp)
		saveTableData(tmp, true);
	}
	function saveTableData(tmp:Array<ISingleRow>, changeSize:boolean) {
		if (changeSize) {
			for (let i = 0; i < rows.length; i++) {
				let rowCells = rows[i].cells;
				for (let j = 0; j < rowCells.length; j++) {
					const {x, y, label} = rowCells[j];
					console.log('--', x, y, label)
					if (i < tmp.length && j < tmp[i].cells.length) {
						tmp[i].cells[j].label = label;
					}
				}
			}
		}
		setRows(tmp);
		props.tableRow = tmp;
		updateRegistBlockData(pr);
	}

	useEffect(() => {
		const {x, y, label} = props.tableCell;
		if (rows.length > 0 && y !== undefined && x !== undefined) {
			const rowData = deepCopy(rows);
			rowData[x].cells[y].label = label;
			saveTableData(rowData, false);
			props.tableCell = {};
		}
	}, [props.tableCell])

	return (
		<table className={'mj-table'} style={{
			width: pr.data.width ? pr.data.width : props.sizeData[0],
			height: pr.data.height ? pr.data.height : props.sizeData[1],
		}}>
			<colgroup span={ccount}></colgroup>
			<TableColumn columns={columns} showHeader={header} />
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
				field:['tableType','tableColumn','tableShowHeader','tableRowCount','tableColCount','tableRow','tableCell']
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
			tableShowHeader:true,
			tableRow: [],
			tableRowCount: 3,
			tableColCount: 3,
			tableCell: {},
		},
		width: 200,
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
