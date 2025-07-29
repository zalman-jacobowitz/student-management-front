import { toast } from "sonner";

interface UpdateParams {
  data: any;
  mode: string;
  mutateAsync: ({data, mode}: {data: any, mode: string}) => Promise<any>;
}

export async function updateData({data, mode, mutateAsync}: UpdateParams) {
    const promise = mutateAsync({data, mode});
    console.log('promise:', data);
    try {
        toast.promise(promise, {
            loading: 'מעדכן...',
            success: 'העדכון הצליח!',
            error: 'העידכון נכשל!',
        });
        await promise;
    } catch (error) {
        console.log(error);
        // removed console.error(error);
    }
}
