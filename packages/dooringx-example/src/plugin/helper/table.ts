import { forkCountArray } from "./utils";


export interface ICell {
    x:number;
    y:number;
    label:string;
    cspan?:number;
    rspan?:number;
}

export interface ITableColumn {
    columns:Array<ICell>;
    showHeader:boolean;
}

export interface ISingleRow {
    cells:Array<ICell>;
}

export interface IGridRow {
    rows:Array<ISingleRow>;
}

/**
 * 
 * @param col 
 * @param row 
 */
export function createTableByRowAndCol(col:number, row:number) {
    const arrCol = forkCountArray(col);
    const arrRow = forkCountArray(row);
    let tmp:Array<ISingleRow> = [];
    arrRow.map((r,ir) => {			
        let tmpRow:Array<ICell> = [];
        arrCol.map((c,ic)=>{
            tmpRow.push({x:ir,y:ic,label:`${ir}-${ic}`});
        })
        tmp.push({cells:tmpRow});
    })
    return tmp;
}

/**
 * 
 * @param soruce 
 * @param target 
 */
export function syncTableData(source:Array<ISingleRow>, target:Array<ISingleRow>) {
    for (let i = 0; i < source.length; i++) {
        let rowCells = source[i].cells;
        for (let j = 0; j < rowCells.length; j++) {
            const {label, rspan, cspan } = rowCells[j] as ICell;
            if (i < target.length && j < target[i].cells.length) {
                target[i].cells[j].label = label;
                if (rspan) target[i].cells[j].rspan = rspan;
                if (cspan) target[i].cells[j].cspan = cspan;
            }
        }
    }
}
