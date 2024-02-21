import { lazy, Suspense, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { Box, Flex, useColorModeValue as mode } from "@chakra-ui/react";

import useAuthStore from "~shared/store/AuthStore";

const Loader = lazy(() => import("~components/loader/Loader"));
const NotFound = lazy(() => import("~pages/notfound/NotFound"));

const TestPage = lazy(() => import("~pages/TestPage"));
const TestPage2 = lazy(() => import("~pages/TestPage2"));

const App = () => {
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "auth-storage" && !event.newValue) {
        useAuthStore.setState({
          isAuthenticated: false,
          user: null,
        });
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <Flex direction="column" minH="100vh" bg={mode("gray.100", "gray.900")}>
      <Suspense fallback={<Loader />}>
        <Box>
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route path="/" element={<TestPage />} />
              <Route path="/callback" element={<TestPage />} />
              <Route path="/auth/sgid/callback" element={<TestPage2 />} />
              {/* http://localhost:5173/singpass/auth/callback */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </Box>
      </Suspense>
    </Flex>
  );
};

export default App;
