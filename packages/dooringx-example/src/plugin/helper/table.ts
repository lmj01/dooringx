export interface ICell {
    row: number; // row
    col: number; // col
    label: string;
    cspan: number; // default 1
    rspan: number; // default 1
    style: {[key:string]:any};
    children?: Array<any>;
    type?: string;
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
interface ICellType {
    col: number;
    row: number;
}
export type SpanType = 'colSpan' | 'rowSpan';
export interface ISpanType extends ICellType {
	type: SpanType;
	value:number;
}
export type StyleType = 'textAlign' | 'textContent' | 'visibility' | 'width' | 'height' | 'multiLine'; 
export interface IStyleType extends ICellType {
    type: StyleType;
    value:string;
}

/**
 * 
 * @param col 
 * @param row 
 */
export function createTableByRowAndCol(col:number, row:number, spanInfo:Array<ISpanType>) {
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
                style: {},
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
    // console.log('-update span before -', col,row,span,table, isRow)
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
            let oSpan = table[row].cells[col].rspan;
            table[row].cells[col].rspan = span;
            for (let i = oSpan; i < span; i++) {
                table[row+i].cells.splice(col, 1);
            }
        } else {
            // 增加
        }
    } 
    // console.log('-update span after -', table)
}

/**
 * 
 * @param table 
 * @param target 
 */
export function updateTableAfterModify(table:Array<ISingleRow>, target:ISpanType) {
    const {col, row, type, value} = target;
    if (type == 'colSpan') {
        // 重构表格
        updateTableSpanData(table, col, row, value as number, false);
    } else if (type == 'rowSpan') {
        // 重构表格
        updateTableSpanData(table, col, row, value as number, true);
    }
}

export function updateTableCell(table:Array<ISingleRow>, target: IStyleType) {
    const {col, row, type, value} = target;
    if (row === undefined || col === undefined || value.length < 1) return;
    const tmp = table[row].cells[col];
    if (type === 'textContent') {
        tmp.label = value;
    } else if (type === 'multiLine') {
        tmp.type = value === 'true' ? 'textarea' : undefined;
    } else {
        if (tmp.style === undefined) tmp.style = {};
        tmp.style[type] = value;
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
            const { label, rspan, cspan, style, children, type } = rowCells[j] as ICell;
            if (i < target.length && j < target[i].cells.length) {
                target[i].cells[j].label = label;
                target[i].cells[j].rspan = rspan;
                target[i].cells[j].cspan = cspan;
                target[i].cells[j].style = style;
                if (children) target[i].cells[j].children = children;
                if (type) target[i].cells[j].type = type;
            }
        }
    }
}
