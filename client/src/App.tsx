import { lazy, Suspense, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { Box, Flex } from "@chakra-ui/react";

import useAuthStore from "~shared/store/AuthStore";

import { useAuth } from "~features/auth";

const Loader = lazy(() => import("~components/loader/Loader"));
const NotFound = lazy(() => import("~pages/notfound/NotFound"));
const Navbar = lazy(() => import("~components/navbar/Navbar"));
const Footer = lazy(() => import("~components/footer/Footer"));

const PublicRoute = lazy(() => import("~shared/routes/PublicRoute"));
const PrivateRoute = lazy(() => import("~shared/routes/PrivateRoute"));

// Public Page
const LandingPage = lazy(() => import("~pages/landing/Landing"));
const LoginPage = lazy(() => import("~pages/auth/Login"));
const MyInfoCallbackPage = lazy(() => import("~pages/auth/MyInfoCallback"));
const SgIDCallbackPage = lazy(() => import("~pages/auth/SgIDCallback"));

// Private Page
const HomePage = lazy(() => import("~pages/home/Home"));
const NotesGeneratorPage = lazy(() => import("~pages/notes/NotesGenerator"));
const SubscribePage = lazy(() => import("~pages/subscribe/Subscribe"));

const App = () => {
  const { isAuthenticated } = useAuth();
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "auth-storage" && !event.newValue) {
        useAuthStore.setState({
          isAuthenticated: true,
          user: {
            user_id: "sadad",
            username: "Hello World",
            email: "sadad@gmail.com",
            role: "User",
            is_paid: false,
          },
        });
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <Flex direction="column" minH="100vh" bg={"white"}>
      <Suspense fallback={<Loader />}>
        <Navbar />
        <Box flex="1" bg="darkBlue.500">
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route
                path="/"
                element={
                  <PublicRoute
                    strict={true}
                    isAuthenticated={isAuthenticated}
                  />
                }
              >
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/callback" element={<MyInfoCallbackPage />} />
                <Route
                  path="/auth/sgid/callback"
                  element={<SgIDCallbackPage />}
                />
              </Route>
              <Route
                element={<PrivateRoute isAuthenticated={isAuthenticated} />}
              >
                <Route path="/home" element={<HomePage />} />
                <Route path="/generator" element={<NotesGeneratorPage />} />
                <Route path="/subscribe" element={<SubscribePage />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </Box>
        <Footer />
      </Suspense>
    </Flex>
  );
};

export default App;
