
import { useMemo, memo, useState, useEffect, useRef } from 'react';
import { Row, Col, Transfer, Select, Switch, InputNumber, Input } from 'antd';
import type { TransferDirection } from 'antd/es/transfer';
import { UserConfig, deepCopy } from 'dooringx-lib';
import { FormMap } from '../formTypes';
import { CreateOptionsRes } from 'dooringx-lib/dist/core/components/formTypes';
import { IBlockType } from 'dooringx-lib/dist/core/store/storetype';
import { updateFormBlockData } from '../helper/update';
import { forkCountArray } from '../helper/utils';
import { createTableByRowAndCol, ICell, ISingleRow, syncTableData, ISpanType, updateTableAfterModify, updateTableCell } from '../helper/table';
import { getTemplateTableColumnData } from '@/pages/data/template';

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
	const [tblColumns, setTblColumns] = useState<Array<any>>([]);
	// 初始化，第一次执行
	useEffect(() => {
		getTemplateTableColumnData().then((res) => {
			setTblColumns(res as Array<any>);
		})
	}, []);

	// 后台返回的数据
	const [datasource, setDatasource] = useState<Array<TableFieldType>>(()=> updateDataSource(curBlock.props[(option as any).field[0]]));
	useEffect(() => {
		updateFormBlockData(store, props, (v) => v.props[(option as any).field[0]] = tblType);
		setDatasource(updateDataSource(tblType))
	}, [tblType])
	function updateDataSource(type:string|undefined) {
		let res:Array<TableFieldType> = [];
		if (type) {
			let tmp = tblColumns.filter(e=>e.value==type)
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
		recreateTableData(colCount, rowCount, rows);
	}, [rowCount, colCount])

	// 再次选中时重构表格
	function recreateTableData(c:number, r:number, table:Array<ISingleRow>) {
		let newTable = createTableByRowAndCol(c, r, curBlock.props[(option as any).field[6]]);		
		syncTableData(table, newTable);
		updateFormBlockData(store, props, (v) => v.props[(option as any).field[5]] = newTable);
		setRows(newTable);
	}
		
	// table的数据
	const [rows, setRows] = useState<Array<ISingleRow>>(curBlock.props[(option as any).field[5]]);
	
	// 变数据
	const refSpanRow = useRef<number|undefined>();
	const refSpanCol = useRef<number|undefined>();
	// 选中的行和列编号
	const [rowNo, setRowNo] = useState<number|undefined>();
	const [colNo, setColNo] = useState<number|undefined>();
	useEffect(() => {
		setTextAlign('');
		setTextVisibility('');
		setCellWidth(undefined);
		setCellHeight(undefined);
		// 当前选中有效值后进行更新
		if (rowNo !== undefined && colNo !== undefined) {
			let tbl:Array<ISingleRow> = curBlock.props[(option as any).field[5]];
			let t2:Array<ICell> = [];
			tbl.forEach(e=>t2.push(...e.cells));
			let t3 = t2.filter(e=>e.row === rowNo && e.col === colNo)[0]
			if (t3) {
				refSpanCol.current = t3.cspan;
				refSpanRow.current = t3.rspan;
				setTextContent(t3.label);
				if (t3.style) {
					if (t3.style['textAlign']) setTextAlign(t3.style['textAlign']);					
					if (t3.style['visibility']) setTextVisibility(t3.style['visibility']);
				}
			}
		}
	}, [rowNo, colNo])
	const validRowCol = () => rowNo !== undefined && colNo !== undefined;

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
		setColCount(newTargetKeys.length);
	}
	const handleSelectChange = (sourceSelectedKeys: string[], targetSelectedKeys: string[]) => {
		// setSelectedKeys([...targetSelectedKeys, ...sourceSelectedKeys]);
		setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
	};
	
	// 扩展行和列的数字
	const [spanRow, setSpanRow] = useState<number>(0);
	useEffect(() => {
		if (validRowCol() && spanRow > 1) {
			refSpanRow.current = spanRow;		
			const target:ISpanType = { col: colNo as number, row: rowNo as number, type: 'rowSpan', value: spanRow };
			updateTableData((e:Array<ISingleRow>)=>{
				updateSpanInfo(target);
				updateTableAfterModify(e, target);
			})
		}
	}, [spanRow])
	const [spanCol, setSpanCol] = useState<number>(0);
	useEffect(() => {		
		if (validRowCol() && spanCol > 1) {
			refSpanCol.current = spanCol;
			const target:ISpanType = { col: colNo as number, row: rowNo as number, type: 'colSpan', value: spanCol };
			updateTableData((e:Array<ISingleRow>)=>{
				updateSpanInfo(target);
				updateTableAfterModify(e, target);
			})
		}
	}, [spanCol])
	
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
		if (textContent.length > 0 && validRowCol()) {
			updateTableData((e:Array<ISingleRow>) => {
				updateTableCell(e, { row: rowNo as number, col: colNo as number, type: 'textContent', value: textContent });
			});
		}
	}, [textContent]);

	const TextAlignOption = [
		{ value:'left', label:'左对齐'},
		{ value:'center', label:'居中'},
		{ value:'right', label:'右对齐'},
	]
	const [textAlign, setTextAlign] = useState<string>(''); // 对齐
	useEffect(() => {
		if (textAlign.length > 0 && validRowCol()) {
			updateTableData((e:Array<ISingleRow>) => {
				updateTableCell(e, { row: rowNo as number, col: colNo as number, type: 'textAlign', value: textAlign });
			});
		}
	}, [textAlign]);

	const TextVisibility = [
		{ value:'visible', label:'可见'},
		{ value:'hidden', label:'隐藏'},
	]
	const [textVisibility, setTextVisibility] = useState<string>('');
	useEffect(() => {
		if (textVisibility.length > 0 && validRowCol()) {
			updateTableData((e:Array<ISingleRow>) => {
				updateTableCell(e, { row: rowNo as number, col: colNo as number, type: 'visibility', value: textVisibility });
			});
		}
	}, [textVisibility]);
	
	const [cellWidth, setCellWidth] = useState<number|undefined>();
	useEffect(() => {
		if (cellWidth !== undefined && validRowCol()) {
			updateTableData((e:Array<ISingleRow>) => {
				updateTableCell(e, { row: rowNo as number, col: colNo as number, type: 'width', value: `${cellWidth}px` });
			});
		}
	}, [cellWidth]);
	const [cellHeight, setCellHeight] = useState<number|undefined>();
	useEffect(() => {
		if (cellHeight !== undefined && validRowCol() ) {
			updateTableData((e:Array<ISingleRow>) => {
				updateTableCell(e, { row: rowNo as number, col: colNo as number, type: 'height', value: `${cellHeight}px` });
			});
		}
	}, [cellHeight]);
	

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
					{ showHeader ? <Select value={tblType} disabled={!showHeader} onChange={(e) => setTblType(e)} options={tblColumns} />
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
				<Col span={8}>
					<InputNumber min={1} max={colCount} value={refSpanCol.current} onChange={(e) => setSpanCol(e)}/>
				</Col>
				<Col span={4}>{'合并行'}</Col>
				<Col span={8}>
					<InputNumber min={1} max={rowCount} value={refSpanRow.current} onChange={(e) => setSpanRow(e)}/>
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
			<Row>
				<Col span={4}>{'宽度'}</Col>
				<Col span={8}>
					<InputNumber min={1} value={cellWidth} onChange={(e) => setCellWidth(e)}/>
				</Col>
				<Col span={4}>{'高度'}</Col>
				<Col span={8}>
				<InputNumber min={1} value={cellHeight} onChange={(e) => setCellHeight(e)}/>
				</Col>
			</Row>
		</div>
	);
};

export default memo(MBorder);
