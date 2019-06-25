/// 画像の回転＆リサイズ
function resizeImage(file) {
  var deferred = new $.Deferred();

  // EXIFを使って、画像の向きを取得
  EXIF.getData(file, function() {
    var elemSrcKeeper = document.getElementById('src_keeper');

    // MegaPixImageを使って、画像を縮小＆回転
    var megaPixImage = new MegaPixImage(file);
    megaPixImage.render(elemSrcKeeper, { maxWidth: 1024, orientation: file.exifdata.Orientation }, function() {
      var src = $(elemSrcKeeper).attr('src');
      deferred.resolve(src);
    });
  });
  return deferred.promise();
}

/// 画像のアップロード
function uploadImage(base64Image) {
  // ファイル名はランダム文字列
  var fileName = Math.floor(Math.random() * 100000000) + '.jpg';

  var storageRef = firebase.storage().ref();
  var fileRef = storageRef.child(fileName);

  // CloudStorageに画像ファイルをアップロード
  return fileRef.putString(base64Image, 'base64').then(function(file) {
    // アップロードが正常に終わったら、Firestoreにドキュメントも登録
    return firebase.firestore().collection("images").doc().set({
      author: firebase.auth().currentUser.uid,
      is_censored: false,
      url: "https://storage.googleapis.com/" + file.metadata.bucket + "/" + file.metadata.fullPath,
      created_at: new Date().getTime(),
    })
  });
}

/// 画像投稿メッセージの表示
function showUploadMessage() {
  $('.loading').hide();
  $('#file_selector').val('画像を選ぶ').show();
  $('.upload_message').show();
}

/// 確認メッセージの表示
function showConfirmMessage() {
  $('.complete_message').hide();

  $('#file_selector').val('別の画像に変える');
  $('.confirm_message').show();
}

/// 完了メッセージの表示
function showCompleteMessage() {
  $('#src_keeper').attr('src', '');
  $('.confirm_message').hide();
  $('.complete_message').show();

  // 完了メッセージの表示と共に、（次の）画像投稿メッセージも表示する
  showUploadMessage();
}

/// 全ボタンの無効化
function disableButtons() {
  $('input[type=button]').prop("disabled", true);
  $('.uploading').show();
}

/// 全ボタンの有効化
function enableButtons() {
  $('input[type=button]').prop("disabled", false);
  $('.uploading').hide();
}

$(function() {
    // 匿名認証
    firebase.auth().signInAnonymously().catch(function(error) {
      console.error(error);
    }).then(function() {
      showUploadMessage();
    });

    // 画像を選ぶ
    $('#file_selector').click(function() {  
      $('#file_holder').click();
    });

    $('#file_holder').on('change', function() {
      // 画像加工
      resizeImage(this.files[0]).then(function(src) {
        // 画像加工が完了したら確認メッセージを表示
        showConfirmMessage();
      });
    });

    // 画像をアップロード
    $('#button_upload').click(function() {
      disableButtons();

      var base64Image = $('#src_keeper').attr('src').replace(/^data:image\/jpeg;base64,/, '');

      // 画像アップロード
      uploadImage(base64Image).then(function() {
        enableButtons();
        // 完了メッセージ表示
        showCompleteMessage();    
      }).catch(function(err) {
        enableButtons();
        alert(err);
      });
    });

});

