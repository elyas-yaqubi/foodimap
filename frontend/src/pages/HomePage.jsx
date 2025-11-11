import React, { useState, useEffect } from 'react';
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
  SimpleGrid,
  Card,
  CardBody,
  Text,
  HStack,
  Avatar,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Flex,
  Grid
} from '@chakra-ui/react';
import { Clock } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const backendApiUrl = import.meta.env.VITE_BACKEND_API_URL;

function HomePage() {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [caption, setCaption] = useState('');
  const [postType, setPostType] = useState('Review');

  // --- Dummy posts for initial display ---
  const dummyPosts = [
    {
      id: 1,
      userName: 'Jon Doe',
      imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836',
      caption: 'Amazing sushi platter from Tokyo Sushi!',
      timestamp: new Date(Date.now() - 3600 * 1000 * 2),
      userAvatar: '',
    },
    {
      id: 2,
      userName: 'Jane Smith',
      imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836',
      caption: 'Tried making a vegan burger recipe--its a hit!!',
      timestamp: new Date(Date.now() - 3600 * 1000 * 5),
      userAvatar: '',
    },
    {
      id: 3,
      userName: 'June Parker',
      imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836',
      caption: 'BBQ night with friends!!',
      timestamp: new Date(Date.now() - 86400 * 1000),
      userAvatar: '',
    },
  ];

  const [posts, setPosts] = useState(dummyPosts);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch posts from backend
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${backendApiUrl}/api/posts`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const postsWithDates = response.data.map(post => ({
          ...post,
          timestamp: new Date(post.timestamp),
        }));
        setPosts(postsWithDates);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handlePost = async () => {
    if (!imageFile || !caption) {
      alert('Please upload an image and write a caption.');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('caption', caption);
      formData.append('postType', postType);
      const response = await axios.post(`${backendApiUrl}/api/posts`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const newPost = {
        ...response.data,
        timestamp: new Date(response.data.timestamp || Date.now()),
      };
      setPosts([newPost, ...posts]);
      onClose();
      setImageFile(null);
      setImagePreview(null);
      setCaption('');
      setPostType('Review');
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Failed to upload post. Please try again.');
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${backendApiUrl}/api/auth/logout`);
      localStorage.removeItem('token');
      navigate('/login');
    } catch (error) {
      console.error(error);
    }
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = Math.floor((now - timestamp) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return timestamp.toLocaleDateString();
  };

  return (
    <ChakraProvider>
      <Box bg="gray.50" minH="100vh">
        <Grid templateColumns={{ base: '1fr', lg: '250px 1fr' }} h="100vh">

          {/* Fixed Sidebar */}
          <Box
            position="fixed"
            left="0"
            top="0"
            w={{ base: '100%', lg: '250px' }}
            h="100vh"
            bg="white"
            boxShadow="md"
            borderRight="1px solid"
            borderColor="gray.200"
            p={6}
            zIndex={10}
          >
            <VStack align="stretch" spacing={6}>
              <Heading size="md" textAlign="center">foodimap</Heading>
              <Button colorScheme="blue" onClick={onOpen}>
                Create Post
              </Button>
              <Button colorScheme="red" onClick={handleLogout}>
                Logout
              </Button>
            </VStack>
          </Box>

          {/* Scrollable Feed */}
          <Box
            ml={{ base: 0, lg: '250px' }}
            h="100vh"
            overflowY="auto"
            p={6}
          >
            <Heading size="lg" color="gray.700" mb={6} textAlign="center">
              Food Reviews
            </Heading>

            {loading && (
              <Flex justify="center" align="center" minH="400px">
                <VStack spacing={4}>
                  <Spinner size="xl" color="orange.500" thickness="4px" />
                  <Text color="gray.600">Loading delicious posts...</Text>
                </VStack>
              </Flex>
            )}

            {error && (
              <Alert status="error" borderRadius="md">
                <AlertIcon />
                <Box>
                  <AlertTitle>Error loading posts</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Box>
              </Alert>
            )}

            {!loading && !error && posts.length === 0 && (
              <Flex justify="center" align="center" minH="400px">
                <VStack spacing={2}>
                  <Text color="gray.500" fontSize="xl" fontWeight="medium">
                    No posts yet
                  </Text>
                  <Text color="gray.400" fontSize="sm">
                    Be the first to share a food review!
                  </Text>
                </VStack>
              </Flex>
            )}

            {!loading && !error && posts.length > 0 && (
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                {posts.map((post) => (
                  <Card
                    key={post.id}
                    overflow="hidden"
                    borderRadius="lg"
                    boxShadow="md"
                    _hover={{ transform: 'translateY(-4px)', boxShadow: 'xl' }}
                    transition="all 0.2s"
                  >
                    <Image src={post.imageUrl} alt={post.caption} objectFit="cover" h="250px" w="100%" />
                    <CardBody>
                      <VStack align="stretch" spacing={3}>
                        <HStack spacing={3}>
                          <Avatar size="sm" name={post.userName} src={post.userAvatar} />
                          <VStack align="start" spacing={0} flex={1}>
                            <Text fontWeight="bold" fontSize="sm" color="gray.700">
                              {post.userName}
                            </Text>
                            <HStack spacing={1} color="gray.500" fontSize="xs">
                              <Clock size={12} />
                              <Text>{getTimeAgo(post.timestamp)}</Text>
                            </HStack>
                          </VStack>
                        </HStack>
                        <Text fontSize="sm" color="gray.600" noOfLines={3} lineHeight="1.5">
                          {post.caption}
                        </Text>
                      </VStack>
                    </CardBody>
                  </Card>
                ))}
              </SimpleGrid>
            )}
          </Box>
        </Grid>
      </Box>

      {/* Modal for Creating Post */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create a Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Post Type</FormLabel>
                <Select value={postType} onChange={(e) => setPostType(e.target.value)}>
                  <option value="Review">Review</option>
                  <option value="Recipe">Recipe</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Upload Image</FormLabel>
                <Input type="file" accept="image/*" onChange={handleImageUpload} />
              </FormControl>

              {imagePreview && (
                <Image src={imagePreview} alt="Preview" maxH="200px" borderRadius="md" />
              )}

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
            <Button onClick={onClose} mr={3}>Cancel</Button>
            <Button colorScheme="blue" onClick={handlePost}>Post</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </ChakraProvider>
  );
}

export default HomePage;
