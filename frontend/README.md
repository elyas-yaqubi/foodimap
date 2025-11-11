# Documentation

## Resources Used
Chakra Tutorial: https://www.youtube.com/watch?v=2-00xSMFK28&list=PL4cUxeGkcC9hcnIeryurNMMcGBHp7AYlP
Chakra Documentation: https://chakra-ui.com/docs/components/concepts/overview

## AI Usage
1. I used AI to learn how to set up and build .jsx files in Intellij Community IDE.
2. I used ChatGPT to help me debug the HomePage.jsx file. 
    Q: "I am trying to split the webpage into left column (that stays fixed) and the right grid-like main page that can be scrolled through. In my current implementation, the left column doesn't stay fixed. Is there a way to implement something like that in Chakra UI?"
    AI's Answer: Yes ✅ — you can absolutely do that in Chakra UI.

This layout (fixed left sidebar + scrollable right main content) is very common, and Chakra supports it cleanly with `Grid` or `Flex` layouts plus `position="fixed"`.

Let’s go step-by-step 👇

---

## 🧩 Core Layout Structure

Here’s a minimal example you can drop in to replace your main `<Box>` layout wrapper:

```jsx
<Box bg="gray.50" minH="100vh">
  <Grid templateColumns={{ base: "1fr", lg: "250px 1fr" }} h="100vh">
    
    {/* --- LEFT SIDEBAR (fixed) --- */}
    <Box
      position="fixed"
      top="0"
      left="0"
      h="100vh"
      w={{ base: "100%", lg: "250px" }}
      bg="white"
      borderRight="1px solid"
      borderColor="gray.200"
      p={6}
      zIndex={100}
    >
      <VStack align="stretch" spacing={6}>
        <Heading size="md" textAlign="center">foodimap</Heading>
        <Button colorScheme="blue" onClick={onOpen}>Create Post</Button>
        <Button colorScheme="red" onClick={handleLogout}>Logout</Button>
      </VStack>
    </Box>

    {/* --- RIGHT MAIN CONTENT (scrollable) --- */}
    <Box
      ml={{ base: 0, lg: "250px" }}   // Push content to the right of fixed sidebar
      h="100vh"
      overflowY="auto"
      p={6}
    >
      <Heading size="lg" mb={4}>Food Reviews</Heading>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        {posts.map((post) => (
          <Card key={post.id}>
            <Image src={post.imageUrl} alt={post.caption} h="200px" w="100%" objectFit="cover" />
            <CardBody>
              <Text>{post.caption}</Text>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>
    </Box>
  </Grid>
</Box>
```

---

## 🧠 Explanation

### 🔹 Sidebar

* `position="fixed"` makes it stick to the left edge of the screen.
* `h="100vh"` ensures it covers the full viewport height.
* `w="250px"` (or whatever width you prefer) defines its width.
* `borderRight` gives a nice visual separator.

### 🔹 Main content

* `ml={{ lg: "250px" }}` offsets the content so it doesn’t go under the sidebar.
* `overflowY="auto"` allows the right side to scroll independently.
* `h="100vh"` ensures it fills the available height.

### 🔹 Responsive behavior

* On mobile (`base`), the sidebar can collapse or stack on top by changing templateColumns and width.

---

## 💡 Optional: Make Sidebar Collapsible on Small Screens

If you want the sidebar to disappear or slide in on mobile:

```jsx
<Box
  position={{ base: "absolute", lg: "fixed" }}
  transform={{ base: isOpen ? "translateX(0)" : "translateX(-100%)", lg: "none" }}
  transition="transform 0.3s ease"
  ...
>
```

Then you can toggle `isOpen` with a hamburger icon.

---

Would you like me to extend this example to include a **collapsible (mobile-friendly) sidebar** version next?

