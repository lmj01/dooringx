/*
 * @Author: yehuozhili
 * @Date: 2021-07-07 14:31:20
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-08-05 15:10:23
 * @FilePath: \dooringx\packages\dooringx-example\src\plugin\formTypes.ts
 */
export interface FormBaseType {
	receive?: string;
}
export interface FormInputType extends FormBaseType {
	label: string;
}
export interface FormActionButtonType {

}
export interface FormAnimateControlType {}

export interface FormSwitchType extends FormBaseType {
	label: string;
}

export interface BaseType {
	field?: Array<string>; // 字段名称
	label?: string; // 描述文字
}
export interface ElementPositionType extends BaseType {
}
export interface ElementSizeType extends BaseType {
}
export interface ElementPaddingType extends BaseType {
}
export interface ElementBorderType extends BaseType {
	width?: number;
	style?: string;
	color?: string;
	editWidth: boolean;
}

export interface FontType extends BaseType {
	color?: string;
	fontSize:number;
	styles:Array<string>;	
}

export interface OpTitleType extends BaseType {
}
export interface OpTableType extends BaseType {	
}


export interface FormMap {
	input: FormInputType;
	actionButton: FormActionButtonType;
	animateControl: FormAnimateControlType;
	switch: FormSwitchType;
	elPosition: ElementPositionType;
	elSize: ElementSizeType;
	elPadding: ElementPaddingType;
	elBorder: ElementBorderType;
	font: FontType;
	opTitle: OpTitleType;
	opTable: OpTableType;
}
