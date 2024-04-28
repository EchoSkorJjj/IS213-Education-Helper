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
const About = lazy(() => import("~pages/about/About"));
const LoginPage = lazy(() => import("~pages/auth/Login"));
const SgIDCallbackPage = lazy(() => import("~pages/auth/SgIDCallback"));

// Private Page
const HomePage = lazy(() => import("~pages/home/Home"));
const NotesGeneratorPage = lazy(() => import("~pages/notes/NotesGenerator"));
const MarketplacePage = lazy(() => import("~pages/marketplace/Marketplace"));
const SubscribePage = lazy(() => import("~pages/subscribe/Subscribe"));
const ProfilePage = lazy(() => import("~pages/profile/Profile"));
const UpdateProfilePage = lazy(() => import("~pages/profile/UpdateProfile"));
const ViewNotesPage = lazy(() => import("~pages/viewnotes/ViewNotes"));
const SuccessPage = lazy(() => import("~pages/subscribe/Success"));
const FailedPage = lazy(() => import("~pages/subscribe/Failed"));

const GeneratedContentPage = lazy(
  () => import("~pages/notes/GeneratedContent"),
);

const App = () => {
  const { isAuthenticated } = useAuth();
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
    <Flex direction="column" minH="100vh" bg={"white"}>
      <Suspense fallback={<Loader />}>
        <Navbar />
        <Box flex="1" bg="white">
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
                <Route path="/marketplace" element={<MarketplacePage />} />
                <Route path="/subscribe" element={<SubscribePage />} />
                <Route path="/inventory" element={<ProfilePage />} />
                <Route path="/profile/update" element={<UpdateProfilePage />} />
                <Route path="/viewnotes/:noteId" element={<ViewNotesPage />} />
                <Route path="/subscribe/success" element={<SuccessPage />} />
                <Route path="/subscribe/failed" element={<FailedPage />} />
                <Route
                  path="/generated/:noteId"
                  element={<GeneratedContentPage />}
                />
              </Route>
              <Route path="/about" element={<About />} />
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
