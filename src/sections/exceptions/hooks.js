
import { apiInfoStudents } from "src/actions/info_students";
import { descriptionColumns, getDesc } from "../insert/functions";
import { apiInfoColumns } from "src/actions/info_columns";
import { Avatar, Box, Chip } from "@mui/material";
import { Iconify } from "src/components/iconify";
import { inHebrew } from "src/utils/hebrew/getter";
import { toast } from "sonner";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { apiExceptions, exceptionsUpdate } from "src/actions/exceptions";
import { exceptionsByReduce, mergeWithStudents } from "./utils";
import { useCallback } from "react";

  export function useExceptions() {
    // מידע על תלמידים לצורך ההצגה של השמות בטבלה
    const infoStudents = useSuspenseQuery(apiInfoStudents());
    // בקשה של האישורים של התלמידים
    const api_exceptions = useSuspenseQuery(apiExceptions());
    // מידע על העמודות לצורך הצגה של השמות בטבלה
    const infoColumns = useSuspenseQuery(apiInfoColumns())
    // מיזוג המידע של האישורים עם שמות התלמידים
    const exceptionWithStudent = mergeWithStudents(infoStudents.data, api_exceptions.data, infoColumns.data);
    // ארגון מחדש של האישורים לפי תלמידים
    const exceptions = exceptionsByReduce(exceptionWithStudent);
    // 
    const queryClient = useQueryClient();
    // פונקציית העידכון של הנתונים על התלמידים
    const mutate = useMutation(exceptionsUpdate({ queryClient }))
    // פונקציית המחיקה של התלמידים
    const submitDelete = useCallback(async (data) => {
      try {
        console.log('to delete: ', data)
        // מימוש פונקציית העידכון עם המזהי תלמידים הדורשים מחיקה
        const promise = mutate.mutateAsync({ data: data, mode: 'delete' })

        // הצגה של הודעה על מצב המחיקה
        toast.promise(promise, {
          loading: 'מחיקה...',
          success: 'המחיקה הצליחה!',
          error: 'המחיקה נכשלה!',
        });
        // המתנה לסיום פעולת המחיקה
        await promise;
      } catch (error) {
        console.error('Submission error:', error);
        // הצגה של הודעת שגיאה במקרה שהמחיקה נכשלה
        toast.error('שגיאה בשליחת הטופס');
      }
    }, [mutate]);

    return {
      submitDelete,
      exceptions
    }

  }
