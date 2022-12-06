
import { useMemo, memo, useState } from 'react';
import { Row, Col, Select } from 'antd';
import { UserConfig } from 'dooringx-lib';
import { FormMap } from '../formTypes';
import { CreateOptionsRes } from 'dooringx-lib/dist/core/components/formTypes';
import { IBlockType } from 'dooringx-lib/dist/core/store/storetype';
import { updateFormBlockData } from '../helper/update';

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
		{ value:'YJ-RECORD-001', label:'YJ-RECORD-001'},
		{ value:'YJ-RECORD-002', label:'YJ-RECORD-002'},
		{ value:'YJ-REPORT-001', label:'YJ-REPORT-001'},
		{ value:'YJ-REPORT-002', label:'YJ-REPORT-002'},
	]
	return (
		<Row style={{ padding: '10px' }}>
			<Col span={6} className={'mj-line-height'}>编号：</Col>
			<Col span={9} className={'mj-line-height'}>
				<Select defaultValue={props.current.props[(option as any).field[0]]} onChange={(val, opt:any) => {
					updateFormBlockData(store, props, (v) => v.props[(option as any).field[0]] = val);
				}} options={listTitle} />
			</Col>
		</Row>
	);
};

export default memo(MBorder);
