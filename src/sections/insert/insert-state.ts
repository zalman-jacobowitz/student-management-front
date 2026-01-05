import { toast } from 'sonner';
import { create } from 'zustand';


type InsertState = {
  screen: 'form' | 'view';
  selectedEvent: any;
  currentData: any[];
  previousData: any[];
  delays: any[];
  allEvents: any[];
  currentEventIndex: number;
  setDelays: (data: any[]) => void;
  setCurrentData: (data: any[]) => void;
  setEventDetails: (details: any) => void;
  setAllEvents: (events: any[]) => void;
  nextEvent: () => void;
  prevEvent: () => void;
  onBack: () => void;
  onCopy: () => void;
  onPaste: () => void;
}


const useInsertStore = create<InsertState>((set, get) => ({
  screen: 'form',
  selectedEvent: {},
  allEvents: [],
  summary: {},
  setSummary: (summary: any) => set({ summary }),
  currentEventIndex: 0,
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

  setEventDetails: (details: any) => {
    const { allEvents } = get();
    
    // סידור הרשימה לפי יום ושעת התחלה
    // בדיקה אם הסדר קיים ברשימה: 
    const isNew = allEvents.find(event => event === details)
    const newListEvents = isNew ? [...allEvents, details] : allEvents
    const sortedEvents = newListEvents.sort((a, b) => {
      const timeA = a.day + ' ' + (a.event_start || '');
      const timeB = b.day + ' ' + (b.event_start || '');
      return timeA.localeCompare(timeB);
    });
    
    // מציאת האינדקס של האירוע המבוקש ברשימה המסודרת
    const eventIndex = sortedEvents.findIndex(e => e.event_id === details.event_id && e.day === details.day);
    const indexToSet = eventIndex >= 0 ? eventIndex : 0;
    
    set({ 
      selectedEvent: details, 
      screen: 'view',  
      delays: [],
      currentEventIndex: indexToSet,
      allEvents: sortedEvents
    })
  },

  setAllEvents: (events: any[]) => {
    // סידור האירועים לפי שעת התחלה
    const sortedEvents = [...events].sort((a, b) => {
      const timeA = a.day + ' ' + a.event_start || '';
      const timeB = b.day + ' ' + b.event_start || '';
      return timeA.localeCompare(timeB);
    });
    
    console.table(sortedEvents);
    set({ allEvents: sortedEvents, currentEventIndex: 0 })
  },

  nextEvent: () => {
    const { allEvents, currentEventIndex } = get();
    if (currentEventIndex < allEvents.length - 1) {
      const nextIndex = currentEventIndex + 1;
      set({ 
        currentEventIndex: nextIndex,
        selectedEvent: allEvents[nextIndex],
        currentData: [],
        delays: []
      });
    }
  },

  prevEvent: () => {
    const { allEvents, currentEventIndex } = get();
    if (currentEventIndex > 0) {
      const prevIndex = currentEventIndex - 1;
      set({ 
        currentEventIndex: prevIndex,
        selectedEvent: allEvents[prevIndex],
        currentData: [],
        delays: []
      });
    }
  },

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