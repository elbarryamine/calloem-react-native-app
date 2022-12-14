import React from 'react';
import {Button, Heading, Modal, Text} from 'native-base';

export default function ModalNotSaved({
  isOpen,
  onClose,
  onSure,
}: ModalNotSavedProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full">
      <Modal.Content w="95%">
        <Modal.CloseButton />
        <Modal.Header>
          <Heading color="primary">Changes will be lost</Heading>
        </Modal.Header>
        <Modal.Body>
          <Text>
            You have some unsaved data, Are you sure you want to leave ?
          </Text>
        </Modal.Body>
        <Modal.Footer>
          <Button.Group space={2}>
            <Button variant="ghost" colorScheme="blueGray" onPress={onSure}>
              Yes i am sure
            </Button>
            <Button onPress={onClose} bg="primary">
              <Text color="invert">Continue Editing</Text>
            </Button>
          </Button.Group>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
}

interface ModalNotSavedProps {
  isOpen: boolean;
  onClose: () => void;
  onSure: () => void;
}
