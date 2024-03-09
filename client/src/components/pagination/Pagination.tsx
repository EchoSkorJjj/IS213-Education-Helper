import { FC, useCallback } from "react";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";
import { Flex, IconButton, Text, Tooltip } from "@chakra-ui/react";

type PaginationProps = {
  color: string;
  pageSize: number;
  currentPage: number;
  totalCount: number;
  isDisabled: boolean;
  onPageChange: (page: number) => void;
};

export const Pagination: FC<PaginationProps> = ({
  color,
  pageSize,
  currentPage,
  totalCount,
  isDisabled,
  onPageChange,
}) => {
  const totalPageCount = Math.ceil(totalCount / pageSize);
  const isDisableNextPage = isDisabled || currentPage >= totalPageCount;
  const isDisablePrevPage = isDisabled || currentPage <= 1;

  const handleFirstPage = useCallback(() => {
    if (isDisablePrevPage) return;
    onPageChange(1);
  }, [currentPage, isDisablePrevPage, onPageChange]);

  const handlePageBack = useCallback(() => {
    if (isDisablePrevPage) return;
    onPageChange(currentPage - 1);
  }, [currentPage, isDisablePrevPage, onPageChange]);

  const handlePageNext = useCallback(() => {
    if (isDisableNextPage) return;
    onPageChange(currentPage + 1);
  }, [currentPage, isDisableNextPage, onPageChange]);

  const handleLastPage = useCallback(() => {
    if (isDisableNextPage) return;
    onPageChange(totalPageCount);
  }, [currentPage, isDisableNextPage, onPageChange]);

  return (
    <Flex
      justifyContent="center"
      m={4}
      alignItems="center"
      direction={{ base: "column", lg: "row" }}
    >
      <Flex>
        <Tooltip label="First Page">
          <IconButton
            aria-label="First Page"
            onClick={handleFirstPage}
            isDisabled={isDisablePrevPage}
            icon={<ArrowLeftIcon h={3} w={3} />}
            mr={4}
          />
        </Tooltip>
        <Tooltip label="Previous Page">
          <IconButton
            aria-label="Previous Page"
            onClick={handlePageBack}
            isDisabled={isDisablePrevPage}
            icon={<ChevronLeftIcon h={6} w={6} />}
            mr={2}
          />
        </Tooltip>
        <Flex
          direction={{ base: "column", md: "row" }}
          alignItems="center"
          mb={{ base: "2", lg: "0" }}
          ml="2"
          mr="3"
        >
          <Text color={color} flexShrink="0">
            Page{" "}
            <Text fontWeight="bold" as="span">
              {currentPage}
            </Text>{" "}
            of{" "}
            <Text fontWeight="bold" as="span">
              {totalPageCount}
            </Text>
          </Text>
        </Flex>
        <Tooltip label="Next Page">
          <IconButton
            aria-label="Next Page"
            onClick={handlePageNext}
            isDisabled={isDisableNextPage}
            icon={<ChevronRightIcon h={6} w={6} />}
          />
        </Tooltip>
        <Tooltip label="Last Page">
          <IconButton
            aria-label="Last Page"
            onClick={handleLastPage}
            isDisabled={isDisableNextPage}
            icon={<ArrowRightIcon h={3} w={3} />}
            ml={4}
          />
        </Tooltip>
      </Flex>
    </Flex>
  );
};
