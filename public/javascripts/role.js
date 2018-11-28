  var limit = 5
  var kriteria = {}
  loadKriteria()
  function loadKriteria(){
    $.ajax({
      method: 'GET',
      url: '/api/role/list',
      type: 'json',
    }).done(function(res){
      $('#loading-kriteria').addClass('hidden')
      if(!res.err){
        kriteria = res.data
        if(res.data.length > 0){
          $('#kriteria-not-found').addClass('hidden')
          $('#page-kriteria').html('')
          for(var i = 1; i <= Math.ceil(res.data.length/limit); i++){
            $('#page-kriteria').append('<option value="'+ i +'">'+ i +'</option>')
          }
          $("#tabel-kriteria").html('')
          for(var i = 0; i < (res.data.length < limit ? res.data.length : limit); i++){
            $("#tabel-kriteria").append(
              '<tr>'+
                '<td>'+ res.data[i].name +'</td>'+
                '<td>'+ res.data[i].status +'</td>'+
                '<td>'+ res.data[i].count_users +'</td>'+
                '<td><a style="cursor:pointer" onClick="updateKriteria('+ i +')"><i class="fa fa-edit"></a></i>&nbsp;&nbsp;&nbsp;<a style="cursor:pointer" onClick="deleteKriteria('+ i +')"><i class="fa fa-trash-o"></i></a></td>'+
              '</tr>'
            )
          }
          var optionString = '<option value="-1">Semua</option>'
          for(var i in kriteria){
            optionString += '<option value="'+ kriteria[i].id +'">'+ kriteria[i].name +'</option>'
          }
          $('#kriteria-pengguna-filter').html(optionString)
        }else{
          $('#kriteria-not-found').removeClass('hidden')
        }
      }
    })
  }
  $('#page-kriteria').change(function(){
    var page = $('#page-kriteria').val()
    $("#tabel-kriteria").html('')
    for(var i = (page-1)*limit; i < ((page*limit) > kriteria.length ? kriteria.length : (page*limit)); i++){
      $("#tabel-kriteria").append(
        '<tr>'+
          '<td>'+ kriteria[i].name +'</td>'+
          '<td>'+ kriteria[i].status +'</td>'+
          '<td>'+ kriteria[i].count_users +'</td>'+
          '<td><a style="cursor:pointer" onClick="updateKriteria('+ i +')><i class="fa fa-edit"></a></i>&nbsp;&nbsp;&nbsp;<a style="cursor:pointer" onClick="deleteKriteria('+ i +')><i class="fa fa-trash-o"></i></a></td>'+
        '</tr>'
      )
    }
  })
  $('#tambah-kriteria').click(function(){
    $("#modal-default").modal()
    $("#modal-title").html('Tambah Kriteria')
    $("#modal-body").html(
      '<div class="form-group">'+
        '<label>Nama Kriteria</label>'+
        '<input id="nama-kriteria" type="text" class="form-control" placeholder="Masukan nama kriteria">'+
      '</div>'+
      '<div class="form-group">'+
        '<label>Status</label>'+
        '<select id="status-kriteria" class="form-control">'+
          '<option value="0">Permanent</option>'+
          '<option value="1">Temporary</option>'+
        '</select>'+
      '</div>'
    )
    $('#modal-footer').html(
      '<button type="button" class="btn btn-default pull-left" data-dismiss="modal">Close</button>'+
      '<button type="button" onClick="submitKriteria(0, 1)" class="btn btn-primary">Save changes</button>'
    );
  })
  function submitKriteria(id, state){
    $("#modal-default").modal('hide');
    $('#tambah-kriteria').addClass('disabled');
    $('#tambah-kriteria').html('<i class="fa fa-refresh fa-spin" style="margin-left:35px;margin-right:35px"></i>');
    var data = {
      id: id,
      name: $('#nama-kriteria').val(),
      delete_after_checkout: $('#status-kriteria').val()
    }
    var url = ''
    switch(state){
      case 1 : 
        url = '/api/role/create';
        break;
      case 2 :
        url = '/api/role/update';
        break;
      case 3 : 
        url = '/api/role/delete';
        break;
    }
    $.ajax({
      method: 'POST',
      url: url,
      type: 'json',
      data: data
    }).then(function(result){
      $('#tambah-kriteria').removeClass('disabled');
      $('#tambah-kriteria').html('Tambah Kriteria');
      loadKriteria()
    })
  }
  function updateKriteria(index){
    $("#modal-default").modal()
    $("#modal-title").html('Edit Kriteria')
    $("#modal-body").html(
      '<div class="form-group">'+
        '<label>Nama Kriteria</label>'+
        '<input id="nama-kriteria"  type="text" class="form-control" placeholder="Masukan nama kriteria">'+
      '</div>'+
      '<div class="form-group">'+
        '<label>Status</label>'+
        '<select id="status-kriteria" class="form-control">'+
          '<option value="0">Permanent</option>'+
          '<option value="1">Temporary</option>'+
        '</select>'+
      '</div>'
    )
    $('#nama-kriteria').val(kriteria[index].name)
    $('#status-kriteria').val(kriteria[index].status == 'Permanent'? 0 : 1)
    $('#modal-footer').html(
      '<button type="button" class="btn btn-default pull-left" data-dismiss="modal">Close</button>'+
      '<button type="button" onClick="submitKriteria('+ kriteria[index].id +', 2)" class="btn btn-primary">Save changes</button>'
    );
  }
  function deleteKriteria(index){
    $("#modal-default").modal()
    $("#modal-title").html('Delete Kriteria')
    $("#modal-body").html(
      'Apakah anda yakin untuk menghapus kriteria <strong>'+ kriteria[index].name + '</strong>'
    )
    $('#modal-footer').html(
      '<button type="button" class="btn btn-default pull-left" data-dismiss="modal">Close</button>'+
      '<button type="button" onClick="submitKriteria('+ kriteria[index].id +', 3)" class="btn btn-danger">Delete</button>'
    );
  }