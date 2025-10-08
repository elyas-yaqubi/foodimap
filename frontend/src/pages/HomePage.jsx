import React, { useState } from 'react';
import {
  ChakraProvider,
  Box,
  Button,
  Heading,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
  FormControl,
  FormLabel,
  Textarea,
  Image,
  VStack,
  Select,
} from '@chakra-ui/react';

function App() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState('');
  const [postType, setPostType] = useState('Review');

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const handlePost = () => {
    // Simulate post submission
    console.log({ postType, image, caption });
    onClose();
    setImage(null);
    setCaption('');
    setPostType('Review');
  };

  return (
    <ChakraProvider>
      <Box bg="gray.50" minH="100vh" p={6}>
        <Box maxW="600px" mx="auto">
          <Heading mb={6}>foodimap</Heading>

          <Button colorScheme="blue" onClick={onOpen}>
            Post
          </Button>

          {/* Modal for posting */}
          <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Create a Post</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <VStack spacing={4}>
                  {/* Dropdown for post type */}
                  <FormControl>
                    <FormLabel>Post Type</FormLabel>
                    <Select
                      value={postType}
                      onChange={(e) => setPostType(e.target.value)}
                    >
                      <option value="Review">Review</option>
                      <option value="Recipe">Recipe</option>
                    </Select>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Upload Image</FormLabel>
                    <Input type="file" accept="image/*" onChange={handleImageUpload} />
                  </FormControl>

                  {image && <Image src={image} alt="Preview" maxH="200px" borderRadius="md" />}

                  <FormControl>
                    <FormLabel>Caption</FormLabel>
                    <Textarea
                      placeholder="Write a caption..."
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                    />
                  </FormControl>
                </VStack>
              </ModalBody>

              <ModalFooter>
                <Button onClick={onClose} mr={3}>
                  Cancel
                </Button>
                <Button colorScheme="blue" onClick={handlePost}>
                  Post
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Box>
      </Box>
    </ChakraProvider>
  );
}

export default App;
