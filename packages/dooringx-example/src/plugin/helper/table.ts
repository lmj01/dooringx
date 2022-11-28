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
    let tmp:Array<ISingleRow> = [];
    for (let i = 0; i < row; i++) {
        let tmpRow:Array<ICell> = [];
        for (let j = 0; j < col; j++) {
            tmpRow.push({x:i, y:j,label:`${i}-${j}`})
        }
        tmp.push({cells:tmpRow});
    }
    return tmp;
}
/**
 * 
 * @param table 
 * @param col 
 * @param row 
 * @param span 
 * @param isRow 
 */
export function updateTableSpanData(table:Array<ISingleRow>, col:number, row:number, span:number, isRow:boolean) {
    if (isRow) {
        if (span > 1) {
            // 删除
            table[row].cells[col].cspan = span;
            table[row].cells.splice(col+1, span-1);
        } else if (span < 2) {
            // 增加
        }
    } else {
        if (span > 1) {
            // 删除
            table[row].cells[col].rspan = span;
            for (let i = 1; i < span; i++) {
                table[row+1].cells.splice(col, 1);
            }
        } else {
            // 增加
        }
    } 
    console.log('-update span-', col,row,span,table)
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
