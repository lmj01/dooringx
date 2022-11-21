
import React, { useMemo, memo } from 'react';
import { InputNumber, Row, Col } from 'antd';
import { deepCopy, UserConfig } from 'dooringx-lib';
import { FormMap } from '../formTypes';
import { CreateOptionsRes } from 'dooringx-lib/dist/core/components/formTypes';
import { IBlockType } from 'dooringx-lib/dist/core/store/storetype';
import { locale } from 'dooringx-lib';

interface MSizeProps {
	data: CreateOptionsRes<FormMap, 'elSize'>;
	current: IBlockType;
	config: UserConfig;
}

const MSize = (props: MSizeProps) => {
	const option = useMemo(() => {
		return props.data?.option || {};
	}, [props.data]);
	const store = props.config.getStore();
	return (
		<Row style={{ padding: '10px' }}>
			<Col span={8} style={{ lineHeight: '30px' }}>
				{(option as any)?.label || '大小'}：
			</Col>
			<Col span={8} style={{ lineHeight: '30px' }}>
				{locale.replaceLocale('form.size.width', '宽度', props.config)}：
				<InputNumber defaultValue={props.current['width']} onChange={(val) => {
						const clonedata = deepCopy(store.getData());
						const newblock = clonedata.block.map((v: IBlockType) => {
							if (v.id === props.current.id) {
								v['width'] = val;
							}
							return v;
						});
						store.setData({ ...clonedata, block: [...newblock] });
					}} />
			</Col>
			<Col span={8} style={{ lineHeight: '30px' }}>
				{locale.replaceLocale('form.size.height', '高度', props.config)}：
				<InputNumber defaultValue={props.current['height']} onChange={(val) => {
						const clonedata = deepCopy(store.getData());
						const newblock = clonedata.block.map((v: IBlockType) => {
							if (v.id === props.current.id) {
								v['height'] = val;
							}
							return v;
						});
						store.setData({ ...clonedata, block: [...newblock] });
					}} />
			</Col>
		</Row>
	);
};

export default memo(MSize);
