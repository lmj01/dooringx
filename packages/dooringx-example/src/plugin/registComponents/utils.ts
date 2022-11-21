import { UserConfig } from 'dooringx-lib';
import { IBlockType } from '../../../../dooringx-lib/dist/core/store/storetype';
import Store from '../../../../dooringx-lib/dist/core/store';

/**
 * 组件属性
 */
export interface regComponentProps {
	data: IBlockType;
	context: string;
	store: Store;
	config: UserConfig;
}
