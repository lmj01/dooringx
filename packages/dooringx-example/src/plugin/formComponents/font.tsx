
import { useMemo, memo } from 'react';
import { InputNumber, Row, Col, Checkbox  } from 'antd';
import { UserConfig, ColorPicker } from 'dooringx-lib';
import { FormMap } from '../formTypes';
import { CreateOptionsRes } from 'dooringx-lib/dist/core/components/formTypes';
import { IBlockType } from 'dooringx-lib/dist/core/store/storetype';
import { updateFormBlockData } from '../helper/update';

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
				<InputNumber defaultValue={props.current.props[(option as any).field[0]]} onChange={(val) => {
						updateFormBlockData(store, props, (v) => {
							v.props[(option as any).field[0]] = val;
						});
					}} />
			</Col>
			<Col span={7} style={{ lineHeight: '30px' }}>
				<Checkbox.Group options={fontOptions} defaultValue={[]} onChange={(val)=>{
					updateFormBlockData(store, props, (v) => v.props[(option as any).field[2]] = val);
				}} />
			</Col>
			<Col span={4} title={'字体颜色'} style={{ lineHeight: '30px', margin:'auto' }}>
				<ColorPicker initColor={props.current.props[(option as any).field[1]]} onChange={(val:any)=>{					
					updateFormBlockData(store, props, (v) => v.props[(option as any).field[1]] = val);
				}} />
			</Col>
		</Row>
	);
};

export default memo(MFont);
