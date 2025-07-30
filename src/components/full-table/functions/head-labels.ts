import { InfoColumn, TableConfig } from "../types";

type HeadLabel = {
    name: string;
    label: string;
    width?: number;
}

export function getHeadLabels(specialRow: string[], tableColumns: InfoColumn[]) : HeadLabel[] {

    const avatarRow = specialRow.includes('avatar') && {name: 'name', label: 'שם', width: 88 }
    
    const editRow = specialRow.includes('edit') && { name: '', label: '', width: 88 }
    
    const headLabels =  [
        avatarRow,
        ...tableColumns.filter(col => !col.hidden),
        editRow,
    ]

    return headLabels
}
