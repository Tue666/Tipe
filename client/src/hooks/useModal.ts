import { useAppDispatch } from '@/redux/hooks';
import { ModalState, disappearModal, renderModal } from '@/redux/slices/modal.slice';

const useModal = () => {
  const dispatch = useAppDispatch();
  const openModal = (state: Partial<ModalState> = {}) => {
    const { params, ...rest } = state;
    const renderState: ModalState = {
      isOpen: true,
      key: 'default',
      params: {
        beClosed: true,
        ...params,
      },
      ...rest,
    };
    dispatch(renderModal(renderState));
  };
  const closeModal = () => {
    dispatch(disappearModal());
  };
  return { openModal, closeModal };
};

export default useModal;
