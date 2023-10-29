import { Dialog } from '@mui/material';
import { useAppSelector } from '@/redux/hooks';
import { ModalParams, selectModal } from '@/redux/slices/modal.slice';
import useModal from '@/hooks/useModal';
import { Authentication } from './authentication';
import AppPromotion from './cart/AppPromotion.component';
import CancelOrder from './customer/order/CancelOrder.component';

const components = {
  default: () => null,
  authentication: (params: ModalParams) => <Authentication {...params} />,
  appPromotion: () => <AppPromotion />,
  cancelOrder: (params: ModalParams) => <CancelOrder {...params} />,
};

export type ModalKey = keyof typeof components;

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
