
import { useMemo, memo } from 'react';
import { InputNumber, Row, Col } from 'antd';
import { UserConfig } from 'dooringx-lib';
import { FormMap } from '../formTypes';
import { CreateOptionsRes } from 'dooringx-lib/dist/core/components/formTypes';
import { IBlockType } from 'dooringx-lib/dist/core/store/storetype';
import { locale } from 'dooringx-lib';
import { updateFormBlockData } from '../helper/update';

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
			<Col span={6} style={{ lineHeight: '30px' }}>
				{(option as any)?.label || '大小'}：
			</Col>
			<Col span={9} style={{ lineHeight: '30px' }}>
				{locale.replaceLocale('form.size.width', 'Width', props.config)}：
				<InputNumber defaultValue={props.current['width']} onChange={(val) => {
						updateFormBlockData(store, props, (v) => v['width'] = val);
					}} />
			</Col>
			<Col span={9} style={{ lineHeight: '30px' }}>
				{locale.replaceLocale('form.size.height', 'Height', props.config)}：
				<InputNumber defaultValue={props.current['height']} onChange={(val) => {
						updateFormBlockData(store, props, (v) => v['height'] = val);
					}} />
			</Col>
		</Row>
	);
};

export default memo(MSize);
