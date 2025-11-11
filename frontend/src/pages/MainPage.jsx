import React, { useState, useEffect } from 'react';
import {
  ChakraProvider,
  Box,
  Container,
  Heading,
  SimpleGrid,
  Card,
  CardBody,
  Image,
  Text,
  VStack,
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

const FoodReviewHome = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/posts'); //To be replace with backend endpoint

        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }

        const data = await response.json();

        const postsWithDates = data.map(post => ({
          ...post,
          timestamp: new Date(post.timestamp)
        }));

        setPosts(postsWithDates);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

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
      <Box bg="gray.50" minH="100vh" py={8}>
        <Container maxW="container.xl">
          <VStack spacing={8} align="stretch">
            {/* Header */}
            <Heading size="2xl" color="gray.800" textAlign="center">
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
                    transition="transform 0.2s, box-shadow 0.2s"
                    _hover={{
                      transform: 'translateY(-4px)',
                      boxShadow: 'xl'
                    }}
                    cursor="pointer"
                  >
                    {/* Post Image */}
                    <Image
                      src={post.imageUrl}
                      alt={post.caption}
                      objectFit="cover"
                      h="250px"
                      w="100%"
                    />

                    <CardBody>
                      <VStack align="stretch" spacing={3}>
                        {/* User Info */}
                        <HStack spacing={3}>
                          <Avatar
                            size="sm"
                            name={post.userName}
                            src={post.userAvatar}
                          />
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

                        {/* Caption */}
                        <Text
                          fontSize="sm"
                          color="gray.600"
                          noOfLines={3}
                          lineHeight="1.5"
                        >
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
    </ChakraProvider>
  );
};

export default FoodReviewHome;