import { useState } from "react";
import { animated, useSpring } from "react-spring";
import { Box, Spacer, Text } from "@chakra-ui/react";

interface FlashcardProps {
  question: string;
  answer: string;
}

export default function Flashcard({ question, answer }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const { transform, opacity } = useSpring({
    opacity: isFlipped ? 1 : 0,
    transform: `perspective(600px) rotateY(${isFlipped ? 180 : 0}deg)`,
    config: { mass: 5, tension: 500, friction: 80 },
  });

  return (
    <Box
      borderRadius={10}
      w="100%"
      p={4}
      color="white"
      height="50vh"
      position="relative"
      cursor="pointer"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <animated.div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          borderRadius: 10,
          backgroundColor: "#003294",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 16,
          backfaceVisibility: "hidden",
          opacity: opacity.to((opacity) => 1 - opacity),
          transform,
        }}
      >
        <Spacer />
        <Text as="b" fontSize="2xl" mx={10} textAlign="center">
          {question}
        </Text>
        <Spacer />
      </animated.div>
      <animated.div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          borderRadius: 10,
          backgroundColor: "#003294",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: 100,
          backfaceVisibility: "hidden",
          opacity,
          transform: transform.to(
            (transform: string) => `${transform} rotateY(180deg)`
          ),
        }}
      >
        <Text as="b" fontSize="2xl" textAlign="center">
          {answer}
        </Text>
      </animated.div>
    </Box>
  );
}
