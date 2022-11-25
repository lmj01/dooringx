
/**
 * 解析ColorPicker颜色值
 */
export function colorToString(color:any) {
	if (typeof color === 'string') return color;
	const {r,g,b,a} = color;
	return `rgba(${r},${g},${b},${a})`;
}

/**
 * 创建空数据数组
 */
export function forkCountArray(len:number) {
	return [...new Array(len)].map(e=>[]);
}