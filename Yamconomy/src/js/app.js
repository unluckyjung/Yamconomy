App = {
  web3Provider: null,
  contracts: {},
	
  init: function() {
    $.getJSON('../yam.json', function(data){  //여기가 yam json을 여는곳. yamconomy -> yam으로 변경
      var list = $('#list');
      var template = $('#template');

      for (i = 0; i< data.length; i++){
        template.find('img').attr('src',data[i].picture);
        template.find('.id').text(data[i].id);
        template.find('.name').text(data[i].name);
        template.find('.type').text(data[i].type);
        template.find('.location').text(data[i].location);
        template.find('.price').text(data[i].price);

        list.append(template.html());
        
        
      }
    })

    return App.initWeb3();
  },


  initWeb3: function() {
    if(typeof web3 !== 'undefined'){
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    }else{
      App.web3Provider = new web3.provider.HttpProvider('http://localhost:8545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function() {
		$.getJSON('Yamconomy.json',function(data){  //여기가 컨트랙(yamconomy)의 json을 여는곳.
      App.contracts.Yamconomy = TruffleContract(data);
      App.contracts.Yamconomy.setProvider(App.web3Provider);
      return App.loadReview();
    });
  },

  writeReview: function() {	
    var id = $('#id').val();
    var price = $('#price').val();
    var review = $('#review').val();
    var score = $('#score').val();


    web3.eth.getAccounts(function(error,accounts){  //계정을 불러온다.
      if(error){
        console.log(error);
      }

      var account = accounts[0];
        //위에서 받은것들을 매개변수로 넘김
      App.contracts.Yamconomy.deployed().then(function(instance){ //yam.json으로 변경하여서 컨트랙 진행
        //배포가 되었다면 인스턴스를 받아라.
        var reviewUtf8Encoded = utf8.encode(review);
        //한글이 쓰이므로 인코딩이 필요함.(utf8.js 라이브러리 추가)
        return instance.writeReview(id, web3.toHex(reviewUtf8Encoded),score, {from: account, value: price});
        //매개변수로 data를 넘김
        //이때 리뷰는 인코딩 한걸 다시 Hex로 변환이 필요함.
        //0이더를 보냄으로써 기록함.

      }).then(function(){ //잘 작동을 한다면
        $('#review').val('');//이전에 모달에 입력된 내용들을 지운다.
        $('#score').val('');
        $('#writeModal').modal('hide');
        return App.loadReview();
      }).catch(function(err){

        console.log(err.message);
      });
    });

  },

  loadReview: function() {
    App.contracts.Yamconomy.deployed().then(function(instance){
      return instance.getAllReviewers.call();
    }).then(function(reviewers){
      for( i = 0; i<reviewers.length; i++){
        //reviewers 는 10개의 배열 사이즈를 가지고 있으므로 10번 돌것이다.
        if(reviewers[i] !=='0x0000000000000000000000000000000000000000'){
          //이 배열에 들어가있는 주소가 없다면?
          //이더리움 주소길이인 40개의 0으로 초기화 해야함. 이더에선 NULL 로 대체불가.
          
          $('.panel-yamconomy').eq(i).find('.btn-review').text('리뷰작성완료').attr('disabled', true);
          //html의 yamconomy review 버튼을 리뷰 작성완료로 변경하고, 비활성화한다.
          $('.panel-yamconomy').eq(i).find('.btn-reviewerInfo').removeAttr('style');
          //이전에 숨김(display none)되어있던 reviwerInfo를 다시 보이게 해준다.

        }
      }
    }).catch(function(err){
      console.log(err.message);
    })
  },
	
  listenToEvents: function() {
	
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });

  $('#reviewModal').on('show.bs.modal',function(e){
    var id = $(e.relatedTarget).parent().find('.id').text();
    var price = web3.toWei(parseFloat($(e.relatedTarget).parent().find('.price').text()||0),"ether");

    $(e.currentTarget).find('#id').val(id);
    $(e.currentTarget).find('#price').val(price);
  });

  $('#reviewerInfoModal').on('show.bs.modal',function(e){
    var id = $(e.relatedTarget).parent().find('.id').text();

    App.contracts.Yamconomy.deployed().then(function(instance) {
      return instance.getReviewerInfo.call(id);
    }).then(function(reviewerInfo) {
      $(e.currentTarget).find('#reviewerAddress').text(reviewerInfo[0]);
      $(e.currentTarget).find('#reviewerReview').text(web3.toUtf8(reviewerInfo[1]));
      $(e.currentTarget).find('#reviewerScore').text(reviewerInfo[2]);
    }).catch(function(err) {
      console.log(err.message);
    })

  });
});
