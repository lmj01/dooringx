
import { useMemo, memo } from 'react';
import { Row, Col, Select } from 'antd';
import { UserConfig, ColorPicker } from 'dooringx-lib';
import { FormMap } from '../formTypes';
import { CreateOptionsRes } from 'dooringx-lib/dist/core/components/formTypes';
import { IBlockType } from 'dooringx-lib/dist/core/store/storetype';
import { updateBlockData } from './helper';

interface MBorderProps {
	data: CreateOptionsRes<FormMap, 'elBorder'>;
	current: IBlockType;
	config: UserConfig;
}

const MBorder = (props: MBorderProps) => {
	const option = useMemo(() => {
		return props.data?.option || {
			color: 'rgba(0,0,0,1)',
			style: 'solid',
		};
	}, [props.data]);
	const store = props.config.getStore();

	return (
		<Row style={{ padding: '10px' }}>
			<Col span={6} style={{ lineHeight: '30px' }}>
				{(option as any)?.label || '样式'}：
			</Col>
			<Col span={6} style={{ lineHeight: '30px' }}>
				<Select defaultValue={props.current.props['borderStyle']} onChange={(val) => {
						updateBlockData(store, props, (v) => v.props['borderStyle'] = val);
					}} options={[
						{value:'solid', label:'实线'},
						{value:'dotted', label:'圆点'},
						{value:'dashed', label:'虚线'},
					]} />
			</Col>
			{/* <Col span={8} style={{ lineHeight: '30px' }}>
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
			</Col> */}
			<Col span={4} style={{ lineHeight: '30px', margin:'auto' }}>
				<ColorPicker initColor={props.current.props['borderColor']} onChange={(val:any)=>{		
					updateBlockData(store, props, (v) => v.props['borderColor'] = val);
				}} />
			</Col>
		</Row>
	);
};

export default memo(MBorder);
