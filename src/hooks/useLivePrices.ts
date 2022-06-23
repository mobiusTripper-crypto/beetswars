import { useEffect, useState } from "react";
import { contract_abi, contract_address } from "contracts/priceoracleconfig";
import { ethers } from "ethers";
import { TokenPrice } from "types/BribeData";

export function useLivePrices(tokenPriceData)  {

      var tokenPrices: TokenPrice[] = []

  useEffect(() => {
    const fetchPrices = async () => {

      const provider = new ethers.providers.JsonRpcProvider(
        "https://rpc.ftm.tools"
      );
      const contract = new ethers.Contract(
        contract_address,
        contract_abi,
        provider
      );

      tokenPriceData.forEach(async (tkn) => {
        const priceobj = await contract.calculateAssetPrice(
          tkn.address
        )
        const price = parseFloat(ethers.utils.formatEther(priceobj))
        const data:[] = { token: tkn.token, price: price  }
              tokenPrices.push(data)
        console.log("tkn:",tkn.token,price )
      })

      console.log(tokenPrices)

    }

    fetchPrices()

  }, [])


  return tokenPrices
}
