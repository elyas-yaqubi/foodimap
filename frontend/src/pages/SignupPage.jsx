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
  VStack,
  useToast,
  Text,
  Link,
} from '@chakra-ui/react';

const SignupPage = () => {
  const toast = useToast();

  const handleSignup = (e) => {
    e.preventDefault();
    // Replace with actual signup logic
    toast({
      title: 'Account created!',
      description: 'You have successfully signed up.',
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
        <VStack spacing={4} as="form" onSubmit={handleSignup}>
          <Heading as="h2" size="lg" textAlign="center">
            Create Your Account
          </Heading>

          <FormControl id="name" isRequired>
            <FormLabel>Full Name</FormLabel>
            <Input type="text" placeholder="John Doe" />
          </FormControl>

          <FormControl id="email" isRequired>
            <FormLabel>Email address</FormLabel>
            <Input type="email" placeholder="you@example.com" />
            <FormHelperText>Use a valid email to verify your account.</FormHelperText>
          </FormControl>

          <FormControl id="password" isRequired>
            <FormLabel>Password</FormLabel>
            <Input type="password" placeholder="********" />
          </FormControl>

          <Button colorScheme="blue" type="submit" width="full">
            Sign Up
          </Button>

          <Text fontSize="sm">
            Already have an account?{' '}
            <Link color="blue.500" href="/login">
              Log In
            </Link>
          </Text>
        </VStack>
      </Box>
    </Flex>
  );
};

export default SignupPage;
