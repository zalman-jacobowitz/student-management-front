import { describe, it, expect, beforeEach } from 'vitest';
import {
  getEventStatusText,
  getEventStatusShortText,
  getEventStatusUI,
} from '../event-status';

describe('Event Status Functions', () => {
  let mockDate: Date;
  let allEvents;

  beforeEach(() => {
    // תאריך קבוע: 17 בנובמבר 2025, 12:00
    mockDate = new Date('2025-11-17T12:00:00');

    allEvents = [
      {
        event_id: '1',
        event_name: 'מתמטיקה',
        day: '2025-11-17',
        event_start: '10:00',
        event_end: '11:00',
      },
      {
        event_id: '2',
        event_name: 'אנגלית',
        day: '2025-11-20',
        event_start: '14:00',
        event_end: '15:00',
      },
    ];
  });

  describe('getEventStatusText', () => {
    it('אירוע בעבר ללא רישום - צריך להחזיר error', () => {
      const pastEvent = {
        event_id: '3',
        event_name: 'היסטוריה',
        day: '2025-11-10',
        event_start: '09:00',
        event_end: '10:00',
      };

      const result = getEventStatusText(pastEvent, allEvents, undefined, mockDate);

      expect(result.isPast).toBe(true);
      expect(result.hasRegistration).toBe(false);
      expect(result.severity).toBe('error');
      expect(result.statusText).toContain('ללא רישום');
    });

    it('אירוע בעבר עם רישום - צריך להחזיר success', () => {
      const pastEvent = {
        event_id: '1',
        event_name: 'מתמטיקה',
        day: '2025-11-17',
        event_start: '10:00',
        event_end: '11:00',
      };

      const result = getEventStatusText(pastEvent, allEvents, undefined, mockDate);

      expect(result.isPast).toBe(true);
      expect(result.hasRegistration).toBe(true);
      expect(result.severity).toBe('success');
    });

    it('אירוע בעתיד עם רישום - צריך להחזיר info', () => {
      const futureEvent = {
        event_id: '2',
        event_name: 'אנגלית',
        day: '2025-11-20',
        event_start: '14:00',
        event_end: '15:00',
      };

      const result = getEventStatusText(futureEvent, allEvents, undefined, mockDate);

      expect(result.isPast).toBe(false);
      expect(result.hasRegistration).toBe(true);
      expect(result.severity).toBe('info');
    });

    it('אירוע בעתיד ללא רישום - צריך להחזיר warning', () => {
      const newEvent = {
        event_id: '99',
        event_name: 'ספרות',
        day: '2025-11-25',
        event_start: '11:00',
        event_end: '12:00',
      };

      const result = getEventStatusText(newEvent, allEvents, undefined, mockDate);

      expect(result.isPast).toBe(false);
      expect(result.hasRegistration).toBe(false);
      expect(result.severity).toBe('warning');
    });

    it('צריך להחזיר details array עם מידע', () => {
      const event = {
        event_id: '1',
        event_name: 'מתמטיקה',
        day: '2025-11-17',
        event_start: '10:00',
      };

      const result = getEventStatusText(event, allEvents, undefined, mockDate);

      expect(result.statusDetails).toBeInstanceOf(Array);
      expect(result.statusDetails.length).toBeGreaterThan(0);
    });
  });

  describe('getEventStatusShortText', () => {
    it('צריך להחזיר string קצר', () => {
      const event = {
        event_id: '1',
        event_name: 'מתמטיקה',
        day: '2025-11-17',
        event_start: '10:00',
      };

      const result = getEventStatusShortText(event, allEvents, undefined, mockDate);

      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('getEventStatusUI', () => {
    it('צריך להחזיר אובייקט עם color, icon, label', () => {
      const event = {
        event_id: '1',
        event_name: 'מתמטיקה',
        day: '2025-11-17',
        event_start: '10:00',
      };

      const result = getEventStatusUI(event, allEvents, undefined, mockDate);

      expect(result).toHaveProperty('color');
      expect(result).toHaveProperty('icon');
      expect(result).toHaveProperty('label');
      expect(result).toHaveProperty('severity');
      expect(result).toHaveProperty('details');
    });

    it('צביעה נכונה לפי severity', () => {
      const pastEventNoReg = {
        event_id: '99',
        event_name: 'טעות',
        day: '2025-11-10',
        event_start: '09:00',
      };

      const result = getEventStatusUI(pastEventNoReg, allEvents, undefined, mockDate);

      expect(result.color).toBe('error');
      expect(result.severity).toBe('error');
    });

    it('סמל נכון לפי severity', () => {
      const event = {
        event_id: '1',
        event_name: 'מתמטיקה',
        day: '2025-11-17',
        event_start: '10:00',
      };

      const result = getEventStatusUI(event, allEvents, undefined, mockDate);

      expect(result.icon).toBe('solar:check-circle-bold-duotone');
    });
  });

  describe('Edge Cases', () => {
    it('אירוע עם event_id אבל ללא day - לא צריך להיות רישום', () => {
      const event = {
        event_id: '1',
        event_name: 'מתמטיקה',
        event_start: '10:00',
      };

      const result = getEventStatusText(event as any, allEvents, undefined, mockDate);

      expect(result.hasRegistration).toBe(false);
    });

    it('אירוע עם event_id ו-day אבל event_id שונה - לא צריך להיות רישום', () => {
      const event = {
        event_id: '999',
        event_name: 'מתמטיקה',
        day: '2025-11-17',
        event_start: '10:00',
      };

      const result = getEventStatusText(event, allEvents, undefined, mockDate);

      expect(result.hasRegistration).toBe(false);
    });

    it('resitraion with registeredEvents parameter', () => {
      const event = {
        event_id: '999',
        event_name: 'ביולוגיה',
        day: '2025-11-18',
        event_start: '15:00',
      };

      const registeredEvents = [
        {
          event_id: '999',
          event_name: 'ביולוגיה',
          day: '2025-11-18',
        },
      ];

      const result = getEventStatusText(
        event,
        allEvents,
        registeredEvents,
        mockDate
      );

      expect(result.hasRegistration).toBe(true);
    });
  });
});
