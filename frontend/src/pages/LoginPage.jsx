import React, {useState} from 'react';
import axios from 'axios';
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
    useToast, useAccordion,
} from '@chakra-ui/react';
import {useNavigate} from "react-router-dom";

const backendApiUrl = import.meta.env.VITE_BACKEND_API_URL;

const LoginPage = () => {

    const navigate = useNavigate();
    const toast = useToast();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleChange = (e) => {
        const {name, value} = e.target;

        if (name === "username") {
            setUsername(value);
        } else if (name === "password") {
            setPassword(value);
        }
    }

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`${backendApiUrl}/api/auth/login`, {
                username,
                password
            });

            console.log(response.data);

            toast({
                title: 'Logged in!',
                description: 'You have successfully logged in.',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });

            localStorage.setItem("token", response.data.token);

            navigate("/home");

        } catch (error) {
            console.error(error);
            toast({
                title: 'Login failed',
                description: 'Check username/password',
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
                <VStack spacing={4} as="form" onSubmit={handleLogin}>

                    <Heading as="h2" size="lg" textAlign="center">
                        FoodiMap
                    </Heading>

                    <FormControl id="email" isRequired>
                        <FormLabel>Username / Email</FormLabel>
                        <Input name="username" placeholder="Username or Email" onChange={handleChange} value={username} />
                        <FormHelperText>We'll never share your email.</FormHelperText>
                    </FormControl>

                    <FormControl id="password" isRequired>
                        <FormLabel>Password</FormLabel>
                        <Input name="password" type="password" placeholder="********" onChange={handleChange} value={password} />
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