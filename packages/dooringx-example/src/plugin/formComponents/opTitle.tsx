
import { useMemo, memo, useState, useEffect } from 'react';
import { Row, Col, Select } from 'antd';
import { UserConfig } from 'dooringx-lib';
import { FormMap } from '../formTypes';
import { CreateOptionsRes } from 'dooringx-lib/dist/core/components/formTypes';
import { IBlockType } from 'dooringx-lib/dist/core/store/storetype';
import { updateFormBlockData } from '../helper/update';
import { getTemplateTitle } from '@/pages/data/template';

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
	const [titleData, setTitleData] = useState<Array<any>>([])
	// 依赖为空，仅在首次渲染时获取数据
	useEffect(() => {
		getTemplateTitle().then((res) => {
			setTitleData(res as Array<any>);
		})
	}, [])
	return (
		<Row style={{ padding: '10px' }}>
			<Col span={6} className={'mj-line-height'}>编号：</Col>
			<Col span={9} className={'mj-line-height'}>
				<Select defaultValue={props.current.props[(option as any).field[0]]} onChange={(val, opt:any) => {
					updateFormBlockData(store, props, (v) => v.props[(option as any).field[0]] = val);
				}} options={titleData} />
			</Col>
		</Row>
	);
};

export default memo(MBorder);
