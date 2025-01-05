import React, { FC, ReactNode } from 'react';
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from '../components/ui/dialog';

interface IViewModalProps {
  open: boolean;
  title: string;
  body: ReactNode;
  close: () => void;
}

const ViewModal: FC<IViewModalProps> = ({ open, close, body, title }) => {
  return (
    <DialogRoot
      lazyMount
      open={open}
      placement="center"
      size={{ base: 'xs', md: 'md' }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <DialogBody>{body}</DialogBody>
        <DialogCloseTrigger onClick={close} />
      </DialogContent>
    </DialogRoot>
  );
};

export default ViewModal;
