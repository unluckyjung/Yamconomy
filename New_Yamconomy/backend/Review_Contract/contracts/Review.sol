pragma solidity ^0.4.23;
contract Review {


    //필요한 정보. 
    //글번호 (key)
    //글번호 +  제목 + 본문을 해싱한 값

    struct Verification {
        //uint Article_num;
        bytes32 Hashing_value;
        //byte32 는 문자열을 자동으로 hex화 32byte까지 저장함. 
        //sha 256의 경우, 64byte hex임. 쪼개서 저장하거나, 
        //아예 문자열방식으로 받아야함. 대신 비용문제 발생
        
    }

    //mapping (uint => Verification) public Verification_Test;
    mapping (uint => Verification) public Article_num;
    //Article_num에 따라서, 해시값을 가지고 있는 객체가 만들어짐.

    //생성자는, 배포후 한번만 실행한 뒤 수정하지 못함.
    //즉 배포할때 사용된 계정이 컨트랙의 소유자가 되는것.

    address public owner;   //컨트랙 배포 계정
    constructor() public{
        owner = msg.sender; //컨트랙을 배포할때 계정을 통해서 배포함.
        //msg.sender(현재 사용하는 계정으로 이 컨트랙안에 있는 생성자나 함수를 불러옴)를 owner에 대입시켜둠.
        //이 컨트랙의 주인은 현재 계정이다.
        //배포에 사용된 계정이 컨트랙의 소유자가 된것.
        //migrate하면 첫번째 계정이 default로 배포하는 계정이된다.
    }


    function Write_Review(uint A_num, bytes32 H_value) public payable{
        //함수가 이더를 받아야 하기 때문에(트랜잭션 발생) payable로 설정함.
        //글번호(A_num)와 해시값(H_value)을 받음.

        Article_num[A_num] = Verification(H_value);
        //해당 글번호에, 해당 해시값을 넣어둠.
    }

    //해시값 불러오는 함수.
    function Review_Verification(uint A_num) public view returns (bytes32){ 
        //글번호(A_num)을 받는다.
        Verification memory Hash_check = Article_num[A_num];
        return (Hash_check.Hashing_value);
        //글 번호에 해당하는 Hash값을 리턴한다.
    }

}