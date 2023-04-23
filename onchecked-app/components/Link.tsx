import { Link as ChakraLink, LinkProps as ChakraLinkProps } from "@chakra-ui/react";
import NextLink, { LinkProps } from "next/link";
import React from "react";

type Props = {
  children?: React.ReactNode;
};

type CustomLinkProps = Props & LinkProps & ChakraLinkProps

//@TODO: Fix forwardRef issue caused by NextLink not being a Chakra component
export const Link: React.FC<CustomLinkProps> = (props) => {
  const { children, href, as, ...rest } = props;
  return <NextLink as={as} passHref href={href}>
    <ChakraLink {...rest}>{children}</ChakraLink>
  </NextLink>
};
