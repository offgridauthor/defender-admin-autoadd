const { AdminClient } = require('defender-admin-client')
const { SentinelClient } = require('defender-sentinel-client')

exports.handler = async function (event) {
  const credentials = {
    apiKey: event.secrets.API_KEY,
    apiSecret: event.secrets.API_SECRET,
  }
  const adminClient = new AdminClient(credentials)
  const sentinelClient = new SentinelClient(credentials)
  const payload = event.request.body
  const matchReasons = payload.matchReasons
  const newCloneAddress = matchReasons[0].params._clone
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
  ]`
  // add new box clone contract to admin
  await adminClient.addContract({
    network: 'rinkeby',
    address: newCloneAddress,
    name: `Clone ${newCloneAddress}`,
    abi: newCloneAbi,
  })
  // add new box clone to sentinel
  const subscriberId = '1cf990de-ebb3-4255-8c12-67eec8fbbfa7'
  const sentinel = await sentinelClient.get(subscriberId)
  const subscribedAddresses = sentinel.addressRules[0].addresses
  subscribedAddresses.push(newCloneAddress)
  await sentinelClient.update(subscriberId, { addresses: subscribedAddresses })
}
