export interface ICell {
    row: number; // row
    col: number; // col
    label: string;
    cspan: number; // default 1
    rspan: number; // default 1
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
type SpanType = 'colSpan' | 'rowSpan' | 'label';
export interface IModifyType {
	col:number;
	row:number;
	type: SpanType;
	value:string|number;
}

/**
 * 
 * @param col 
 * @param row 
 */
export function createTableByRowAndCol(col:number, row:number, spanInfo:Array<IModifyType>) {
    console.log('-create table-', col, row, spanInfo)
    let tmp:Array<ISingleRow> = [];
    for (let i = 0; i < row; i++) {
        let tmpRow:Array<ICell> = [];
        for (let j = 0; j < col; j++) {
            let rspan = 1;
            let cspan = 1;
            tmpRow.push({
                row: i, 
                col: j, 
                label:`${i}-${j}`, 
                rspan: rspan, 
                cspan: cspan,
            });
        }
        tmp.push({cells:tmpRow});
    }
    spanInfo.forEach((info) => {
        updateTableSpanData(tmp, info.col, info.row, info.value as number, info.type == 'rowSpan');
    })
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
 * @param table 
 * @param target 
 */
export function updateTableAfterModify(table:Array<ISingleRow>, target:IModifyType) {
    const {col, row, type, value} = target as IModifyType;
    if (type == 'label') {
        // 修改值
        table[row].cells[col].label = value as string;
    } else if (type == 'colSpan') {
        // 重构表格
        updateTableSpanData(table, col, row, value as number, false);
    } else if (type == 'rowSpan') {
        // 重构表格
        updateTableSpanData(table, col, row, value as number, true);
    }
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
                target[i].cells[j].rspan = rspan;
                target[i].cells[j].cspan = cspan;
            }
        }
    }
}
