import { toast } from 'sonner';
import { create } from 'zustand';


type InsertState = {
  screen: 'form' | 'view';
  selectedEvent: any;
  currentData: any[];
  previousData: any[];
  delays: any[];
  setDelays: (data: any[]) => void;
  setCurrentData: (data: any[]) => void;
  setEventDetails: (details: any) => void;
  onBack: () => void;
  onCopy: () => void;
  onPaste: () => void;
}


const useInsertStore = create<InsertState>((set, get) => ({
  screen: 'form',
  selectedEvent: {},
  onBack : () => set({ screen: 'form' }),

  delays: [],
  setDelays: (data: any[]) => {

  const { currentData } = get();
  const { delay_id } = data[0]
  const students_ids = data.map(item => item.student_id)
  const crntData = currentData.map(item => {

  if (students_ids.includes(item.student_id)) {
    return {
      ...item,
      delay: delay_id
    }
  }
  return item})
  
  set({ currentData: crntData, delays: data })
},


  currentData: [],
  setCurrentData: (data: any[]) => set({ currentData: data, delays: [] }),

  setEventDetails: (details: any) => set({ selectedEvent: details , screen: 'view',  delays: []}),

  onCopy: () => {
    const { currentData } = get();
    set({ previousData: currentData });
    toast.success("הנתונים הועתקו בהצלחה");
  },
  previousData: [],
  onPaste: () => {
    const { previousData } = get();
    set({ currentData: previousData, previousData: [] });
    toast.success("הנתונים הודבקו בהצלחה");    
  }
}));

export default useInsertStore;