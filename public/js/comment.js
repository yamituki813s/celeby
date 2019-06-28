var ng_word_list = [
  'うんち',
  'ウンチ',
  'うんこ',
  'ウンコ',
  '糞',
  'きちがい',
  'キチガイ',
  'ｷﾁｶﾞｲ',
  '乞食',
  '殺',
  'ころす',
  'コロス',
  'ザコ',
  'ざこ',
  '尿',
  '死',
  '尻',
  'レイプ',
  '土人',
  'ちんこ',
  'チンコ',
  '麻薬',
  'めくら',
  'shit',
  'けちんぼ',
];

/// メッセージの送信
function sendMessage(message) {
  return firebase.firestore().collection("comments").doc().set({
    author: firebase.auth().currentUser.uid,
    is_censored: false,
    text: message,
    created_at: new Date().getTime(),
  });
}

/// 投稿メッセージの表示
function showUploadMessage() {
  $('.loading').hide();
  $('.comment_message').show();
}

/// 完了メッセージの表示
function showCompleteMessage() {
  $('#message_box').val('');
  $('.complete_message').show();

  // 完了メッセージの表示と共に、（次の）画像投稿メッセージも表示する
  showUploadMessage();
}

/// 全ボタンの無効化
function disableButtons() {
  $('input').prop("disabled", true);
  $('.commenting').show();
}

/// 全ボタンの有効化
function enableButtons() {
  $('input').prop("disabled", false);
  $('.commenting').hide();
}

$(function() {
    // 匿名認証
    firebase.auth().signInAnonymously().catch(function(error) {
      console.error(error);
    }).then(function() {
      showUploadMessage();
    });

    // メッセージを送る
    $('#send_comment').click(function() {
      disableButtons();

      var message = $('#message_box').val();

      var is_ok = true;
      for (var i = 0; i < ng_word_list.length; i++) {
        if (message.match(ng_word_list[i])) {
          //alert('禁止ワード"' + ng_word_list[i] + '"が含まれています');
          alert('禁止ワードが含まれています');
          break;
        }
      }

      sendMessage(message).then(function() {
        enableButtons();
        // 完了メッセージ表示
        showCompleteMessage();
      }).catch(function(err) {
        enableButtons();
        alert(err);
      });
    });

});

