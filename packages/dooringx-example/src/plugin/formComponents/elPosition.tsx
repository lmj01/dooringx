
import { useMemo, memo, useEffect, useState } from 'react';
import { InputNumber, Row, Col } from 'antd';
import { UserConfig } from 'dooringx-lib';
import { FormMap } from '../formTypes';
import { CreateOptionsRes } from 'dooringx-lib/dist/core/components/formTypes';
import { IBlockType } from 'dooringx-lib/dist/core/store/storetype';
import { updateBlockData } from '../helper/update';
interface MPositionProps {
	data: CreateOptionsRes<FormMap, 'elPosition'>;
	current: IBlockType;
	config: UserConfig;
}

const MPosition = (props: MPositionProps) => {
	const option = useMemo(() => {
		return props.data?.option || {};
	}, [props.data]);
	const store = props.config.getStore();

	const [left, setLeft] = useState(props.current.left);
	const [top, setTop] = useState(props.current.top);

	useEffect(() => {
		setLeft(props.current.left);
	}, [props.current.left]);

	useEffect(() => {
		setTop(props.current.top);
	}, [props.current.top]);

	return (
		<Row style={{ padding: '10px' }}>
			<Col span={6} style={{ lineHeight: '30px' }}>
				{(option as any)?.label || '位置'}：
			</Col>
			<Col span={9} style={{ lineHeight: '30px' }}>
				X：
				<InputNumber defaultValue={left} onChange={(val:number) => {
						updateBlockData(store, props, (v) => v['left'] = val);
					}} />
			</Col>
			<Col span={9} style={{ lineHeight: '30px' }}>
				Y：
				<InputNumber defaultValue={top} onChange={(val:number) => {
					updateBlockData(store, props, (v) => v['top'] = val);
					}} />
			</Col>
		</Row>
	);
};

export default memo(MPosition);
