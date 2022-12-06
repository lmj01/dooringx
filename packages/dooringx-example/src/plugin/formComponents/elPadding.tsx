
import { useMemo, memo } from 'react';
import { InputNumber, Row, Col } from 'antd';
import { UserConfig } from 'dooringx-lib';
import { FormMap } from '../formTypes';
import { CreateOptionsRes } from 'dooringx-lib/dist/core/components/formTypes';
import { IBlockType } from 'dooringx-lib/dist/core/store/storetype';
import { updateFormBlockData } from '../helper/update';

interface MSizeProps {
	data: CreateOptionsRes<FormMap, 'elPadding'>;
	current: IBlockType;
	config: UserConfig;
}

const MSize = (props: MSizeProps) => {
	const store = props.config.getStore();	
	return (
		<Row style={{ padding: '10px' }}>
			<Col span={6} className={'mj-line-height'}>{'边距'}：</Col>
			<Col span={9} className={'mj-line-height'}>
				{'上下'}：
				<InputNumber defaultValue={props.current['paddingY']} onChange={(val) => {
						updateFormBlockData(store, props, (v) => v['paddingY'] = val);
					}} />
			</Col>
			<Col span={9} className={'mj-line-height'}>
				{'左右'}：
				<InputNumber defaultValue={props.current['paddingX']} onChange={(val) => {
						updateFormBlockData(store, props, (v) => v['paddingX'] = val);
					}} />
			</Col>
		</Row>
	);
};

export default memo(MSize);
