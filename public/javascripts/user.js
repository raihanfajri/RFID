  var limit = 5
  var pengguna = {}
  loadPengguna()
  function loadPengguna(){
    $('#loading-pengguna').removeClass('hidden')
    $.ajax({
      method: 'GET',
      url: '/api/user/all',
      type: 'json',
    }).done(function(res){
      $('#loading-pengguna').addClass('hidden')
      if(!res.err){
        pengguna = res.data
        if(pengguna.length > 0){
          $('#page-pengguna').html('')
          for(var i = 1; i <= Math.ceil(pengguna.length/limit); i++){
            $('#page-pengguna').append('<option value="'+ i +'">'+ i +'</option>')
          }
          $("#tabel-pengguna").html('')
          for(var i = 0; i < (pengguna.length < limit ? pengguna.length : limit); i++){
            $("#tabel-pengguna").append(
              '<tr>'+
                '<td>'+ pengguna[i].name +'</td>'+
                '<td>'+ pengguna[i].role.name +'</td>'+
                '<td><span class="label label-'+ (pengguna[i].status == 1 ? 'success' : 'danger') +'">'+ (pengguna[i].status == 1 ? 'aktif' : 'tidak aktif') +'</span></td>'+
                '<td>'+ pengguna[i].date +'</td>'+ (pengguna[i].status != 1 ? '<td></td>' :
                '<td><a style="cursor:pointer" onClick="updatePengguna('+ i +')"><i class="fa fa-edit"></a></i>&nbsp;&nbsp;&nbsp;<a style="cursor:pointer" onClick="deletePengguna('+ i +')"><i class="fa fa-trash-o"></i></a></td>')+
              '</tr>'
            )
          }
        }else{
          $('#pengguna-not-found').removeClass('hidden')
        }
      }
    })
  }
  $('#page-pengguna').change(function(){
    var page = $('#page-pengguna').val()
    $("#tabel-pengguna").html('')
    for(var i = (page-1)*limit; i < (page*limit); i++){
      $("#tabel-pengguna").append(
            '<tr>'+
            '<td>'+ pengguna[i].name +'</td>'+
            '<td>'+ pengguna[i].role.name +'</td>'+
            '<td><span class="label label-'+ (pengguna[i].status == 1 ? 'success' : 'danger') +'">'+ (pengguna[i].status == 1 ? 'aktif' : 'tidak aktif') +'</span></td>'+
            '<td>'+ pengguna[i].date +'</td>'+(pengguna[i].status != 1 ? '<td></td>' :
                '<td><a style="cursor:pointer" onClick="updatePengguna('+ i +')"><i class="fa fa-edit"></a></i>&nbsp;&nbsp;&nbsp;<a style="cursor:pointer" onClick="deletePengguna('+ i +')"><i class="fa fa-trash-o"></i></a></td>')+
            '</tr>'
        )
    }
  })
  function tambahPengguna(data){
    var optionString = ''
    for(var i in kriteria){
      optionString += '<option value="'+ kriteria[i].id +'">'+ kriteria[i].name +'</option>'
    }
    $("#modal-default").modal()
    $("#modal-title").html('Tambah Pengguna Kartu')
    $("#modal-body").html(
      '<div class="form-group">'+
        '<label>Nama Pengguna Kartu</label>'+
        '<input id="nama-pengguna" type="text" class="form-control" placeholder="Masukan nama pengguna">'+
      '</div>'+
      '<div class="form-group">'+
        '<label>Kriteria Pengguna Kartu</label>'+
        '<select id="kriteria-pengguna" class="form-control">'+
          optionString+
        '</select>'+
        '<input id="rfid-pengguna" class="hidden" type="text" value="'+ data.user_data.rfid +'">'+
      '</div>'
    )
    $('#modal-footer').html(
      '<button type="button" class="btn btn-default pull-left" data-dismiss="modal">Close</button>'+
      '<button type="button" onClick="submitPengguna(0, 1)" class="btn btn-primary">Save changes</button>'
    );
  }
  function submitPengguna(id, state){
    $("#modal-default").modal('hide');
    $('#tambah-pengguna').addClass('disabled');
    var data = {
      id: id,
      name: $('#nama-pengguna').val(),
      rfid: $('#rfid-pengguna').val(),
      role_id: $('#kriteria-pengguna').val()
    }
    var url = ''
    switch(state){
      case 1 : 
        url = '/api/user/create';
        break;
      case 2 :
        url = '/api/user/update';
        break;
      case 3 : 
        url = '/api/user/delete';
        break;
    }
    $.ajax({
      method: 'POST',
      url: url,
      type: 'json',
      data: data
    }).then(function(result){
      loadPengguna()
      loadKriteria()
    })
  }
  function updatePengguna(index){
    $("#modal-default").modal()
    $("#modal-title").html('Edit Pengguna')
    $("#modal-body").html(
      '<div class="form-group">'+
        '<label>Nama Pengguna</label>'+
        '<input id="nama-pengguna"  type="text" class="form-control" placeholder="Masukan nama pengguna">'+
      '</div>'+
      '<div class="form-group">'+
        '<label>Status</label>'+
        '<select id="status-pengguna" class="form-control">'+
          '<option value="0">Permanent</option>'+
          '<option value="1">Temporary</option>'+
        '</select>'+
      '</div>'
    )
    $('#nama-pengguna').val(pengguna[index].name)
    $('#status-pengguna').val(pengguna[index].status == 'Permanent'? 0 : 1)
    $('#modal-footer').html(
      '<button type="button" class="btn btn-default pull-left" data-dismiss="modal">Close</button>'+
      '<button type="button" onClick="submitPengguna('+ pengguna[index].id +', 2)" class="btn btn-primary">Save changes</button>'
    );
  }
  function deletePengguna(index){
    $("#modal-default").modal()
    $("#modal-title").html('Delete Pengguna')
    $("#modal-body").html(
      'Apakah anda yakin untuk menghapus pengguna <strong>'+ pengguna[index].name + '</strong>'
    )
    $('#modal-footer').html(
      '<button type="button" class="btn btn-default pull-left" data-dismiss="modal">Close</button>'+
      '<button type="button" onClick="submitPengguna('+ pengguna[index].id +', 3)" class="btn btn-danger">Delete</button>'
    );
  }