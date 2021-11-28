import { useEffect, useRef } from "react";
import { useWeb3React } from '@web3-react/core';
import Jazzicon from "@metamask/jazzicon";
import styled from "@emotion/styled";

const StyledIdenticon = styled.div`
  height: 50px;
  width: 50px;
  border-radius: 1.125rem;
  background-color: white;
  display: inline-block;
`;

export default function Identicon(props) {
  const ref = useRef<HTMLDivElement>();
  // const { account } = useWeb3React();

  useEffect(() => {
    if (props.account && ref.current) {
      ref.current.innerHTML = "";
      ref.current.appendChild(Jazzicon(props.size, parseInt(props.account.slice(2, 10), 16)));
    }
  }, [props.account]);

  return <StyledIdenticon ref={ref as any} />;
}