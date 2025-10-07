import './App.css'

import { Button, Box, Heading } from "@chakra-ui/react";

function App() {
    return (
        <Box textAlign="center" mt={10}>
            <Heading>Hello Chakra + Vite!</Heading>
            <Button colorScheme="teal" mt={4}>
                Click me
            </Button>
        </Box>
    );
}

export default App;
