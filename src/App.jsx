import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Box, ChakraProvider } from "@chakra-ui/react";
import { HomeRoute } from "./routes/HomeRoute/index";
import { PublisherRouteContainer } from "./routes/PublisherRoute/PublisherRoute.container";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomeRoute />,
    },
    {
      path: "/publisher",
      element: <PublisherRouteContainer />,
    },
  ]);

  return (
    <ChakraProvider>
      <Box w="100vw" h="100vh" p={4} overflow={"auto"}>
        <RouterProvider router={router} />
      </Box>
    </ChakraProvider>
  );
};

export default App;
