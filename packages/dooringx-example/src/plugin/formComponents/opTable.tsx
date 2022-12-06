
import { useMemo, memo, useState, useEffect } from 'react';
import { Row, Col, Transfer, Select, Switch, InputNumber, Input } from 'antd';
import type { TransferDirection } from 'antd/es/transfer';
import { UserConfig, deepCopy } from 'dooringx-lib';
import { FormMap } from '../formTypes';
import { CreateOptionsRes } from 'dooringx-lib/dist/core/components/formTypes';
import { IBlockType } from 'dooringx-lib/dist/core/store/storetype';
import { updateFormBlockData } from '../helper/update';
import { forkCountArray } from '../helper/utils';
import { createTableByRowAndCol, ICell, ISingleRow, syncTableData, ISpanType, updateTableAfterModify, updateTableCell, IStyleType } from '../helper/table';
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
	
	const [tblType, setTblType] = useState<string|undefined>(curBlock.props[(option as any).field[0]]);
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

	// 后台返回的数据
	const [datasource, setDatasource] = useState<Array<TableFieldType>>(()=> updateDataSource(curBlock.props[(option as any).field[0]]));
	useEffect(() => {
		updateFormBlockData(store, props, (v) => v.props[(option as any).field[0]] = tblType);
		setDatasource(updateDataSource(tblType))
	}, [tblType])
	function updateDataSource(type:string|undefined) {
		let res:Array<TableFieldType> = [];
		if (type) {
			let tmp = listTable.filter(e=>e.value==type)
			if (tmp.length > 0) res = tmp[0].sub as Array<TableFieldType>;
		}
		return res;
	}
	
	const [showHeader, setShowHeader] = useState<boolean>(curBlock.props[(option as any).field[2]]);
	useEffect(() => {
		updateFormBlockData(store, props, (v) => v.props[(option as any).field[2]] = showHeader);
	}, [showHeader])

	const [rowCount, setRowCount] = useState<number>(curBlock.props[(option as any).field[3]]);
	const [colCount, setColCount] = useState<number>(
		curBlock.props[(option as any).field[2]] ? curBlock.props[(option as any).field[1]].length : curBlock.props[(option as any).field[4]]
	);
	useEffect(() => {
		// 存储tableRowCount
		updateFormBlockData(store, props, (v) => v.props[(option as any).field[3]] = rowCount);
		// 存储tableColCount
		updateFormBlockData(store, props, (v) => v.props[(option as any).field[4]] = colCount);
		let rowData = createTableByRowAndCol(colCount, rowCount, curBlock.props[(option as any).field[6]]);		
		syncTableData(rows, rowData);
		updateFormBlockData(store, props, (v) => v.props[(option as any).field[5]] = rowData);		
		setRows(rowData);
	}, [rowCount, colCount])
		
	// table的数据
	const [rows, setRows] = useState<Array<ISingleRow>>(curBlock.props[(option as any).field[5]]);
	
	// 选中的行和列编号
	const [rowNo, setRowNo] = useState<number|undefined>();
	const [colNo, setColNo] = useState<number|undefined>();
	useEffect(() => {
		// 当前选中有效值后进行更新
		if (rowNo !== undefined && colNo !== undefined) {
			let tbl:Array<ISingleRow> = curBlock.props[(option as any).field[5]];
			let t2:Array<ICell> = [];
			tbl.forEach(e=>t2.push(...e.cells));
			let t3 = t2.filter(e=>e.row === rowNo && e.col === colNo)[0]
			if (t3) {
				setSpanRow(t3.rspan);
				setSpanCol(t3.cspan);
				setTextContent(t3.label);
				if (t3.style) {
					if (t3.style['textAlign']) setTextAlign(t3.style['textAlign']);
					else setTextAlign('');
					
					if (t3.style['visibility']) setTextVisibility(t3.style['visibility']);
					else setTextVisibility('');
				}
			}
		}
	}, [rowNo, colNo])

	// 表头数据
	const [targetKeys, setTargetKeys] = useState<Array<string>>(
		curBlock.props[(option as any).field[1]].map((e:any)=>e.label) // 转换为key
	);
	const [selectedKeys, setSelectedKeys] = useState<Array<string>>([]);
	const handleChange = (newTargetKeys: string[], direction: TransferDirection, moveKeys: string[]) => {
		if (direction === 'right') {
			let tmp = [...targetKeys, ...moveKeys];
			setTargetKeys(tmp);
			let tmp2 = (tmp as Array<string>).map((e:string,i:number)=>({row:0, col:i,label:e}));
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
	
	// 扩展行和列的数字
	const [spanRow, setSpanRow] = useState<number|undefined>();
	const [spanCol, setSpanCol] = useState<number|undefined>();
	const [vtype, setVtype] = useState<SpanType>(); // 修改类型
	useEffect(() => {		
		if (colNo !== undefined && rowNo !== undefined && vtype !== undefined) {
			const target:ISpanType = {
				col: colNo,
				row: rowNo,
				type: vtype,
				value: vtype == 'colSpan' ? spanCol as number : spanRow as number,
			}
			updateTableData((e:Array<ISingleRow>)=>{
				if (vtype === 'colSpan' || vtype === 'rowSpan') {
					updateSpanInfo(target);
				}
				updateTableAfterModify(e, target);
			})
		}
	}, [spanRow, spanCol])
	
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
	function updateSpanInfo(target:ISpanType) {
		let arr:Array<ISpanType> = curBlock.props[(option as any).field[6]];
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

	// 数据
	const [textContent, setTextContent] = useState<string>(''); // 修改值
	useEffect(() => {
		updateTableData((e:Array<ISingleRow>) => {
			updateTableCell(e, {
				row: rowNo as number, col: colNo as number, type: 'textContent', value: textContent,
			});
		});
	}, [textContent]);

	const TextAlignOption = [
		{ value:'left', label:'左对齐'},
		{ value:'center', label:'居中'},
		{ value:'right', label:'右对齐'},
	]
	const [textAlign, setTextAlign] = useState<string>(''); // 对齐
	useEffect(() => {
		updateTableData((e:Array<ISingleRow>) => {
			updateTableCell(e, {
				row: rowNo as number, col: colNo as number, type: 'textAlign', value: textAlign,
			})
		});
	}, [textAlign]);

	const TextVisibility = [
		{ value:'visible', label:'可见'},
		{ value:'hidden', label:'隐藏'},
	]
	const [textVisibility, setTextVisibility] = useState<string>('');
	useEffect(() => {
		updateTableData((e:Array<ISingleRow>) => {
			updateTableCell(e, {
				row: rowNo as number, col: colNo as number, type: 'visibility', value: textVisibility,
			})
		});
	}, [textVisibility]);
	

	function updateTableData(cb:(e:Array<ISingleRow>)=>void) {
		const rowData = deepCopy(rows);
		cb(rowData);
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
					<Switch checkedChildren={'显示头'} unCheckedChildren={'关闭头'} checked={showHeader} onChange={e=>setShowHeader(e)} />
				</Col>
				<Col span={7} title={'行数'} style={{ lineHeight: '30px' }}>
					{ showHeader ? <Select value={tblType} disabled={!showHeader} onChange={(e) => setTblType(e)} options={listTable} />
						: <InputNumber value={colCount} min={1} onChange={(e)=>setColCount(e)} />
					}
				</Col>
				<Col span={6} title={'列数'} style={{ lineHeight: '30px' }}>
					<InputNumber value={rowCount} min={1} onChange={(e)=> setRowCount(e)} />
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
				<Col span={4}>{'修改'}：</Col>
				<Col span={2}>{'行号'}</Col>
				<Col span={4}>
					<Select value={rowNo} onSelect={(v) => setRowNo(v)} options={forkCountArray(rowCount).map((e, i) => ({
						value: i,
						label: i+1,
					}))}></Select>
				</Col>
				<Col span={2}>{'列号'}</Col>
				<Col span={4}>
					<Select value={colNo} onSelect={(v) => setColNo(v)} options={forkCountArray(colCount).map((e, i) => ({
						value: i,
						label: i+1,
					}))}></Select>
				</Col>
			</Row>
			<Row>
				<Col span={2}>{'内容'}</Col>
				<Col span={22}>
					<Input.TextArea value={textContent} onChange={(e) => setTextContent(e.target.value)} />
				</Col>
			</Row>
			<Row>
				<Col span={4}>{'合并列'}</Col>
				<Col span={7}>
					<InputNumber min={1} max={colCount} value={spanCol} onChange={(e) => { setVtype('rowSpan');setVlabel(e);setSpanCol(e); }}/>
				</Col>
				<Col span={4}>{'合并行'}</Col>
				<Col span={7}>
					<InputNumber min={1} max={rowCount} value={spanRow} onChange={(e) => {  setVtype('colSpan');setVlabel(e);setSpanRow(e); }}/>
				</Col>
			</Row>
			<Row>
				<Col span={4}>{'字体对齐'}</Col>
				<Col span={8}>
					<Select value={textAlign} onChange={(e) => setTextAlign(e)} options={TextAlignOption} />
				</Col>
				<Col span={4}>{'文字隐藏'}</Col>
				<Col span={8}>
					<Select value={textVisibility} onChange={(e) => setTextVisibility(e)} options={TextVisibility} />
				</Col>
			</Row>
		</div>
	);
};

export default memo(MBorder);
