
import { useMemo, memo, useState } from 'react';
import { Row, Col, Transfer, Select, Switch, InputNumber } from 'antd';
import type { TransferDirection } from 'antd/es/transfer';
import { UserConfig } from 'dooringx-lib';
import { FormMap } from '../formTypes';
import { CreateOptionsRes } from 'dooringx-lib/dist/core/components/formTypes';
import { IBlockType } from 'dooringx-lib/dist/core/store/storetype';
import { updateBlockData } from '../helper/update';

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
	
	const [tblType, setTblType] = useState<string>(props.current.props[(option as any).field[0]]);
	const [showHeader, setShowHeader] = useState<boolean>(props.current.props[(option as any).field[2]]);
	const [rowCount, setRowCount] = useState<number>(props.current.props[(option as any).field[3]]);
	const [colCount, setColCount] = useState<number>(props.current.props[(option as any).field[4]]);

	const [targetKeys, setTargetKeys] = useState<Array<string>>(props.current.props[(option as any).field[1]]);
	const [selectedKeys, setSelectedKeys] = useState<Array<string>>([]);
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
		let tmp = listTable.filter(e=>e.value==props.current.props[(option as any).field[0]])
		if (tmp.length > 0) res = tmp[0].sub as Array<TableFieldType>;
		return res;
	});

	const handleChange = (newTargetKeys: string[], direction: TransferDirection, moveKeys: string[]) => {
		if (direction === 'right') {
			let tmp = [...targetKeys, ...moveKeys];
			setTargetKeys(tmp);		
			updateBlockData(store, props, (v) => v.props[(option as any).field[1]] = tmp);
		} else if (direction === 'left') {
			setTargetKeys(newTargetKeys);
		}
	}
	const handleSelectChange = (sourceSelectedKeys: string[], targetSelectedKeys: string[]) => {
		// setSelectedKeys([...targetSelectedKeys, ...sourceSelectedKeys]);
		setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
	};

	return (
		<div>
			<Row style={{ padding: '10px' }}>
				<Col span={6} style={{ lineHeight: '30px' }}>
					{(option as any)?.label || '样式'}：
				</Col>
				<Col span={5} style={{ lineHeight: '30px' }}>
					<Switch checkedChildren={'显示头'} unCheckedChildren={'关闭头'} defaultChecked={showHeader} onChange={(val) => {
						setShowHeader(val);
						updateBlockData(store, props, (v) => v.props[(option as any).field[2]] = val);
					}} />
				</Col>
				<Col span={7} title={'行数'} style={{ lineHeight: '30px' }}>
					{ showHeader ? <Select defaultValue={tblType} disabled={!showHeader} onChange={(val, opt:any) => {
							setTblType(val);
							setDatasource(opt.sub)
							updateBlockData(store, props, (v) => v.props[(option as any).field[0]] = val);
						}} options={listTable} />
						: <InputNumber defaultValue={colCount} min={1} onChange={(val)=>{
							setColCount(val);
							updateBlockData(store, props, (v) => v.props[(option as any).field[4]] = val);
						}} />
					}
				</Col>
				<Col span={6} title={'列数'} style={{ lineHeight: '30px' }}>
					<InputNumber defaultValue={rowCount} min={1} onChange={(val)=>{
						setRowCount(val);
						updateBlockData(store, props, (v) => v.props[(option as any).field[3]] = val);
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
				<Col span={7} style={{ lineHeight: '30px' }}>
					{/* <Select defaultValue={tblType} disabled={!showHeader} onChange={(val, opt:any) => {
						setTblType(val);
						setDatasource(opt.sub)
						updateBlockData(store, props, (v) => v.props[(option as any).field[0]] = val);
					}} options={()=>{
						value:'tblReport', label:'报告表',
						return [];
					}} /> */}
				</Col>
			</Row>
		</div>
	);
};

export default memo(MBorder);
