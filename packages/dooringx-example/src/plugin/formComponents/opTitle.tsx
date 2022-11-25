
import { useMemo, memo, useState } from 'react';
import { Row, Col, Select } from 'antd';
import { UserConfig } from 'dooringx-lib';
import { FormMap } from '../formTypes';
import { CreateOptionsRes } from 'dooringx-lib/dist/core/components/formTypes';
import { IBlockType } from 'dooringx-lib/dist/core/store/storetype';
import { updateBlockData } from './helper';

interface MBorderProps {
	data: CreateOptionsRes<FormMap, 'opTitle'>;
	current: IBlockType;
	config: UserConfig;
}

const MBorder = (props: MBorderProps) => {
	const option = useMemo(() => {
		return props.data?.option || {};
	}, [props.data]);
	const store = props.config.getStore();
	const listTitle = [
		{
			value:'记录编号', label:'记录编号',
			sub: [
				{ value:'YJ-RECORD-001', label:'YJ-RECORD-001'},
				{ value:'YJ-RECORD-002', label:'YJ-RECORD-002'},
			]
		},
		{
			value:'报告编号', label:'报告编号',
			sub: [
				{ value:'YJ-REPORT-001', label:'YJ-REPORT-001'},
				{ value:'YJ-REPORT-002', label:'YJ-REPORT-002'},
			]
		},
	]
	const [sub, setSub] = useState(()=>{
		let tmp = listTitle.filter(e=>e.value==props.current.props[(option as any).field[0]])
		if (tmp.length > 0) return tmp[0].sub;
	});
	return (
		<Row style={{ padding: '10px' }}>
			<Col span={6} style={{ lineHeight: '30px' }}>
				{(option as any)?.label || '样式'}：
			</Col>
			<Col span={9} style={{ lineHeight: '30px' }}>
				<Select defaultValue={props.current.props[(option as any).field[0]]} onChange={(val, opt:any) => {
					setSub(opt.sub)
					updateBlockData(store, props, (v) => v.props[(option as any).field[0]] = val);
					updateBlockData(store, props, (v) => v.props[(option as any).field[1]] = '');
				}} options={listTitle} />
			</Col>
			<Col span={9} style={{ lineHeight: '20px', margin:'auto' }}>
				<Select defaultValue={props.current.props[(option as any).field[1]]} onChange={(val, opt:any) => {
					updateBlockData(store, props, (v) => v.props[(option as any).field[1]] = val);
				}} options={sub} />
			</Col>
		</Row>
	);
};

export default memo(MBorder);
