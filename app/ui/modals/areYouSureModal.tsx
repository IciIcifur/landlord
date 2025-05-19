import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/modal';
import { Button } from '@heroui/button';

export default function AreYouSureModal({
  header,
  description,
  buttonTitle,
  onSubmit,
  isOpen,
  onOpenChange,
}: {
  header: string;
  description?: string;
  buttonTitle?: string;
  onSubmit: () => void;
  isOpen: boolean;
  onOpenChange: (change: boolean) => void;
}) {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalHeader className="pr-10">{header}</ModalHeader>
        <ModalBody>
          <p>{description}</p>
        </ModalBody>
        <ModalFooter className="flex w-full justify-between gap-2">
          <Button size="md">Отмена</Button>
          <Button onPress={onSubmit} size="md" color="danger" variant="solid">
            {buttonTitle || 'Удалить'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
