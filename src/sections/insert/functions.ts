/**
 * 
 * @param infoStudents 
 * @returns Array of student IDs
 */
export const get_students_ids = (infoStudents: any[]): string[] => infoStudents.map((student) => student.student_id);


/**
 * 
 * @param getColumns 
 * @param row 
 * @returns 
 */
export function description(getColumns: any[], row: any): { primary: string; secondary: string } {
    const primary = getColumns.filter(e => e.group_name === 'primary').map(e => e.name)
    const primaryValue = primary.map(e => row[e]).join(' ')
    const secondary = getColumns.filter(e => e.group_name === 'secondary').map(e => e.name)
    const secondaryValue = secondary.map(e => row[e]).join(' ')
    return {
      primary: primaryValue,
      secondary: secondaryValue
    }
}

export const getDesc = (student: any, desc: string[]): string => desc.map(e => student[e]).join(' ')

export function descriptionColumns(getColumns: any[]): { primary: string[]; secondary: string[] } {
  const primary = getColumns.filter(e => e.group_name === 'primary').map(e => e.name)
  const secondary = getColumns.filter(e => e.group_name === 'secondary').map(e => e.name)
  return {
    primary,
    secondary
  }
}

export function insertTamplate(infoStudents: any[], selectedEvent: any): any[] {
    if (infoStudents.length && selectedEvent) {

        return infoStudents.map((item) => ({
            ...item,
            ...selectedEvent,
            data: false,
          }))
        };
    return [];    
}

export function changeBool(newData: any[]): any[] {
  // for base screen
  return newData.map((item) => ({...item, data: item.data? "100": "0"}))
}


export function formValues(tamplateData: any[]): Record<string, boolean> {
  return Object.fromEntries(tamplateData.map((item) => [item.student_id, !!item.data]))
}