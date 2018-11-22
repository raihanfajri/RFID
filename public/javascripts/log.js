  var limit = 5
  var log = {}
  loadLog()
  function loadLog(){
    $('#loading-log').removeClass('hidden')
    $.ajax({
      method: 'GET',
      url: '/api/logs/all',
      type: 'json',
    }).done(function(res){
      $('#loading-log').addClass('hidden')
      if(!res.err){
        log = res.data
        if(log.length > 0){
          $('#page-log').html('')
          for(var i = 1; i <= Math.ceil(log.length/limit); i++){
            $('#page-log').append('<option value="'+ i +'">'+ i +'</option>')
          }
          $("#tabel-log").html('')
          for(var i = 0; i < (log.length < limit ? log.length : limit); i++){
            $("#tabel-log").append(
              '<tr>'+
                '<td>'+ log[i].user.name +'</td>'+
                '<td>'+ log[i].user.role.name +'</td>'+
                '<td>'+ log[i].tujuan +'</td>'+
                '<td><span class="label label-'+ (log[i].status == 1 ? 'success' : 'danger') +'">'+ (log[i].status == 1 ? 'Masuk' : 'Keluar') +'</span></td>'+
                '<td>'+ log[i].checkin_time +'</td>'+
                '<td>'+ log[i].checkout_time +'</td>'+
                '<td><a style="cursor:pointer" onClick="updateLog('+ i +')"><i class="fa fa-edit"></a></i></td>'+
              '</tr>'
            )
          }
        }else{
          $('#log-not-found').removeClass('hidden')
        }
      }
    })
  }
  $('#page-log').change(function(){
    var page = $('#page-log').val()
    $("#tabel-log").html('')
    for(var i = (page-1)*limit; i < ((page*limit) > log.length ? log.length : (page*limit)); i++){
      $("#tabel-log").append(
        '<tr>'+
          '<td>'+ log[i].user.name +'</td>'+
          '<td>'+ log[i].user.role.name +'</td>'+
          '<td>'+ log[i].tujuan +'</td>'+
          '<td><span class="label label-'+ (log[i].status == 1 ? 'success' : 'danger') +'">'+ (log[i].status == 1 ? 'Masuk' : 'Keluar') +'</span></td>'+
          '<td>'+ log[i].checkin_time +'</td>'+
          '<td>'+ log[i].checkout_time +'</td>'+
          '<td><a style="cursor:pointer" onClick="updateLog('+ i +')"><i class="fa fa-edit"></a></i></td>'+
        '</tr>'
      )
    }
  })
  function submitLog(id, state){
    $("#modal-default").modal('hide');
    $('#tambah-log').addClass('disabled');
    $('#tambah-log').html('<i class="fa fa-refresh fa-spin" style="margin-left:35px;margin-right:35px"></i>');
    var data = {
      id: id,
      name: $('#nama-log').val(),
      delete_after_checkout: $('#status-log').val()
    }
    var url = ''
    switch(state){
      case 2 :
        url = '/api/log/update';
        break;
    }
    $.ajax({
      method: 'POST',
      url: url,
      type: 'json',
      data: data
    }).then(function(result){
      $('#tambah-log').removeClass('disabled');
      $('#tambah-log').html('Tambah Log');
      loadLog()
    })
  }
  function updateLog(index){
    $("#modal-default").modal()
    $("#modal-title").html('Edit Log')
    $("#modal-body").html(
      '<div class="form-group">'+
        '<label>Nama</label>'+
        '<input id="nama-log"  type="text" class="form-control" disabled>'+
      '</div>'+
      '<div class="form-group">'+
        '<label>Kriteria</label>'+
        '<input id="Kriteria-log"  type="text" class="form-control" disabled>'+
      '</div>'+
      '<div class="form-group">'+
        '<label>Tujuan</label>'+
        '<input id="tujuan-log"  type="text" class="form-control" placeholder="Masukan Tujuan">'+
      '</div>'
    )
    $('#tujuan-log').val((log[index].tujuan == '-'? null : log[index].tujuan))
    $('#nama-log').val(log[index].user.name)
    $('#kriteria-log').val(log[index].user.role.name)
    $('#modal-footer').html(
      '<button type="button" class="btn btn-default pull-left" data-dismiss="modal">Close</button>'+
      '<button type="button" onClick="submitLog('+ log[index].id +', 2)" class="btn btn-primary">Save changes</button>'
    );
  }