
import useEventStore from "src/hooks/use-events"
import { uuidv4 } from "./uuidv4";

function getStatus(dataForm){
    const lateTime = (time) => useEventStore.getState().lateTime(time)
    return dataForm.status === 'late'? lateTime(dataForm.late) : dataForm.status
}
export const generateUniqueIds = (records, userEmail) => records.map((record) => ({
    ...record,
    client: 'kg_gdola',
    user_id: userEmail,
    student_id: uuidv4()
  }));
  
export function managerEdit(dataForm){
    const eventDetails = useEventStore.getState().current

    const newData = dataForm.student.map(e=> ({
            'student_id': e.student_id,
            'day': eventDetails.day,
            'event': eventDetails.event,
            'data': parseFloat(getStatus(dataForm)).toFixed(1)
    }))
    console.table(newData)
    return newData
}

function rangeOfExeption(dataForm){
    const eventDetails = useEventStore.getState()
    
    switch (dataForm.exeption){
        case 'day':
            return {
                'start': new Date(`${eventDetails.day} 00:00:00`).getTime(),
                'end': new Date(`${eventDetails.day} 23:59:59`).getTime(),
        }
        case 'time':
            return {
                'start': eventDetails.start(),
                'end': eventDetails.end()
                }
        case 'custom':
            return {
                'start': new Date(`${dataForm.start_exeption_day} ${dataForm.start_exeption_hour}`).getTime(),
                'end': new Date(`${dataForm.end_exeption_day} ${dataForm.end_exeption_hour}`).getTime()
            }
        default:
            return null
        }


}

export function exeptionsEdit(dataForm, range){

    const newData = dataForm.student.map(e=> ({
            'student_id': e.student_id,
            'from_day':  parseFloat(range.start).toFixed(0),
            'to_day':  parseFloat(range.end).toFixed(0),
            'reason': dataForm.reason
    }))
    console.table(newData)
    
    return newData
}
