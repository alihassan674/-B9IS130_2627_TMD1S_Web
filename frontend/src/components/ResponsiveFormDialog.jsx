import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

function ResponsiveFormDialog({
    open,
    title,
    onClose,
    children,
    onRequestCloseReady,
}) {
    const dialogRef = useRef(null)

    const requestCloseRef = useRef(null)
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)



    useEffect(() => {
        if (!open) {
            setHasUnsavedChanges(false)
            return
        }

        setHasUnsavedChanges(false)

        const dialog = dialogRef.current
        const previousFocus = document.activeElement
        const previousOverflow = document.body.style.overflow

        document.body.style.overflow = 'hidden'
        dialog?.showModal()

        const handleCancel = (event) => {
            event.preventDefault()
            requestCloseRef.current?.()
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

    useEffect(() => {
        if (!open || !onRequestCloseReady) return

        onRequestCloseReady(() => requestCloseRef.current?.())

        return () => {
            onRequestCloseReady(null)
        }
    }, [open, onRequestCloseReady])

    if (!open) return null

    const handleBackdropClick = (event) => {
        if (event.target === dialogRef.current) {
            handleRequestClose()
        }
    }

    const handleFormChange = () => {
        setHasUnsavedChanges(true)
    }

    const handleRequestClose = () => {
        if (hasUnsavedChanges) {
            const confirmed = window.confirm(
                'You have unsaved changes. Discard them?'
            )

            if (!confirmed) return
        }

        onClose?.()
    }

    requestCloseRef.current = handleRequestClose
    // The parent can use this handler for its own Cancel button.


    return createPortal(
        <dialog
            ref={dialogRef}
            className="responsive-form-dialog"
            aria-label={title}
            onClick={handleBackdropClick}
            onChange={handleFormChange}
            onInput={handleFormChange}
        >
            <div className="responsive-form-dialog-content">
                <div className="responsive-form-dialog-toolbar">
                    <span>{title}</span>

                    <button
                        type="button"
                        className="responsive-form-dialog-close"
                        onClick={handleRequestClose}
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
