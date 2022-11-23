
/**
 * 解析ColorPicker颜色值
 */
export function colorToString(color:any) {
	if (typeof color === 'string') return color;
	const {r,g,b,a} = color;
	return `rgba(${r},${g},${b},${a})`;
}
