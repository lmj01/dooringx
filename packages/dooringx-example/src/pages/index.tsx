/*
 * @Author: yehuozhili
 * @Date: 2021-05-15 12:49:28
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-09-28 21:58:21
 * @FilePath: \dooringx\packages\dooringx-example\src\pages\index.tsx
 */
import {
	RightConfig,
	Container,
	useStoreState,
	innerContainerDragUp,
	LeftConfig,
	ContainerWrapper,
	Control,
	scaleFn
} from 'dooringx-lib';
import { MinusOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { useContext, useEffect, useState } from 'react';
import { configContext, LocaleContext } from '@/layouts';
import { useCallback } from 'react';
import { PREVIEWSTATE } from '@/constant';
import { Button, Input, message, Modal, Statistic, Upload } from 'antd';
import { localeKey } from '../../../dooringx-lib/dist/locale';
import { LeftRegistComponentMapItem } from 'dooringx-lib/dist/core/crossDrag';
import { toPng } from '../dom2image';
import { getTemplateForm1 } from './data/template';

export const HeaderHeight = '40px';
const footerConfig = function () {
	return (
		<>
			{/* <Popover content={'快捷键'} title={null} trigger="hover">
				<Button type="text" icon={<InsertRowBelowOutlined />}></Button>
			</Popover> */}
		</>
	);
};

function toPercentage(val:number) {
	return Number(val / 0.8 * 100).toFixed(2).toString()
}

export default function IndexPage() {
	const config = useContext(configContext);
	const locale = useContext(LocaleContext);

	const everyFn = () => {};

	const subscribeFn = useCallback(() => {
		//需要去预览前判断下弹窗。
		localStorage.setItem(PREVIEWSTATE, JSON.stringify(config.getStore().getData()));
	}, [config]);

	const [state] = useStoreState(config, subscribeFn, everyFn);

	const [value, setValue] = useState('');
	const [open, setOpen] = useState(false);
	const [open1, setOpen1] = useState(false);
	const [scale, setScale] = useState(toPercentage(config.scaleState.value));

	useEffect(() => {
		setScale(toPercentage(config.scaleState.value));
	}, [config.scaleState.value]);

	const saveAsPngFile = () => {
		toPng(document.getElementById('yh-container')).then((res) => {
			var img = new Image();
			img.onload = function() {
				const canvas = document.createElement('canvas'),
					ctx = canvas.getContext("2d");
				canvas.width = img.width;
				canvas.height = img.height;
				ctx && ctx.drawImage(img, 0, 0, img.width, img.height);
				canvas.toBlob((blob) => {
					const tagA = document.createElement('a');
					tagA.href = URL.createObjectURL(blob);
					tagA.download = 'test.png';
					tagA.click();
				}, 'image/jpeg', 0.9);
			}
			img.src = res;
		});
	}
	const createAndDownloadFile = (fileName: string) => {
		const aTag = document.createElement('a');
		const res = config.getStore().getData();
		const JSONres = JSON.stringify(res);
		const blob = new Blob([JSONres]);
		aTag.download = fileName;
		const url = URL.createObjectURL(blob);
		aTag.href = url;
		aTag.click();
		URL.revokeObjectURL(url);
	};

	function handleBtnClick(type:string) {
		if (type === 'template-form1') {
			getTemplateForm1().then((res) => {
				config.getStore().resetToInitData([res]);
				setOpen(false);	
			})
		}
	}

	return (
		<div {...innerContainerDragUp(config)}>
			<div style={{ display:'flex', height: HeaderHeight }}>
				<div style={{}}>
					<Button onClick={() => saveAsPngFile()}>
						截图
					</Button>
					<Button onClick={() => setOpen1(true)}>
						预览
					</Button>
					{/* <Button
						onClick={() => {
							window.open('/iframe');
						}}
					>
						iframe 预览
					</Button> */}
					{/* <Button
						onClick={() => {
							window.open('/preview');
						}}
					>
						普通预览
					</Button>
					<Button
						onClick={() => {
							locale.change((pre: localeKey) => {
								return pre === 'zh-CN' ? 'en' : 'zh-CN';
							});
						}}
					>
						切换语言
					</Button>
					<Input
						style={{ width: 200 }}
						value={value}
						onChange={(e) => setValue(e.target.value)}
					></Input>
					<Button
						onClick={() => {
							const leftprops: Partial<LeftRegistComponentMapItem> = {
								type: 'basic',
								img: 'https://img.guguzhu.com/d/file/android/ico/2021/09/08/rytzi2w34tm.png',
							};
							config.scriptSingleLoad(value, leftprops);
						}}
					>
						远程组件
					</Button> */}
					<Button onClick={() => createAndDownloadFile('form1.json')}>
						保存模板
					</Button>
					<Button
						onClick={() => {
							setOpen(true);
						}}
					>
						打开模板
					</Button>
				</div>
				<div style={{display:'flex', flex:'auto', justifyContent:'flex-end'}}>
					<Button type="primary" icon={<MinusOutlined />} onClick={()=>{
						scaleFn.decrease(0.1, config);
						// setScale(toPercentage(config.scaleState.value));
					}}></Button>
					<div style={{marginTop:'5px',textAlign:'center',width:'40px'}}>{scale}</div>
					<Button type="primary" icon={<PlusOutlined />} onClick={()=>{
						scaleFn.increase(0.1, config);
						// setScale(toPercentage(config.scaleState.value));
					}}></Button>
				</div>
			</div>
			<Modal
				visible={open}
				onCancel={() => setOpen(false)}
				onOk={() => setOpen(false)}
				title={'import json'}
			>
				<Upload
					name="file"
					maxCount={1}
					onChange={(e) => {
						if (e.file.status === 'done') {
							const file = e.file.originFileObj;
							if (file) {
								let reader = new FileReader();
								reader.addEventListener('loadend', function () {
									try {
										let res = JSON.parse(reader.result as string);
										console.log(res, '返回结果数据');
										config.getStore().resetToInitData([res]);
										setOpen(false);
									} catch {
										message.error('json解析格式有误');
									}
								});
								reader.readAsText(file);
							}
						}
					}}
				>
					<Button icon={<UploadOutlined />}>&nbsp; 点击上传</Button>
				</Upload>
				<Button onClick={()=>handleBtnClick('template-form1')}>{'模板-定制式无托槽矫治器成品检验报告'}</Button>
			</Modal>
			<Modal visible={open1} onOk={()=>setOpen1(false)} onCancel={()=>setOpen1(false)} title={'preview'} width={600}>
				<iframe src="/iframe" style={{
					height: '700px',
					width: '100%',
					border: '0',
				}}></iframe>
			</Modal>		
			<div
				style={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					height: `calc(100vh - ${HeaderHeight})`,
					width: '100vw',
				}}
			>
				<div style={{ height: '100%' }}>
					<LeftConfig footerConfig={footerConfig()} config={config}></LeftConfig>
				</div>

				<ContainerWrapper config={config}>
					<>
						<Control
							config={config}
							style={{ position: 'fixed', bottom: '160px', right: '450px', zIndex: 100 }}
						></Control>
						<Container state={state} config={config} context="edit"></Container>
					</>
				</ContainerWrapper>
				<div className="rightrender" style={{ height: '100%' }}>
					<RightConfig state={state} config={config}></RightConfig>
				</div>
			</div>
		</div>
	);
}
