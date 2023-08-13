import { forwardRef } from 'react';
import { Dialog, Slide } from '@mui/material';
import { useAppSelector } from '@/redux/hooks';
import { ModalParams, selectModal } from '@/redux/slices/modal.slice';
import useModal from '@/hooks/useModal';
import { Authentication } from './authentication';

const components = {
  default: () => null,
  authentication: (params: ModalParams) => <Authentication {...params} />,
};

export type ModalKey = keyof typeof components;

// const Transition = forwardRef(function Transition(props, ref) {
// 	return <Slide direction="up" ref={ref} {...props} />;
// });

const Modal = () => {
  const { isOpen, key, params } = useAppSelector(selectModal);
  const { closeModal } = useModal();
  return (
    <Dialog
      open={isOpen}
      onClose={() => params.beClosed && closeModal()}
      // TransitionComponent={Transition}
      maxWidth={false}
    >
      {components[key](params)}
    </Dialog>
  );
};

export default Modal;
