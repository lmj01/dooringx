import { deepCopy } from 'dooringx-lib';
import Store from 'dooringx-lib/dist/core/store';
import { IBlockType } from 'dooringx-lib/dist/core/store/storetype';

export function updateBlockData(store:Store, props:any,cb:(v:IBlockType)=>{}) {
    const clonedata = deepCopy(store.getData());
    const newblock = clonedata.block.map((v: IBlockType) => {
        if (v.id === props.current.id) {
            cb(v);
        }
        return v;
    });
    store.setData({ ...clonedata, block: [...newblock] });
}