import { deepCopy } from 'dooringx-lib';
import Store from 'dooringx-lib/dist/core/store';
import { IBlockType } from 'dooringx-lib/dist/core/store/storetype';
import { ComponentRenderConfigProps } from 'dooringx-lib/dist/core/components/componentItem';

/**
 * 
 * @param store 
 * @param props 
 * @param cb 
 */
export function updateFormBlockData(store:Store, props:any,cb:(v:IBlockType)=>any) {
    const clonedata = deepCopy(store.getData());
    const newblock = clonedata.block.map((v: IBlockType) => {
        if (v.id === props.current.id) {
            cb(v);
        }
        return v;
    });
    store.setData({ ...clonedata, block: [...newblock] });
}

export function updateRegistBlockData(pr: ComponentRenderConfigProps) {
    const {store, data} = pr;
    const clonedata = deepCopy(store.getData());
    const newblock = clonedata.block.map((v:IBlockType) => {
        if (v.id === data.id) {
            return data;
        }
        return v;
    })
    store.setData({...clonedata, block: [...newblock]});
}