import { useEffect, useRef } from "react";
import { ModalProps } from "../../types/modal";
import styles from "./Modal.module.scss";
import { getFocusableElements } from "../../utils/focus";

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  const modalRef = useRef<HTMLDivElement>(null); // Creates a ref that can be attached to the modal container; will either be a DOM element or null

  const handleKeyDown = (e: KeyboardEvent) => {
    // Declares a function to handle keyboard input
    // Function will be registered to the document via addEventListener

    if (!isOpen) return; // If the modal is not open, we ignore all key presses

    if (e.key === "Escape") {
      console.log("Pressed: ", e.key);
      onClose();
    } // If the user presses Escape, the modal closes via onClose()

    if (e.key === "Tab" && modalRef.current) {
      // If Tab is pressed and the modal is mounted, we find all focusable elements inside the modal
      const focusableEls = getFocusableElements(modalRef.current);
      // Identify the first and last focusable elements
      const firstEl = focusableEls[0];
      const lastEl = focusableEls[focusableEls.length - 1];

      if (focusableEls.length === 0) return;

      // If the user is Shift+Tabbing on the first element
      if (e.shiftKey) {
        if (document.activeElement === firstEl) {
          e.preventDefault(); // Prevent default tabbing (which would move focus outside the modal)
          lastEl?.focus(); // Manually move focus to the last element (loop around)
        }
      } else {
        // If the user is Tabbing forward
        if (document.activeElement === lastEl) {
          e.preventDefault(); // Prevent default
          firstEl?.focus(); // Loop back to the first focusable element
        }
      }
    }
  };
  // React hook that runs when isOpen or onClose change
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown); // Registers the keyboard event when the modal is shown; adds the listener to the global document

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    }; // Removes the listener when the modal closes or component unmounts
  }, [isOpen, onClose]);

  if (!isOpen) return null; // Ensures that the modal DOM doesn't exist when it's closed

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
