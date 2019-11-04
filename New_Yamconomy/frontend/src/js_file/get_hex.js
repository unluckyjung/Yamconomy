import Web3 from 'web3';

const ABI = [
        {
            "constant": false,
            "inputs": [
                {
                    "name": "A_num",
                    "type": "uint256"
                },
                {
                    "name": "H_value",
                    "type": "bytes32"
                }
            ],
            "name": "Write_Review",
            "outputs": [],
            "payable": true,
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "Article_num",
            "outputs": [
                {
                    "name": "Hashing_value",
                    "type": "bytes32"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "owner",
            "outputs": [
                {
                    "name": "",
                    "type": "address"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "A_num",
                    "type": "uint256"
                }
            ],
            "name": "Review_Verification",
            "outputs": [
                {
                    "name": "",
                    "type": "bytes32"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        }
    ]


export default function get_hex_from_contract(s) {

	//var web4 = new Web3(Web3.givenProvider || "http://ropsten.infura.io");
	var web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io"));
	//ropsten이라고 명시해줘야함.
	
	var review_contract = new web3.eth.Contract(ABI, "0x63D299614dce54Fe198f09DaDF6EfE04ADA435D7");

	return review_contract.methods.Review_Verification(s).call().then();
}
