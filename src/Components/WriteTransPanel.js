import {useState,useEffect} from "react";
import {ethers} from 'ethers';
import {notification,Spin} from "antd"
import {my_accounts} from "./../config/config";

 const WriteTransPanel =({accountIndex,ABI, web3,contract, address,gas})=>{

    const [open, setOpen] = useState(true);
    const [spin,setSpin] = useState(false)
   
   
    useEffect(()=>{
         setOpen(true);
       
    },[ABI])
    
    const [form,setForm] = useState({});
    const onChange = e=>{
        let name=e.target.name;
        let value=e.target.value;
        setForm(state=>({...state,[name]:value}));
    } 
    const writeTransAction = async()=>{
    //    await  web3.eth.accounts.sign("",my_accounts[accountIndex].private)
        console.log(my_accounts[accountIndex].public)
        if(spin)return;
        setSpin(true)
        let params=[];
        ABI.inputs.map((input,key)=>{
            params.push(form[input.name])
        })
        try {
            const tx = contract.methods[ABI.name](...params);
            let txdata = {};
            if(gas.txtype==0){

                txdata = {
                    to:address,
                    data:tx.encodeABI(),
                    gas:gas.gasLimit!==""?await tx.estimateGas():gas.gasLimit,
                    maxFeePerGas:gas.gasMax,
                    maxPriorityFeePerGas:gas.gasMaxPriority
                }
            }
            else{
                txdata = {
                    to:address,
                    data:tx.encodeABI(),
                    gas:gas.gasLimit!==""?await tx.estimateGas():gas.gasLimit,
                    gasPrice:gas.gasPrice,
                   
                }
            }
            console.log(my_accounts[accountIndex].private);
            const createTransaction= await web3.eth.accounts.signTransaction(txdata,
            my_accounts[accountIndex].private);
            const txRes = await web3.eth.sendSignedTransaction(createTransaction.rawTransaction);
            notification.success({
                message: 'Succed in sending Tx',
                description:`Tx successful with hash: ${txRes.transactionHash}`,
                    
            })
            setSpin(false)
        } catch(e){
            setSpin(false)
            notification.error({
                message: 'Error of Tx',
                description:`Tx failed with error: ${e}`,
                
          })
        }
        

    }
    return (
        <div className="bg-dark2 border container rounded p-0 border-dark text-white">
            <div className="d-flex justify-content-between bg-dark1 rounded"onClick={e=>setOpen(!open)}>

                <h6 className=" pt-2 pl-5 mb-0 ">{ABI.name}</h6>
                {open?(<h6 style={{cursor:"pointer"}}className="py-2 mr-3 mb-0 close"onClick={e=>setOpen(false)}>+</h6>):(<h6 style={{cursor:"pointer"}}className="py-2 mr-3 mb-0 close"onClick={e=>setOpen(true)}>-</h6>)}
            </div>
            {!open&&(<div className="row p-3">
              {ABI.inputs&&ABI.inputs.map((input,key)=>(
                <div className="col-md-6" key={key}>
                    <label> {input.name}</label>
                    <input type="text" name={input.name} onChange={e=>{onChange(e)}}placeholder={input.type} className="form-control form-control-sm" value={form[input.name]}/>
                </div>
             
              ) 
            ) }
                <div className="row mt-1">
                <div className='col-md-4'>

                </div>
                    <div className='col-md-4'>
                        <button className='btn btn-primary form-control' onClick={e=>{writeTransAction()}}>{spin&&<span className="spinner-border  text-white" style={{height:"1.5em",width:"1.5em"}}></span>}Write</button>

                    </div>
                
            
                 </div>
            </div>)}
        </div>
    )
}
export default WriteTransPanel;