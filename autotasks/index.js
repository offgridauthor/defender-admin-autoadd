const { AdminClient } = require('defender-admin-client');

exports.handler = async function(event) {
  const credentials = {apiKey: event.secrets.API_KEY, apiSecret: event.secrets.API_SECRET};
  const client = new AdminClient(credentials); 
   
  const payload = event.request.body;
  const matchReasons = payload.matchReasons;
  const newCloneAddress = matchReasons[0].params._clone;
  const newCloneAbi = `[
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "ValueChanged",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "initialize",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "retrieve",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "store",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]`;

	await client.addContract({ 
		network: 'rinkeby', 
		address: newCloneAddress, 
		name: `Clone ${newCloneAddress}`,  
		abi: newCloneAbi,
	});


}