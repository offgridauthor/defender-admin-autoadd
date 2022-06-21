// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BoxFactory is Ownable {

	address public implementationContract;
  address[] public allClones;

	event NewClone(address _clone);

	constructor(address _implementation) {
		implementationContract = _implementation;
	}

	function createNewClone() external returns(address instance) {
		instance = Clones.clone(implementationContract);
		allClones.push(instance);
		emit NewClone(instance);
		return instance;
	}
}