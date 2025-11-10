import React, {useState} from 'react';
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
import axios from "axios";
import {useNavigate} from "react-router-dom";

const backendApiUrl = import.meta.env.VITE_BACKEND_API_URL;

const SignupPage = () => {

  const navigate = useNavigate();
  const toast = useToast();

  const [form, setForm] = useState({
      username: "",
      email: "",
      password: ""
  });

  const handleChange = (e) => {

      const {name, value} = e.target;

      setForm(prev => ({
          ...prev,
          [name]: value
      }));
  }

  const handleSignup = async (e) => {
    e.preventDefault();

    try {

        const payload = {
            username: form.username.trim(),
            email: form.email.trim().toLowerCase(),
            password: form.password
        };

        console.log("register payload:", payload);

        const response = await axios.post(`${backendApiUrl}/api/auth/register`, {
            username: form.username,
            email: form.email,
            password: form.password
        })

        console.log(response.data);

        toast({
            title: 'Account created!',
            description: 'You have successfully signed up.',
            status: 'success',
            duration: 3000,
            isClosable: true,
        });

        navigate("/login");

    } catch (error) {
        console.error(error);
        toast({
            title: 'Signup failed',
            description: 'Email or username has been taken',
            status: 'error',
            duration: 3000,
            isClosable: true,
        });
    }
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
            <Input name="email" type="email" placeholder="you@example.com" onChange={handleChange} value={form.email} />
            <FormHelperText>Use a valid email to verify your account.</FormHelperText>
          </FormControl>

          <FormControl id="username" isRequired>
            <FormLabel>Username</FormLabel>
            <Input name="username" type="username" placeholder="Username" onChange={handleChange} value={form.username} />
          </FormControl>

          <FormControl id="password" isRequired>
            <FormLabel>Password</FormLabel>
            <Input name="password" type="password" placeholder="********" onChange={handleChange} value={form.password} />
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
