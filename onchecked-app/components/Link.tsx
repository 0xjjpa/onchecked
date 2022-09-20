import { Link as ChakraLink, LinkProps as ChakraLinkProps } from "@chakra-ui/react";
import NextLink, { LinkProps } from "next/link";
import React from "react";

type Props = {
  children?: React.ReactNode;
};

export const Link: React.FC<Props & LinkProps & ChakraLinkProps> = (props) => {
  const { children, href, as, ...rest } = props;
  return <NextLink as={as} passHref href={href}>
    <ChakraLink {...rest}>{children}</ChakraLink>
  </NextLink>
};
