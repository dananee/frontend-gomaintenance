import { create } from 'zustand';
import { toast } from 'sonner';

interface ToastStore {
    showSuccess: (message: string) => void;
    showError: (message: string) => void;
    showInfo: (message: string) => void;
    showLoading: (message: string) => string | number;
    dismissToast: (id: string | number) => void;
}

export const useToast = create<ToastStore>(() => ({
    showSuccess: (message: string) => {
        toast.success(message, {
            duration: 3000,
            className: 'bg-green-50 border-green-200 text-green-900',
        });
    },
    showError: (message: string) => {
        toast.error(message, {
            duration: 5000,
            className: 'bg-red-50 border-red-200 text-red-900',
        });
    },
    showInfo: (message: string) => {
        toast.info(message, {
            duration: 3000,
            className: 'bg-blue-50 border-blue-200 text-blue-900',
        });
    },
    showLoading: (message: string) => {
        return toast.loading(message, {
            className: 'bg-gray-50 border-gray-200 text-gray-900',
        });
    },
    dismissToast: (id: string | number) => {
        toast.dismiss(id);
    },
}));
