export interface ModalState {
  modalToBeOpen: string,
  modalToBeClosed: string
}

export const initialState: ModalState = {
  modalToBeOpen: "",
  modalToBeClosed: ""
}