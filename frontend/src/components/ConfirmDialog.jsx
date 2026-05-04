import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
  DialogCloseTrigger,
  DialogBackdrop,
  DialogPositioner,
} from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, description }) => {
  return (
    <DialogRoot 
      open={isOpen} 
      onOpenChange={(e) => !e.open && onClose()} 
      role="alertdialog"
      motionPreset="slide-in-bottom"
    >
      <DialogBackdrop />
      
      <DialogPositioner>
        <DialogContent 
          bg="white"
          p={4}
          borderRadius="xl"
          shadow="xl"
          maxW="md"
        >
          <DialogHeader>
            <DialogTitle fontWeight="bold" fontSize="lg">{title}</DialogTitle>
          </DialogHeader>

          <DialogBody>
            {description}
          </DialogBody>

          <DialogFooter gap={3}>
            <Button variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              colorPalette="red"
              onClick={() => {
                onConfirm();
                onClose();
              }}
            >
              Confirmar
            </Button>
          </DialogFooter>

          <DialogCloseTrigger />
        </DialogContent>
      </DialogPositioner>
    </DialogRoot>
  );
};

export { ConfirmDialog };