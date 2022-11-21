
import React, { useMemo, memo } from 'react';
import { InputNumber, Row, Col } from 'antd';
import { deepCopy, UserConfig } from 'dooringx-lib';
import { FormMap } from '../formTypes';
import { CreateOptionsRes } from 'dooringx-lib/dist/core/components/formTypes';
import { IBlockType } from 'dooringx-lib/dist/core/store/storetype';

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
	return (
		<Row style={{ padding: '10px' }}>
			<Col span={8} style={{ lineHeight: '30px' }}>
				{(option as any)?.label || '位置'}：
			</Col>
			<Col span={8} style={{ lineHeight: '30px' }}>
				X：
				<InputNumber defaultValue={props.current['left'] || 0} onChange={(val:number) => {
						const clonedata = deepCopy(store.getData());
						const newblock = clonedata.block.map((v: IBlockType) => {
							if (v.id === props.current.id) {
								v['left'] = val;
							}
							return v;
						});
						store.setData({ ...clonedata, block: [...newblock] });
					}} />
			</Col>
			<Col span={8} style={{ lineHeight: '30px' }}>
				Y：
				<InputNumber defaultValue={props.current['top'] || 0} onChange={(val:number) => {
						const clonedata = deepCopy(store.getData());
						const newblock = clonedata.block.map((v: IBlockType) => {
							if (v.id === props.current.id) {
								v['top'] = val;
							}
							return v;
						});
						store.setData({ ...clonedata, block: [...newblock] });
					}} />
			</Col>
		</Row>
	);
};

export default memo(MPosition);
