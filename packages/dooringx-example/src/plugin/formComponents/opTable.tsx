
import { useMemo, memo, useState, useEffect } from 'react';
import { Row, Col, Transfer, Select, Switch, InputNumber, Input } from 'antd';
import type { TransferDirection } from 'antd/es/transfer';
import { UserConfig, deepCopy } from 'dooringx-lib';
import { FormMap } from '../formTypes';
import { CreateOptionsRes } from 'dooringx-lib/dist/core/components/formTypes';
import { IBlockType } from 'dooringx-lib/dist/core/store/storetype';
import { updateFormBlockData } from '../helper/update';
import { forkCountArray } from '../helper/utils';
import { createTableByRowAndCol, ICell, ISingleRow, syncTableData, IModifyType, updateTableAfterModify } from '../helper/table';
import type { SpanType } from '../helper/table';

interface MBorderProps {
	data: CreateOptionsRes<FormMap, 'opTable'>;
	current: IBlockType;
	config: UserConfig;
}

interface TableFieldType {
	key:string;
	label:string;
}

const MBorder = (props: MBorderProps) => {
	const option = useMemo(() => {
		return props.data?.option || {};
	}, [props.data]);

	const curBlock = props.current;
	
	const [tblType, setTblType] = useState<string>(curBlock.props[(option as any).field[0]]);
	const [showHeader, setShowHeader] = useState<boolean>(curBlock.props[(option as any).field[2]]);
	const [rowCount, setRowCount] = useState<number>(curBlock.props[(option as any).field[3]]);
	const [colCount, setColCount] = useState<number>(
		curBlock.props[(option as any).field[2]] ? curBlock.props[(option as any).field[1]].length : curBlock.props[(option as any).field[4]]
	);
	
	const [rowNo, setRowNo] = useState<number>(0);
	const [colNo, setColNo] = useState<number>(0);
	const [rows, setRows] = useState<Array<ISingleRow>>([]);
	
	const [targetKeys, setTargetKeys] = useState<Array<string>>(curBlock.props[(option as any).field[1]]);
	const [selectedKeys, setSelectedKeys] = useState<Array<string>>([]);
	// 当前选中table cell的默认值
	const [spanRow, setSpanRow] = useState<number|undefined>();
	const [spanCol, setSpanCol] = useState<number|undefined>();
	const [vlabel, setVlabel] = useState<string>();
	const store = props.config.getStore();
	const listTable = [
		{
			value:'tblRecord', label:'记录表',
			sub: [
				{ key:'RECORD-F001', label:'RECORD-field1'},
				{ key:'RECORD-F002', label:'RECORD-field2'},
				{ key:'RECORD-F003', label:'RECORD-field3'},
				{ key:'RECORD-F004', label:'RECORD-field4'},
				{ key:'RECORD-F005', label:'RECORD-field5'},
				{ key:'RECORD-F006', label:'RECORD-field6'},
				{ key:'RECORD-F007', label:'RECORD-field7'},
			]
		},
		{
			value:'tblReport', label:'报告表',
			sub: [
				{ key:'REPORT-F001', label:'REPORT-field1'},
				{ key:'REPORT-F002', label:'REPORT-field2'},
				{ key:'REPORT-F003', label:'REPORT-field3'},
				{ key:'REPORT-F004', label:'REPORT-field4'},
				{ key:'REPORT-F005', label:'REPORT-field5'},
				{ key:'REPORT-F006', label:'REPORT-field6'},
				{ key:'REPORT-F007', label:'REPORT-field7'},
				{ key:'REPORT-F008', label:'REPORT-field8'},
				{ key:'REPORT-F009', label:'REPORT-field9'},
				{ key:'REPORT-F0010', label:'REPORT-field10'},
			]
		},
	]
	const [datasource, setDatasource] = useState<Array<TableFieldType>>(()=>{
		let res:Array<TableFieldType> = [];
		let tmp = listTable.filter(e=>e.value==curBlock.props[(option as any).field[0]])
		if (tmp.length > 0) res = tmp[0].sub as Array<TableFieldType>;
		return res;
	});
	const handleChange = (newTargetKeys: string[], direction: TransferDirection, moveKeys: string[]) => {
		if (direction === 'right') {
			let tmp = [...targetKeys, ...moveKeys];
			setTargetKeys(tmp);		
			let tmp2 = (tmp as Array<string>).map((e:string,i:number)=>({row:i, col:0,label:e} as ICell));
			updateFormBlockData(store, props, (v) => v.props[(option as any).field[1]] = tmp2);
		} else if (direction === 'left') {
			setTargetKeys(newTargetKeys);
		}
		updateTableRowData(0, newTargetKeys.length)
	}
	const handleSelectChange = (sourceSelectedKeys: string[], targetSelectedKeys: string[]) => {
		// setSelectedKeys([...targetSelectedKeys, ...sourceSelectedKeys]);
		setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
	};
	// 数据更新 
	function updateTableRowData(updateCode:number, target:number) {
		if (updateCode === 0 || updateCode === 1) {
			setColCount(target as number)
			let rowData = createTableByRowAndCol(target as number, rowCount, curBlock.props[(option as any).field[6]]);		
			syncTableData(rows, rowData);
			setRows(rowData);
			updateFormBlockData(store, props, (v) => v.props[(option as any).field[5]] = rowData);
		}
	}
	function updateSpanInfo(target:IModifyType) {
		let arr:Array<IModifyType> = curBlock.props[(option as any).field[6]];
		let isFind = false;
		for (let i = 0; i < arr.length; i++) {
			const {row, col, type } = arr[i];
			if (row == target.row && col == target.col && type == target.type) {
				arr[i].value = target.value;
				isFind = true;
			}
		}
		if (isFind === false) {
			arr.push(target);
		}
		updateFormBlockData(store, props, (v) => v.props[(option as any).field[6]] = arr);
	}
	// 更新
	function updateRowColNumber(isRow:boolean, val:number) {		
		if (isRow) {
			setRowNo(val)
		} else {
			setColNo(val);
		}
		let tbl:Array<ISingleRow> = curBlock.props[(option as any).field[5]];
		let t2:Array<ICell> = [];
		tbl.forEach(e=>t2.push(...e.cells));
		let t3 = t2.filter(e=>e.row === rowNo && e.col === colNo)[0]
		if (t3) {
			setVlabel(t3.label);
			setSpanRow(t3.rspan);
			setSpanCol(t3.cspan);
		}
	}
	function updateChangeSpan(type:SpanType, v:number|string) {
		const target:IModifyType = {
			col: colNo,
			row: rowNo,
			type: type,
			value: v,
		}
		const rowData = deepCopy(rows);
		updateSpanInfo(target as IModifyType);
		updateTableAfterModify(rowData, target as IModifyType);
		setRows(rowData);
		updateFormBlockData(store, props, (v) => v.props[(option as any).field[5]] = rowData);
	}

	return (
		<div>
			<Row style={{ padding: '10px' }}>
				<Col span={6} style={{ lineHeight: '30px' }}>
					{(option as any)?.label || '样式'}：
				</Col>
				<Col span={5} style={{ lineHeight: '30px' }}>
					<Switch checkedChildren={'显示头'} unCheckedChildren={'关闭头'} defaultChecked={showHeader} onChange={(val) => {
						setShowHeader(val);
						updateFormBlockData(store, props, (v) => v.props[(option as any).field[2]] = val);
					}} />
				</Col>
				<Col span={7} title={'行数'} style={{ lineHeight: '30px' }}>
					{ showHeader ? <Select defaultValue={tblType} disabled={!showHeader} onChange={(val, opt:any) => {
							setTblType(val);
							setDatasource(opt.sub)
							updateFormBlockData(store, props, (v) => v.props[(option as any).field[0]] = val);
						}} options={listTable} />
						: <InputNumber defaultValue={colCount} min={1} onChange={(val)=>{
							setColCount(val);
							updateFormBlockData(store, props, (v) => v.props[(option as any).field[4]] = val);
							updateTableRowData(0);
						}} />
					}
				</Col>
				<Col span={6} title={'列数'} style={{ lineHeight: '30px' }}>
					<InputNumber defaultValue={rowCount} min={1} onChange={(val)=>{
						setRowCount(val);
						updateFormBlockData(store, props, (v) => v.props[(option as any).field[3]] = val);						
						updateTableRowData(1);
					}} />
				</Col>
			</Row>
			{
				showHeader ? 
				<Row style={{padding:'5px'}}>
					<Col span={24} style={{ lineHeight: '30px' }}>
						<Transfer titles={['Source', 'Target']}
							dataSource={datasource} targetKeys={targetKeys} selectedKeys={selectedKeys}
							onChange={handleChange} onSelectChange={handleSelectChange}
							render={(item) => item.label}
							oneWay
						/>
					</Col>
				</Row>
				: <></>
			}
			<Row style={{padding:'5px'}}>
				<Col span={6} style={{ lineHeight: '30px' }}>
					{(option as any)?.label2 || '修改'}：
				</Col>
				<Col span={4} title={'行号'} style={{ lineHeight: '30px' }}>
					<Select onChange={(v:number)=>updateRowColNumber(false,v)} options={forkCountArray(colCount).map((e, i) => ({
						value: i,
						label: i+1,
					}))}></Select>
				</Col>
				<Col span={4} title={'列号'} style={{ lineHeight: '30px' }}>
					<Select onChange={(v:number)=>updateRowColNumber(true, v)} options={forkCountArray(rowCount).map((e, i) => ({
						value: i,
						label: i+1,
					}))}></Select>
				</Col>
				<Col span={10} title={'内容'} style={{ lineHeight: '30px' }}>
					<Input value={vlabel} onChange={(e)=>{
						updateChangeSpan('label', e.target.value);
					}}/>
				</Col>
				<Col span={7} title={'合并列'} style={{ lineHeight: '30px' }}>
					<InputNumber min={1} max={colCount} value={spanCol} onChange={(e)=>{
						updateChangeSpan('colSpan', e);
					}}/>
				</Col>
				<Col span={7} title={'合并行'} style={{ lineHeight: '30px' }}>
					<InputNumber min={1} max={rowCount} value={spanRow} onChange={(e)=>{
						updateChangeSpan('rowSpan', e);
					}}/>
				</Col>
			</Row>
		</div>
	);
};

export default memo(MBorder);
