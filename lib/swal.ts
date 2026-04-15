/**
 * Custom SweetAlert utility — OtakEncer Design System
 * 
 * Semua alert success & error menggunakan warna brand yang konsisten.
 * Jangan gunakan Swal.fire() raw di komponen — gunakan fungsi ini.
 */
import Swal, { type SweetAlertOptions, type SweetAlertResult } from 'sweetalert2';

// Brand palette
const BRAND = {
  primary: '#672cb9',
  primaryDark: '#522199',
  accent: '#FFA515',
  successBg: '#f0fdf4',
  successBorder: '#bbf7d0',
  successIcon: '#22c55e',
  errorBg: '#fef2f2',
  errorBorder: '#fecaca',
  errorIcon: '#ef4444',
  warningBg: '#fffbeb',
  warningBorder: '#fde68a',
  warningIcon: '#f59e0b',
  infoBg: '#eff6ff',
  infoBorder: '#bfdbfe',
  infoIcon: '#3b82f6',
  textDark: '#0f172a',
  textMuted: '#64748b',
};

/**
 * Base styling yang dipakai di semua custom alert
 */
const baseOptions: SweetAlertOptions = {
  buttonsStyling: false,
  customClass: {
    popup: 'oe-swal-popup',
    title: 'oe-swal-title',
    htmlContainer: 'oe-swal-html',
    confirmButton: 'oe-swal-confirm',
    cancelButton: 'oe-swal-cancel',
    timerProgressBar: 'oe-swal-timer',
  },
  showClass: {
    popup: 'animate__animated animate__fadeIn animate__faster',
  },
  hideClass: {
    popup: 'animate__animated animate__fadeOut animate__faster',
  },
};

/**
 * Inject global CSS untuk custom SweetAlert (hanya sekali).
 * Dipanggil otomatis saat module di-import.
 */
function injectSwalStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById('oe-swal-styles')) return;

  const style = document.createElement('style');
  style.id = 'oe-swal-styles';
  style.textContent = `
    .oe-swal-popup {
      font-family: 'Montserrat', sans-serif !important;
      border-radius: 24px !important;
      padding: 2rem 1.5rem !important;
      border: 1px solid rgba(0,0,0,0.05) !important;
      box-shadow: 0 20px 60px rgba(0,0,0,0.12) !important;
      overflow: hidden !important;
    }
    .oe-swal-title {
      font-size: 1.25rem !important;
      font-weight: 800 !important;
      color: ${BRAND.textDark} !important;
      letter-spacing: -0.02em !important;
    }
    .oe-swal-html {
      font-size: 0.875rem !important;
      font-weight: 500 !important;
      color: ${BRAND.textMuted} !important;
      line-height: 1.5 !important;
    }
    .oe-swal-confirm {
      background: ${BRAND.primary} !important;
      color: white !important;
      border: none !important;
      border-radius: 14px !important;
      padding: 0.7rem 2rem !important;
      font-weight: 700 !important;
      font-size: 0.875rem !important;
      font-family: 'Montserrat', sans-serif !important;
      cursor: pointer !important;
      transition: all 0.2s ease !important;
      box-shadow: 0 4px 12px rgba(103,44,185,0.25) !important;
    }
    .oe-swal-confirm:hover {
      background: ${BRAND.primaryDark} !important;
      transform: translateY(-1px) !important;
      box-shadow: 0 6px 16px rgba(103,44,185,0.35) !important;
    }
    .oe-swal-cancel {
      background: transparent !important;
      color: ${BRAND.textMuted} !important;
      border: 2px solid #e2e8f0 !important;
      border-radius: 14px !important;
      padding: 0.7rem 1.6rem !important;
      font-weight: 700 !important;
      font-size: 0.875rem !important;
      font-family: 'Montserrat', sans-serif !important;
      cursor: pointer !important;
      transition: all 0.2s ease !important;
      margin-right: 0.5rem !important;
    }
    .oe-swal-cancel:hover {
      background: #f8fafc !important;
      border-color: #cbd5e1 !important;
    }
    .oe-swal-timer {
      background: ${BRAND.primary} !important;
      height: 4px !important;
      border-radius: 0 0 24px 24px !important;
    }
    /* Override SweetAlert2 icon colors for brand consistency */
    .swal2-icon.swal2-success .swal2-success-ring {
      border-color: rgba(34,197,94,0.25) !important;
    }
    .swal2-icon.swal2-success [class^='swal2-success-line'] {
      background-color: ${BRAND.successIcon} !important;
    }
    .swal2-icon.swal2-error {
      border-color: rgba(239,68,68,0.3) !important;
    }
    .swal2-icon.swal2-error .swal2-x-mark-line-left,
    .swal2-icon.swal2-error .swal2-x-mark-line-right {
      background-color: ${BRAND.errorIcon} !important;
    }
    .swal2-icon.swal2-warning {
      border-color: rgba(245,158,11,0.3) !important;
      color: ${BRAND.warningIcon} !important;
    }
    .swal2-icon.swal2-info {
      border-color: rgba(59,130,246,0.3) !important;
      color: ${BRAND.infoIcon} !important;
    }
  `;
  document.head.appendChild(style);
}

// Auto-inject styles when module loads (client-side only)
injectSwalStyles();

/**
 * Show a SUCCESS alert
 */
export function showSuccess(title: string, text?: string, options?: Record<string, unknown>): Promise<SweetAlertResult> {
  const opts: SweetAlertOptions = {
    ...baseOptions,
    icon: 'success' as const,
    title,
    text,
    timer: 2000,
    showConfirmButton: false,
    timerProgressBar: true,
    ...options,
  };
  return Swal.fire(opts);
}

/**
 * Show an ERROR alert
 */
export function showError(title: string, text?: string, options?: Record<string, unknown>): Promise<SweetAlertResult> {
  const opts: SweetAlertOptions = {
    ...baseOptions,
    icon: 'error' as const,
    title,
    text,
    confirmButtonText: 'Mengerti',
    ...options,
  };
  return Swal.fire(opts);
}

/**
 * Show a WARNING alert
 */
export function showWarning(title: string, text?: string, options?: Record<string, unknown>): Promise<SweetAlertResult> {
  const opts: SweetAlertOptions = {
    ...baseOptions,
    icon: 'warning' as const,
    title,
    text,
    confirmButtonText: 'OK',
    ...options,
  };
  return Swal.fire(opts);
}

/**
 * Show an INFO alert
 */
export function showInfo(title: string, text?: string, options?: Record<string, unknown>): Promise<SweetAlertResult> {
  const opts: SweetAlertOptions = {
    ...baseOptions,
    icon: 'info' as const,
    title,
    text,
    confirmButtonText: 'OK',
    ...options,
  };
  return Swal.fire(opts);
}

/**
 * Show a CONFIRM dialog (with cancel button)
 */
export function showConfirm(title: string, text?: string, options?: Record<string, unknown>): Promise<SweetAlertResult> {
  const opts: SweetAlertOptions = {
    ...baseOptions,
    icon: 'question' as const,
    title,
    text,
    showCancelButton: true,
    confirmButtonText: 'Ya, Lanjutkan',
    cancelButtonText: 'Batal',
    reverseButtons: true,
    ...options,
  };
  return Swal.fire(opts);
}

/**
 * Show a SUCCESS toast (auto-close, non-intrusive)
 */
export function showSuccessToast(title: string, text?: string): Promise<SweetAlertResult> {
  const opts: SweetAlertOptions = {
    ...baseOptions,
    icon: 'success' as const,
    title,
    text,
    timer: 1800,
    showConfirmButton: false,
    timerProgressBar: true,
  };
  return Swal.fire(opts);
}
