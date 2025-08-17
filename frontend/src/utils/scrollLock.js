let lockCount = 0;

export function lockBodyScroll() {
  if (typeof document === 'undefined') return;
  if (lockCount === 0) {
    // keep previous overflow to restore accurately
    document.body.dataset.prevOverflow = document.body.style.overflow || '';
    document.body.style.overflow = 'hidden';
  }
  lockCount++;
}

export function unlockBodyScroll() {
  if (typeof document === 'undefined') return;
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount === 0) {
    const prev = document.body.dataset.prevOverflow || '';
    document.body.style.overflow = prev;
    delete document.body.dataset.prevOverflow;
  }
}