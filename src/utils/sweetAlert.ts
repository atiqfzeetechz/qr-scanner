import Swal from 'sweetalert2';
import { theme } from '../theme';

// Add dynamic styles for SweetAlert buttons
const addDynamicStyles = () => {
  const styleId = 'swal-dynamic-styles';
  if (document.getElementById(styleId)) return;
  
  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = `
    .swal2-confirm {
      background: ${theme.gradients.primary} !important;
    }
    .swal2-cancel {
      background: ${theme.gradients.primary} !important;
    }
  `;
  document.head.appendChild(style);
};

const baseConfig = {
  customClass: {
    popup: 'rounded-xl shadow-2xl',
    title: 'text-gray-900 font-bold text-xl',
    content: 'text-gray-600',
    confirmButton: 'px-6 py-3 rounded-lg font-medium text-white shadow-lg hover:shadow-xl transition-all duration-200 mr-3',
    cancelButton: 'px-6 py-3 rounded-lg font-medium text-white transition-all duration-200',
    actions: 'gap-3',
  },
  buttonsStyling: false,
  reverseButtons: true,
  didOpen: () => addDynamicStyles(),
};

export const showSuccess = (title: string, text?: string) => {
  return Swal.fire({
    ...baseConfig,
    icon: 'success',
    title,
    text,
    confirmButtonText: 'OK',
    iconColor: theme.colors.success,
    customClass: {
      ...baseConfig.customClass,
      confirmButton: `${baseConfig.customClass.confirmButton}`,
    },
  });
};

export const showError = (title: string, text?: string) => {
  return Swal.fire({
    ...baseConfig,
    icon: 'error',
    title,
    text,
    confirmButtonText: 'OK',
    iconColor: theme.colors.error,
    customClass: {
      ...baseConfig.customClass,
      confirmButton: `${baseConfig.customClass.confirmButton}`,
    },
  });
};

export const showConfirm = (
  title: string,
  text?: string,
  confirmText: string = 'Yes, do it!',
  cancelText: string = 'Cancel'
) => {
  return Swal.fire({
    ...baseConfig,
    icon: 'question',
    title,
    text,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    iconColor: theme.colors.primary.main,
    customClass: {
      ...baseConfig.customClass,
      confirmButton: `${baseConfig.customClass.confirmButton}`,
      cancelButton: `${baseConfig.customClass.cancelButton}`,
      icon: 'border-red-500 text-red-500',
    },
  });
};

export const showDeleteConfirm = (itemName?: string) => {
  return Swal.fire({
    ...baseConfig,
    icon: 'warning',
    title: 'Are you sure?',
    text: itemName ? `You won't be able to recover ${itemName}!` : "You won't be able to recover this!",
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel',
    iconColor: theme.colors.error,
    customClass: {
      ...baseConfig.customClass,
      confirmButton: `${baseConfig.customClass.confirmButton}`,
    },
  });
};

export const showInputDialog = (
  title: string,
  inputLabel: string,
  inputValue: string = '',
  confirmText: string = 'Save',
  cancelText: string = 'Cancel'
) => {
  return Swal.fire({
    ...baseConfig,
    title,
    input: 'text',
    inputLabel,
    inputValue,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    inputValidator: (value) => {
      if (!value) {
        return 'Please enter a value!'
      }
    },
    customClass: {
      ...baseConfig.customClass,
      confirmButton: `${baseConfig.customClass.confirmButton}`,
      cancelButton: `${baseConfig.customClass.cancelButton}`,
    },
  });
};
export const showToast = (
  icon: 'success' | 'error' | 'warning' | 'info',
  title: string
) => {
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  });

  return Toast.fire({ icon, title });
}