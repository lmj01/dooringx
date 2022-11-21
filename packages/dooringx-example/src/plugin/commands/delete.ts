import deepcopy from 'deepcopy';
import { CommanderItemFactory } from 'dooringx-lib';
import { IStoreData } from 'dooringx-lib/dist/core/store/storetype';

const hide = new CommanderItemFactory(
	'delete',
	'',
	(store) => {
		const clonedata: IStoreData = deepcopy(store.getData());
		clonedata.block = clonedata.block.filter(e=>!e.focus);
		store.setData(clonedata);
	},
	'删除'
);

export default hide;
