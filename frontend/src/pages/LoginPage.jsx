import React from 'react';
import {
  Flex,
  Box,
  Heading,
  Input,
  Button,
  FormControl,
  FormLabel,
  FormHelperText,
  Text,
  Link,
  VStack,
  useToast,
} from '@chakra-ui/react';

const LoginPage = () => {
  const toast = useToast();

  const handleLogin = (e) => {
    e.preventDefault();
    // Dummy login logic
    toast({
      title: 'Logged in!',
      description: 'You have successfully logged in.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Flex minH="100vh" minW="100vw" align="center" justify="center" bg="gray.50">
      <Box
        bg="white"
        p={8}
        rounded="md"
        shadow="md"
        w={{ base: '90%', sm: '400px' }}
      >
        <VStack spacing={4} as="form" onSubmit={handleLogin}>
          <Heading as="h2" size="lg" textAlign="center">
            Welcome Back
          </Heading>

          <FormControl id="email" isRequired>
            <FormLabel>Email address</FormLabel>
            <Input type="email" placeholder="you@example.com" />
            <FormHelperText>We'll never share your email.</FormHelperText>
          </FormControl>

          <FormControl id="password" isRequired>
            <FormLabel>Password</FormLabel>
            <Input type="password" placeholder="********" />
          </FormControl>

          <Button colorScheme="blue" type="submit" width="full">
            Log In
          </Button>

          <Flex justify="space-between" width="100%" fontSize="sm">
            <Link color="blue.500">Forgot password?</Link>
            <Text>
              New here? <Link color="blue.500" href="/signup">Sign Up</Link>
            </Text>
          </Flex>
        </VStack>
      </Box>
    </Flex>
  );
};

export default LoginPage;
