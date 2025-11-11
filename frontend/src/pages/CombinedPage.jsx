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
    Container,
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
    Flex
} from '@chakra-ui/react';
import { Clock } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const backendApiUrl = import.meta.env.VITE_BACKEND_API_URL;

function CombinedPage() {
    const navigate = useNavigate();

    // --- Modal for new post ---
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [caption, setCaption] = useState('');
    const [postType, setPostType] = useState('Review');

    // --- Feed states ---
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await axios.get(`${backendApiUrl}/api/post`, {
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

    const handleImageUpload = (e) => { //Handle image upload to backend
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handlePost = async () => {
        if (!image || !caption) {
            alert('Please upload an image and write a caption.');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('image', image);
            formData.append('caption', caption);
            formData.append('postType', postType);

            const response = await axios.post(`${backendApiUrl}/api/post`, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                // withCredentials: true, // enable only if you use cookie auth
            });

            const newPost = {
                ...response.data,
                timestamp: new Date(response.data.timestamp ?? response.data.createdAt ?? Date.now()),
            };

            setPosts(prev => [newPost, ...prev]);
            onClose();
            if (imagePreview) URL.revokeObjectURL(imagePreview);
            setImage(null);
            setImagePreview(null);
            setCaption('');
            setPostType('Review');
        } catch (err) {
            console.error('Upload failed:', err);
            console.error('server body:', err.response?.data);
            alert(err.response?.data?.error || err.response?.data || err.message || 'Failed to upload post.');
        }
    };

    const handleLogout = async () => {
        try {
            const response = await axios.post(`${backendApiUrl}/api/auth/logout`);
            console.log(response.data);
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
            <Box bg="gray.50" minH="100vh" p={6}>
                <Container maxW="container.xl">
                    <VStack spacing={8}>

                        {/* Header */}
                        <Heading>foodimap</Heading>

                        {/* Action buttons */}
                        <HStack spacing={4}>
                            <Button colorScheme="blue" onClick={onOpen}>
                                Create Post
                            </Button>
                            <Button colorScheme="red" onClick={handleLogout}>
                                Logout
                            </Button>
                        </HStack>

                        {/* Feed Section */}
                        <Heading size="lg" color="gray.700" textAlign="center">
                            Food Reviews
                        </Heading>

                        {/* Loading State */}
                        {loading && (
                            <Flex justify="center" align="center" minH="400px">
                                <VStack spacing={4}>
                                    <Spinner size="xl" color="orange.500" thickness="4px" />
                                    <Text color="gray.600">Loading delicious posts...</Text>
                                </VStack>
                            </Flex>
                        )}

                        {/* Error State */}
                        {error && (
                            <Alert status="error" borderRadius="md">
                                <AlertIcon />
                                <Box>
                                    <AlertTitle>Error loading posts</AlertTitle>
                                    <AlertDescription>{error}</AlertDescription>
                                </Box>
                            </Alert>
                        )}

                        {/* Empty State */}
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

                        {/* Posts Grid */}
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
                    </VStack>
                </Container>
            </Box>

            {/* --- Modal for creating new post --- */}
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

                            {imagePreview && <Image src={imagePreview} alt="Preview" maxH="200px" borderRadius="md" />}

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

export default CombinedPage;