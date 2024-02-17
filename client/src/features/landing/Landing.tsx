import { useEffect } from "react";

import { useHead } from "~features/page-header/title/TitleContext";

const Landing = () => {
  const updateHead = useHead();
  useEffect(() => {
    updateHead("Home", {
      description: "Home",
      keywords: "Home",
    });
  }, []);

  return (
    <div>
      <h1>Landing Page</h1>
    </div>
  );
};

export default Landing;
