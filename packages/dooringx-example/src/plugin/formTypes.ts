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

export interface ElementPositionType {
	label?: string;
}

export interface ElementSizeType {
	label?: string;
}
export interface ElementBorderType {
	label?: string;
	width?: number;
	style?: string;
	color?: string;
	editWidth: boolean;
}

export interface TableType {
	label?: string;
}

export interface FormMap {
	input: FormInputType;
	actionButton: FormActionButtonType;
	animateControl: FormAnimateControlType;
	switch: FormSwitchType;
	elPosition: ElementPositionType;
	elSize: ElementSizeType;
	elBorder: ElementBorderType;
	table: TableType;
}
