export interface ModalPropsShared {
  isOpen: boolean;
  title?: string;
  description?: string;
  closeModal: (isOpen: boolean) => void;
}
