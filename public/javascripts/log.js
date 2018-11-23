  var limit = 5
  var log = {}
  loadLog()
  function loadLog(){
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
    var data = {
      id: id,
      tujuan: $('#tujuan-log').val(),
    }
    var url = ''
    switch(state){
      case 2 :
        url = '/api/logs/update';
        break;
    }
    $.ajax({
      method: 'POST',
      url: url,
      type: 'json',
      data: data
    }).then(function(result){
      loadLog()
    })
  }
  function updateLog(index, msg = null){
    var data = {}
    if(index == -1){
      data['id'] = msg.log_data.id
      data['tujuan'] = msg.tujuan
      data['nama'] = msg.user_data.name
      data['kriteria'] = msg.user_data.role.name
    }else{
      data['id'] = log[index].id
      data['tujuan'] = log[index].tujuan
      data['nama'] = log[index].user.name
      data['kriteria'] = log[index].user.role.name
    }
    $("#modal-default").modal()
    $("#modal-title").html('Edit Log')
    $("#modal-body").html(
      '<div class="form-group">'+
        '<label>Nama</label>'+
        '<input id="nama-log"  type="text" class="form-control" disabled>'+
      '</div>'+
      '<div class="form-group">'+
        '<label>Kriteria</label>'+
        '<input id="kriteria-log"  type="text" class="form-control" disabled>'+
      '</div>'+
      '<div class="form-group">'+
        '<label>Tujuan</label>'+
        '<input id="tujuan-log"  type="text" class="form-control" placeholder="Masukan Tujuan">'+
      '</div>'
    )
    $('#tujuan-log').val((data.tujuan == '-'? null : data.tujuan))
    $('#nama-log').val(data.nama)
    $('#kriteria-log').val(data.kriteria)
    $('#modal-footer').html(
      '<button type="button" class="btn btn-default pull-left" data-dismiss="modal">Close</button>'+
      '<button type="button" onClick="submitLog('+ data.id +', 2)" class="btn btn-primary">Save changes</button>'
    );
  }
  function checkoutLog(msg){
    $("#modal-default").modal()
    $("#modal-title").html('Checked Out')
    $("#modal-body").html(
      msg.user_data.role.name + '&nbsp;<strong>'+ msg.user_data.name + '</strong>&nbsp;telah keluar pada tanggal ' + msg.check_out.split(' ')[0] +
      ' jam ' + msg.check_out.split(' ')[1]
    )
    $('#modal-footer').html(
      '<button type="button" class="btn btn-default pull-left" data-dismiss="modal">Close</button>'
    );
  }