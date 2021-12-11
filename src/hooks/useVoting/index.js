import { useMemo } from "react"
import { useWeb3React } from "@web3-react/core"
import VotingArtifact from "../../config/web3/artifacts/voting"

const { address,abi } = VotingArtifact
const useVoting = () => {
  const {active,library,chainId}=useWeb3React()

  const voting = useMemo(() =>{
    if(active) return new library.eth.Contract(abi,address[chainId])
  },[active,chainId,library?.eth?.Contract]) 
  return voting
}

export default useVoting;
