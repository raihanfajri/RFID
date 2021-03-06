  var limit = 5
  var pengguna = {}
  loadPengguna()
  function loadPengguna(url = null){
    $.ajax({
      method: 'GET',
      url: url == null? '/api/user/all' : url,
      type: 'json',
    }).done(function(res){
      $('#loading-pengguna').addClass('hidden')
      if(!res.err){
        pengguna = res.data
        if(pengguna.length > 0){
          $('#pengguna-not-found').addClass('hidden')
          $('#page-pengguna').html('')
          for(var i = 1; i <= Math.ceil(pengguna.length/limit); i++){
            $('#page-pengguna').append('<option value="'+ i +'">'+ i +'</option>')
          }
          $("#tabel-pengguna").html('')
          for(var i = 0; i < (pengguna.length < limit ? pengguna.length : limit); i++){
            var posisi = {
              id : pengguna[i].posisi,
              class: '-',
              name: '-'
            }
            if(posisi.id == 1){
              posisi['class'] = 'label label-success'
              posisi['name'] = 'Masuk'
            }else if(posisi.id == 0){
              posisi['class'] = 'label label-danger'
              posisi['name'] = 'Keluar'
            }
            $("#tabel-pengguna").append(
              '<tr>'+
                '<td>'+ pengguna[i].name +'</td>'+
                '<td>'+ pengguna[i].role.name +'</td>'+
                '<td><span class="label label-'+ (pengguna[i].status == 1 ? 'success' : 'danger') +'">'+ (pengguna[i].status == 1 ? 'Aktif' : 'Tidak Aktif') +'</span></td>'+
                '<td><span class="'+ posisi.class +'">'+ posisi.name +'</span></td>'+
                '<td>'+ pengguna[i].date +'</td>'+ (pengguna[i].status != 1 ? '<td></td>' :
                '<td><a style="cursor:pointer" onClick="updatePengguna('+ i +')"><i class="fa fa-edit"></a></i>&nbsp;&nbsp;&nbsp;<a style="cursor:pointer" onClick="deletePengguna('+ i +')"><i class="fa fa-trash-o"></i></a></td>')+
              '</tr>'
            )
          }
        }else{
          $("#tabel-pengguna").html('')
          $('#pengguna-not-found').removeClass('hidden')
        }
      }
    })
  }
  $('#page-pengguna').change(function(){
    var page = $('#page-pengguna').val()
    $("#tabel-pengguna").html('')
    for(var i = (page-1)*limit; i < ((page*limit) > pengguna.length ? pengguna.length : (page*limit)); i++){
      var posisi = {
        id : pengguna[i].posisi,
        class: '-',
        name: '-'
      }
      if(posisi.id == 1){
        posisi['class'] = 'label label-success'
        posisi['name'] = 'Masuk'
      }else if(posisi.id == 0){
        posisi['class'] = 'label label-danger'
        posisi['name'] = 'Keluar'
      }
      $("#tabel-pengguna").append(
            '<tr>'+
            '<td>'+ pengguna[i].name +'</td>'+
            '<td>'+ pengguna[i].role.name +'</td>'+
            '<td><span class="label label-'+ (pengguna[i].status == 1 ? 'success' : 'danger') +'">'+ (pengguna[i].status == 1 ? 'Aktif' : 'Tidak Aktif') +'</span></td>'+
            '<td><span class="'+ posisi.class +'">'+ posisi.name +'</span></td>'+
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
    var optionString = ''
    for(var i in kriteria){
      optionString += '<option value="'+ kriteria[i].id +'">'+ kriteria[i].name +'</option>'
    }
    $("#modal-default").modal()
    $("#modal-title").html('Edit Pengguna')
    $("#modal-body").html(
      '<div class="form-group">'+
        '<label>Nama Pengguna Kartu</label>'+
        '<input id="nama-pengguna"  type="text" class="form-control" placeholder="Masukan nama pengguna">'+
      '</div>'+
      '<div class="form-group">'+
        '<label>Kriteria Pengguna Kartu</label>'+
        '<select id="kriteria-pengguna" class="form-control">'+
          optionString+
        '</select>'+
      '</div>'
    )
    $('#nama-pengguna').val(pengguna[index].name)
    $('#kriteria-pengguna').val(pengguna[index].role.id)
    $('#modal-footer').html(
      '<button type="button" class="btn btn-default pull-left" data-dismiss="modal">Close</button>'+
      '<button type="button" onClick="submitPengguna('+ pengguna[index].id +', 2)" class="btn btn-primary">Save changes</button>'
    );
  }
  function detailPengguna(msg){
    var optionString = ''
    for(var i in kriteria){
      optionString += '<option value="'+ kriteria[i].id +'">'+ kriteria[i].name +'</option>'
    }
    $("#modal-default").modal()
    $("#modal-title").html('Edit Pengguna')
    $("#modal-body").html(
      '<div class="form-group">'+
        '<label>Nama Pengguna Kartu</label>'+
        '<input id="nama-pengguna"  type="text" class="form-control" placeholder="Masukan nama pengguna">'+
      '</div>'+
      '<div class="form-group">'+
        '<label>Kriteria Pengguna Kartu</label>'+
        '<select id="kriteria-pengguna" class="form-control">'+
          optionString+
        '</select>'+
      '</div>'
    )
    $('#nama-pengguna').val(msg.user_data.name)
    $('#kriteria-pengguna').val(msg.user_data.role.id)
    $('#modal-footer').html(
      '<button type="button" class="btn btn-default pull-left" data-dismiss="modal">Close</button>'+
      '<button type="button" onClick="submitPengguna('+ msg.user_data.user_id +', 2)" class="btn btn-primary">Save changes</button>'
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
  function filterPengguna(){
    var filter_kriteria = $('#kriteria-pengguna-filter').val()
    var filter_posisi = $('#posisi-pengguna').val()
    var filter_name = $('#nama-pengguna-filter').val()
    var url = '/api/user/filter?kriteria=' + filter_kriteria + '&posisi=' + filter_posisi + '&nama=' + filter_name
    loadPengguna(url)
  }