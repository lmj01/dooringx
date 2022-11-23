
import { useMemo, memo } from 'react';
import { InputNumber, Row, Col, Radio, Checkbox  } from 'antd';
import { deepCopy, UserConfig, ColorPicker } from 'dooringx-lib';
import { FormMap } from '../formTypes';
import { CreateOptionsRes } from 'dooringx-lib/dist/core/components/formTypes';
import { IBlockType } from 'dooringx-lib/dist/core/store/storetype';
import { updateBlockData } from './helper';

interface MFontProps {
	data: CreateOptionsRes<FormMap, 'font'>;
	current: IBlockType;
	config: UserConfig;
}

const MFont = (props: MFontProps) => {
	const option = useMemo(() => {
		return props.data?.option || {};
	}, [props.data]);
	const store = props.config.getStore();
	const fontOptions = [
		{ label: '加粗', value: 'bold' },
		{ label: '斜体', value: 'italic' },
		{ label: '下划线', value: 'underline' },
	];
	return (
		<Row style={{ padding: '10px' }}>
			<Col span={6} style={{ lineHeight: '30px' }}>
				{(option as any)?.label || '字号'}：
			</Col>
			<Col span={7} title={'大小'} style={{ lineHeight: '30px' }}>
				<InputNumber defaultValue={props.current.props['fontSize']} onChange={(val) => {
						updateBlockData(store, props, (v) => v.props['fontSize'] = val);
					}} />
			</Col>
			<Col span={7} style={{ lineHeight: '30px' }}>
				<Checkbox.Group options={fontOptions} defaultValue={[]} onChange={(val)=>{
					updateBlockData(store, props, (v) => v.props['styles'] = val);
				}} />
			</Col>
			<Col span={4} title={'字体颜色'} style={{ lineHeight: '30px', margin:'auto' }}>
				<ColorPicker initColor={props.current.props['color']} onChange={(val:any)=>{					
					updateBlockData(store, props, (v) => v.props['color'] = val);
				}} />
			</Col>
		</Row>
	);
};

export default memo(MFont);
