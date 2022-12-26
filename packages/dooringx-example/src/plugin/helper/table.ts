export interface ICell {
    row: number; // row
    col: number; // col
    label: string;
    cspan: number; // default 1
    rspan: number; // default 1
    style: {[key:string]:any};
    type?: string; // 目前三种类型，默认为空, 多行文本textarea, 可选类型checkbox
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
export type StyleType = 'textAlign' | 'textContent' | 'visibility' | 'width' | 'height' | 'textarea' | 'checkbox' | ''; 
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
            tmpRow.push({
                row: i, 
                col: j, 
                label:`${i}-${j}`, 
                rspan: 1, 
                cspan: 1,
                style: {
                    visibility: 'hidden',
                },
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
    const rowData = table[row];
    if (rowData) {
        const tmp = rowData.cells.filter(e=>e.row==row&&e.col==col)[0];
        if (tmp) {
            if (['', 'textarea', 'checkbox'].includes(type)) {
                tmp.type = type;
                tmp.label = value;
            } else {
                if (tmp.style === undefined) tmp.style = {};
                tmp.style[type] = value;
            }
        } else { 
            console.warn(`更新单位的位置${col},${row},${type},${value}`)
        }
    }
}

/**
 * 
 * @param soruce 
 * @param target 
 */
export function syncTableData(source:Array<ISingleRow>, target:Array<ISingleRow>, col:number, row:number) {
    // row和col是不一致的，因为进行了合并操作，中间部分缺失了
    for (let rSrc = 0; rSrc < row; rSrc++) {
        let srcRow = source[rSrc];
        if (srcRow) {
            source[rSrc].cells.forEach((sCell,index)=>{
                const { label, rspan, cspan, style, type } = sCell;
                let dstRow = target[rSrc];
                if (dstRow) {
                    let find = false;
                    target[rSrc].cells.forEach(cell=>{
                        if (cell.row == sCell.row && cell.col == sCell.col) {
                            find = true;
                            cell.label = label;
                            cell.rspan = rspan;
                            cell.cspan = cspan;
                            cell.style = style;
                            if (type) cell.type = type;        
                        }
                    });
                    if (find) console.warn(`no row=${sCell.row}, col=${sCell.col}, exist !!!`);    
                } else {
                    console.warn(`no row=${rSrc} exist !!!`);    
                }
            })
        }
    }
}
