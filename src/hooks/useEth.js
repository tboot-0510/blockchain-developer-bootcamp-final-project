import { useWeb3React } from "@web3-react/core";
import {formatEther} from "@ethersproject/units"
import { useAppContext } from "../AppContext";

const useEth = () => {
  const {active, library, account} = useWeb3React();
  const {ethBalance, setEthBalance} = useAppContext();
  

  const fetchEthBalance = async () => {
    console.log(setEthBalance());
    if (library && active && account) {
      const balance = await library.eth.getBalance(account);
      setEthBalance(parseFloat(formatEther(balance)).toFixed(3));
      console.log('success', parseFloat(formatEther(balance)).toFixed(3));
    } else {
      setEthBalance('--');
    }
  };
  
  return {ethBalance, fetchEthBalance};
}

export default useEth;