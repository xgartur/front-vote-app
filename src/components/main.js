import { useState, useCallback, useEffect } from "react";
import { useWeb3React } from "@web3-react/core"
import useVoting from "../hooks/useVoting"

function Main(){
  
  const {active,account} = useWeb3React()
  const [proposals,setProposals] = useState(0)
  const [chairPerson,setChairPerson] = useState("")
  const [isAddProposal,setIsAddProposal] = useState(false)

  const voting = useVoting()

  const getNumProposals = useCallback( async ()=>{
    if(voting){
      const result = await voting.methods.getProposals().call()
      setProposals(result)
    }
  },[voting])
  const getChairPerson = useCallback( async ()=>{
    if(voting){
      const result = await voting.methods.getChairPerson().call()
      setChairPerson(result)
    }
  },[voting])

  const addProposal = () => {
    setIsAddProposal(true)
    voting.methods.addProposal("Walter")
      .send({from:account})
      .on("transactionHash",(txHash)=>{
        console.log("transaccion enviada",txHash)
        setIsAddProposal(false)
      })
      .on("receipt",()=>{
        console.log("transaccion confirmada")
        setIsAddProposal(false)
      })
      .on("error",()=>{
        console.log("Transaccion fallida")
        setIsAddProposal(false)
      })
  }

  useEffect(()=>{
    getNumProposals()
    getChairPerson()
  },[voting])

  if(!active) return "conecta tu wallet"
  return (
    <>
      <p>Main bloque</p>
      <p>{proposals}</p>
      <p>{chairPerson}</p>
      <button onClick={addProposal}>Add Proposal</button>
    </>
  )
}

export default Main;
