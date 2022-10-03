import { useEffect, useState } from "react";
import {ethers} from 'ethers';


const GasTracker = () => {
    
    const [blockNumber, setBlockNumber] = useState('Loading...');
    const [gasPrice, setGasPrice] = useState('Loading...');
    useEffect(() => {
        const provider = new ethers.providers.JsonRpcProvider('https://mainnet.infura.io/v3/9278c04944064d5a8f9ad13e549e550c');
        provider.on("block", async(number) => {
            setBlockNumber(number);
            let gas_price = await provider.getGasPrice();
            gas_price = ethers.utils.formatUnits(gas_price, 'gwei')
            setGasPrice(Number(gas_price).toFixed(2));
        })
    }, []);

    return (
        <div className="live-prices--column">
            <div className="live-prices--block w-50 live">
                <p className="text-center"><span></span> Latest Block</p>
                <h5 className="text-center">{blockNumber}</h5>
            </div>
            <div className="live-prices--block w-50 live">
                <p className="text-center"><span></span> Gas Price</p>
                <h5 className="text-center">{gasPrice}</h5>
            </div>
        </div>
    )
}

export default GasTracker;