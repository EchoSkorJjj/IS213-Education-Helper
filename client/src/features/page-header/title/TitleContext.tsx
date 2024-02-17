import * as React from "react";

/**
 * Developer Notes
 *
 * In all honesty this can be redone using react-helmet. But I think it's better to not have so many unnessary dependencies.
 *
 */

// Define types
type MetaTags = {
  description?: string;
  keywords?: string;
};

type HeadState = {
  title: string;
  metaTags: MetaTags;
};

type HeadContextType = {
  state: HeadState;
  setHead: (title: string, metaTags: MetaTags) => void;
};

// Utility function to update or create a meta tag
function updateOrCreateMetaTag(name: string, content: string) {
  let metaTag = document.querySelector(`meta[name="${name}"]`);
  if (!metaTag) {
    metaTag = document.createElement("meta");
    metaTag.setAttribute("name", name);
    document.head.appendChild(metaTag);
  }
  metaTag.setAttribute("content", content);
}

// Contexts
const HeadContext = React.createContext<HeadContextType | undefined>(undefined);

// Provider Component
const HeadProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = React.useState<HeadState>({
    title: "",
    metaTags: {},
  });

  const setHead = (title: string, metaTags: MetaTags) => {
    setState({ title, metaTags });
  };

  return (
    <HeadContext.Provider value={{ state, setHead }}>
      {children}
    </HeadContext.Provider>
  );
};

// Custom Hook for Updating Head
function useHead() {
  const context = React.useContext(HeadContext);
  if (!context) {
    throw new Error("useHead must be used within a HeadProvider");
  }

  return (title: string, metaTags: MetaTags) => {
    context.setHead(title, metaTags);
    document.title = title;
    updateOrCreateMetaTag("description", metaTags.description || "");
    updateOrCreateMetaTag("keywords", metaTags.keywords || "");
  };
}

export { HeadProvider, useHead };

// USAGE;

/*
 * const updateHead = useHead();
 * updateHead("My Page Title", {
 *   description: "Page description",
 *   keywords: "keyword1, keyword2",
 * }, []);
 */
