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
				return <td colSpan={row.cspan} rowSpan={row.rspan} key={index}>{row.label}</td>
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
	return (
		<table className={'mj-table'} style={{
			width: pr.data.width ? pr.data.width : props.sizeData[0],
			height: pr.data.height ? pr.data.height : props.sizeData[1],
		}}>
			<colgroup span={props.tableColCount}></colgroup>
			<TableColumn columns={props.tableColumn} showHeader={props.tableShowHeader} />
			<TableRows rows={props.tableRow} />
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
				field:['tableType','tableColumn','tableShowHeader','tableRowCount','tableColCount','tableRow','tableSpanInfo']
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
			tableSpanInfo: [],			
			tableRowCount: 3,
			tableColCount: 0,
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
