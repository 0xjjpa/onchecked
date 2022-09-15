import { CheckIcon, InfoOutlineIcon, NotAllowedIcon } from "@chakra-ui/icons";
import { Tag, TagLabel, TagRightIcon } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useBlockNumber } from "wagmi";

export const TagBlock = ({
  hasBlocknumber,
  signedBlocknumber,
}: {
  hasBlocknumber: boolean;
  signedBlocknumber: number;
}) => {
  const [blocknumberLabel, setBlocknumberLabel] = useState<string | number>(
    "Blocknumber"
  );
  const [colorScheme, setColorScheme] = useState<
    "green" | "red" | "blue" | "gray"
  >("gray");
  const [icon, setIcon] = useState<typeof NotAllowedIcon | typeof CheckIcon | typeof InfoOutlineIcon>();
  const {
    data: currentBlocknumber,
    isError,
    isLoading,
  } = useBlockNumber({
    watch: true,
  });

  useEffect(() => {
    if (isLoading) {
      setColorScheme('gray');
      setBlocknumberLabel('Loading...');
      setIcon(NotAllowedIcon);
    }
  }, [isLoading]);

  useEffect(() => {
    if (isError) {
      setColorScheme('red');
      setBlocknumberLabel('Unable to load');
      setIcon(NotAllowedIcon);
    }
  }, [isError])

  useEffect(() => {
    if (hasBlocknumber && currentBlocknumber) {
      if (currentBlocknumber - signedBlocknumber < 256) {
        setColorScheme("green");
        setBlocknumberLabel("Valid");
        setIcon(CheckIcon);
      } else {
        setColorScheme("red");
        setBlocknumberLabel("Past 256 blocks");
        setIcon(NotAllowedIcon);
      }
    } else {
      setColorScheme("blue");
      setBlocknumberLabel("Blocknumber");
      setIcon(InfoOutlineIcon);
    }
  }, [hasBlocknumber, currentBlocknumber, signedBlocknumber]);

  return (
    <Tag variant="outline" colorScheme={colorScheme}>
      <TagLabel>Blocknumber ({blocknumberLabel})</TagLabel>
      <TagRightIcon as={icon} />
    </Tag>
  );
};
