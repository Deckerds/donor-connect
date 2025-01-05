import React, { FC } from "react";
import {
  DialogActionTrigger,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from "./ui/dialog";
import { Text } from "@chakra-ui/react";
import { Button } from "./ui/button";

interface IConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  cancel: () => void;
  confirm: () => void;
  submitBtn?: boolean;
  removeCancel?: boolean;
  titleColor?: string;
  btnName?: string;
}

const ConfirmDialog: FC<IConfirmDialogProps> = ({
  open,
  title,
  message,
  cancel,
  confirm,
  submitBtn,
  btnName = "Confirm",
  removeCancel,
  titleColor = "black",
}) => {
  return (
    <DialogRoot
      role="alertdialog"
      lazyMount
      open={open}
      placement="center"
      size={{ base: "xs", md: "md" }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle color={titleColor}>{title}</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <Text fontSize="lg">{message}</Text>
        </DialogBody>
        <DialogFooter>
          {!removeCancel && (
            <DialogActionTrigger asChild>
              <Button onClick={cancel} variant="outline">
                Cancel
              </Button>
            </DialogActionTrigger>
          )}
          <Button
            onClick={() => confirm()}
            colorPalette={submitBtn ? "brand" : "red"}
          >
            {submitBtn ? btnName : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};

export default ConfirmDialog;
