import dayjs from 'dayjs';
import { z as zod } from 'zod';

// ----------------------------------------------------------------------

export const schemaHelper = {
  /**
   * Phone number
   * defaultValue === ''
   */
  phoneNumber: (props) =>
    zod
      .string({
        required_error: props?.message?.required_error ?? 'נדרש מספר טלפון!',
        invalid_type_error: props?.message?.invalid_type_error ?? 'מספר טלפון לא תקין!',
      })
      .min(1, {
        message: props?.message?.required_error ?? 'נדרש מספר טלפון!',
      })
      .refine((data) => props?.isValidPhoneNumber?.(data), {
        message: props?.message?.invalid_type_error ?? 'מספר טלפון לא תקין!',
      }),
  /**
   * Date
   * defaultValue === null
   */
  date: (props) =>
    zod.coerce
      .date()
      .nullable()
      .transform((dateString, ctx) => {
        const date = dayjs(dateString).format();

        const stringToDate = zod.string().pipe(zod.coerce.date());

        if (!dateString) {
          ctx.addIssue({
            code: zod.ZodIssueCode.custom,
            message: props?.message?.required_error ?? 'נדרש תאריך!',
          });
          return null;
        }

        if (!stringToDate.safeParse(date).success) {
          ctx.addIssue({
            code: zod.ZodIssueCode.invalid_date,
            message: props?.message?.invalid_type_error ?? 'תאריך לא תקין!',
          });
        }

        return date;
      })
      .pipe(zod.union([zod.number(), zod.string(), zod.date(), zod.null()])),
  /**
   * Editor
   * defaultValue === '' | <p></p>
   */
  editor: (props) =>
    zod.string().min(8, {
      message: props?.message?.required_error ?? 'נדרש תוכן!',
    }),
  /**
   * Object
   * defaultValue === null
   */
  objectOrNull: (props) =>
    zod.custom().refine((data) => data !== null && data !== '', {
      message: props?.message?.required_error ?? 'שדה חובה!',
    }),
  /**
   * Boolean
   * defaultValue === false
   */
  boolean: (props) =>
    zod.coerce.boolean().refine((bool) => bool === true, {
      message: props?.message?.required_error ?? 'יש לסמן את התיבה!',
    }),
  /**
   * File
   * defaultValue === '' || null
   */
  file: (props) =>
    zod.custom().transform((data, ctx) => {
      const hasFile = data instanceof File || (typeof data === 'string' && !!data.length);

      if (!hasFile) {
        ctx.addIssue({
          code: zod.ZodIssueCode.custom,
          message: props?.message?.required_error ?? 'נדרש קובץ!',
        });
        return null;
      }

      return data;
    }),
  /**
   * Files
   * defaultValue === []
   */
  files: (props) =>
    zod.array(zod.custom()).transform((data, ctx) => {
      const minFiles = props?.minFiles ?? 2;

      if (!data.length) {
        ctx.addIssue({
          code: zod.ZodIssueCode.custom,
          message: props?.message?.required_error ?? 'נדרשים קבצים!',
        });
      } else if (data.length < minFiles) {
        ctx.addIssue({
          code: zod.ZodIssueCode.custom,
          message: `יש להעלות לפחות ${minFiles} קבצים!`,
        });
      }

      return data;
    }),
};
