pragma solidity ^0.4.23;
//import "./YamToken.sol";
contract Yamconomy {


    struct Reviewer{
        address reviewerAddress;   //리뷰어의 계정 주소도 보여주게됨.
        bytes32 review;
        uint score;
        bytes32 menu; //메뉴 추가.
        uint vote;
    }

    mapping (uint => Reviewer) public reviewerInfo;
    //가게의 ID를 key값으로하면, value값으로 리뷰어의 정보를 불러오게 되어짐.

    //생성자는 , 배포후 한번만 실행한뒤 수정하지 못함.
    //즉 배포할때 사용된 계정이 컨트랙의 소유자가 되는것.
    address public owner;   //이 컨트랙의 주인

    address[10] public reviewers; //이부분을 2차원 배열로 하면, 여러 리뷰를 받을 수 있을까 생각..

    event LogReview(  //누군가가 리뷰를 작성했음을 사람들에게 알려줌.
        //이것을 알려주기 위해서는, 리뷰어의 계정 주소와 가게 ID가 필요함.
        address _reviewer,
        uint _id
    );

    constructor() public{
        owner = msg.sender; //컨트랙을 배포할때 계정을 통해서 배포함.
        //msg.sender(현재 사용하는 계정으로 이 컨트랙안에 있는 생성자나 함수를 불러옴)를 owner에 대입시켜둠.
        //이 컨트랙의 주인은 현재 계정이다.
        //배포에 사용된 계정이 컨트랙의 소유자가 된것.
        //어떤놈이 리뷰를 작성했을때, 전송한 이더를 이 owner에 넣을것.
        //migrate하면 첫번째 계정이 default로 배포하는 계정이된다.
    }

    function writeReview(uint _id, bytes32 _review, uint _score, bytes32 _menu) public payable{
        //함수가 이더를 받아야 하기 때문에 payable로 설정함.
        //가게가 10개이므로, 0~9사이로 받아야함.
        require(_id >=0 && _id <=9);
        reviewers[_id] = msg.sender;   //만약 id 0번째에 쓰면, buyers[0] 에 리뷰어의 주소가 저장이된다. 
        //이 정보를 이용하여, 한번 쓴리뷰는 다시 작성이 불가능하게 막을것.
        reviewerInfo[_id] = Reviewer(msg.sender, _review, _score, _menu, 0);    //vote default를 0으로 줌.
        //현재 리뷰를 작성한 계정 주소와, 리뷰 내용, 평점을 넘겨서 mapping의 value값을 만든다.
        //id가 매핑에서 아주 중요하게 쓰이고 있음.

        owner.transfer(msg.value);//이더를 계정에서 계정으로 이동할때 transfer 함수를 사용함.
        //msg.value는 이 함수로 넘어온 이더를 뜻함. 이떄 wei만 표기해줌. front end에서 이더로 변환시키는 작업필요.
        
        emit LogReview(msg.sender, _id);
        //해당 이벤트에 msg.sender와 id를 넘겨서 이벤트를 발생 시키겠다.
    }

    function getReviewerInfo(uint _id) public view returns (address, bytes32, uint, bytes32, uint){
    //매개변수로 가게의 ID를 받아 리뷰어의 정보를 가져오는 함수.
    //id를 reveiwerInfo의 key로 쓰고, 해당 value값을 가져와야함. (매핑이용)
        Reviewer memory reviewer = reviewerInfo[_id];
        //reviewerInfo에 매개변수 id를 이용하여, 해당 value(Reviewyer)를 불러와서 변수 reviewr에 저장
        
        return (reviewer.reviewerAddress, reviewer.review, reviewer.score, reviewer.menu, reviewer.vote); 
        //리턴되는 리뷰어의 계정주소, 리뷰, 점수
    }

    function getAllReviewers() public view returns (address[10]){
        return reviewers;
    }

    function getVote(uint _id) public view returns (uint){ 
        //Vote를 불러오는 함수.
        Reviewer memory reviewer = reviewerInfo[_id];
        return (reviewer.vote);
    }
    
    function addVote(uint _id) public payable{
        Reviewer memory reviewer = reviewerInfo[_id];
        reviewer.vote = reviewer.vote + 1;
    }
}