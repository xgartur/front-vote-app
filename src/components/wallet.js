import { useCallback, useState, useEffect } from "react"
import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core'
import { connector } from '../config/web3'

function Wallet() {
  
  const [balance,setBalance] = useState(0)
  const { active,activate,account,error,deactivate,library } = useWeb3React()

  const isUnsupportedChain = error instanceof UnsupportedChainIdError

  const connect = useCallback(()=>{
    activate(connector)
    localStorage.setItem("previouslyConnected", true)
  },[activate])

  const disconnect = () =>{
    deactivate()
    localStorage.removeItem("previouslyConnected")
  }

  const getBalance = useCallback(async () => {
    const toSet = await library.eth.getBalance(account);
    setBalance((toSet / 1e18).toFixed(3));
  }, [library?.eth, account]);

  useEffect(()=> {
    if(active) getBalance()
  },[active,getBalance])

  useEffect(()=>{
    if(localStorage.getItem("previouslyConnected") === "true") connect()
  },[connect])

  return (
    <>
    {active ? (
      <>
        <p>{account}</p>
        <p>{balance}</p>
        <button className="button is-danger" onClick={disconnect}>
          Cerrar Sesion
        </button>
      </>
    ):(
      <>
        <button className="button is-info" onClick={connect} disabled={isUnsupportedChain}>
          {isUnsupportedChain ? "Red no soportada":"Conectar wallet"}
        </button>
      </>
    )}
    </>
  );
}

export default Wallet;
