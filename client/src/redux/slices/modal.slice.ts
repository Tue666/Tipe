import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ModalKey } from '@/components/Modal.component';
import { RootState } from '../store';

export interface ModalParams {
  beClosed: boolean;
  props?: {
    [K: string]: any;
  };
}

export interface ModalState {
  isOpen: boolean;
  key: ModalKey;
  params: ModalParams;
}

const initialState: ModalState = {
  isOpen: false,
  key: 'default',
  params: {
    beClosed: true,
  },
};

export const slice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    renderModal: (state: ModalState, action: PayloadAction<ModalState>) => {
      const { isOpen, key, params } = action.payload;
      state.isOpen = isOpen;
      state.key = key;
      state.params = params;
    },
    disappearModal: (state: ModalState) => {
      const { isOpen, key, params } = initialState;
      state.isOpen = isOpen;
      state.key = key;
      state.params = params;
    },
  },
});

const { reducer, actions } = slice;
export const { renderModal, disappearModal } = actions;
export const selectModal = (state: RootState) => state.modal;
export default reducer;
