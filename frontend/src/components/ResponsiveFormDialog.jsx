
import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

function ResponsiveFormDialog({
    open,
    title,
    onClose,
    children,
}) {
    const dialogRef = useRef(null)
    const closeRef = useRef(onClose)

    useEffect(() => {
        closeRef.current = onClose
    }, [onClose])

    useEffect(() => {
        if (!open) return

        const dialog = dialogRef.current
        const previousFocus = document.activeElement
        const previousOverflow = document.body.style.overflow

        document.body.style.overflow = 'hidden'
        dialog?.showModal()

        const handleCancel = (event) => {
            event.preventDefault()
            closeRef.current?.()
        }

        dialog?.addEventListener('cancel', handleCancel)

        return () => {
            dialog?.removeEventListener('cancel', handleCancel)
            dialog?.close()
            document.body.style.overflow = previousOverflow

            if (previousFocus?.isConnected) {
                previousFocus.focus()
            }
        }
    }, [open])

    if (!open) return null

    const handleBackdropClick = (event) => {
        if (event.target === dialogRef.current) {
            onClose?.()
        }
    }

    return createPortal(
        <dialog
            ref={dialogRef}
            className="responsive-form-dialog"
            aria-label={title}
            onClick={handleBackdropClick}
        >
            <div className="responsive-form-dialog-content">
                <div className="responsive-form-dialog-toolbar">
                    <span>{title}</span>

                    <button
                        type="button"
                        className="responsive-form-dialog-close"
                        onClick={onClose}
                        aria-label="Close form"
                    >
                        ×
                    </button>
                </div>

                <div className="responsive-form-dialog-body">
                    {children}
                </div>
            </div>
        </dialog>,
        document.body
    )
}

export default ResponsiveFormDialog
