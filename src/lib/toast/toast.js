import { toast } from 'react-toastify';

export const showErrorToast = (message) => {
  toast.error(message, {
    autoClose: 5000,
    closeOnClick: true,
    draggable: true,
    hideProgressBar: false,
    pauseOnHover: true,
    position: 'bottom-right',
    progress: undefined,
    theme: 'colored',
  });
};

export const showSuccessToast = (message) => {
  toast.success(message, {
    autoClose: 5000,
    closeOnClick: true,
    draggable: true,
    hideProgressBar: false,
    pauseOnHover: true,
    position: 'bottom-right',
    progress: undefined,
    theme: 'colored',
  });
};
