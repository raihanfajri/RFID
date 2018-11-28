  var limit = 5
  var kebijakan = {}
  var dayOfWeek = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu']
  loadKebijakan()
  function loadKebijakan(){
    $.ajax({
      method: 'GET',
      url: '/api/policy/all',
      type: 'json',
    }).done(function(res){
      $('#loading-kebijakan').addClass('hidden')
      $('#kebijakan-not-found').addClass('hidden')
      if(!res.err){
        kebijakan = res.data
        if(kebijakan.length > 0){
          $('#page-kebijakan').html('')
          for(var i = 1; i <= Math.ceil(kebijakan.length/limit); i++){
            $('#page-kebijakan').append('<option value="'+ i +'">'+ i +'</option>')
          }
          $("#tabel-kebijakan").html('')
          for(var i = 0; i < (kebijakan.length < limit ? kebijakan.length : limit); i++){
            var days = ''
            for(var j = 0; j < kebijakan[i].policies.length; j++){
                days += '<td>'+ (kebijakan[i].policies[j].checkin == 1 ? '<span class="label label-success">Masuk</span>' : '<span class="label label-danger">Masuk</span>')
                days += (kebijakan[i].policies[j].checkout == 1 ? '<span class="label label-success">Keluar</span>' : '<span class="label label-danger">Keluar</span>')
                days += '</td>'
            }
            $("#tabel-kebijakan").append(
              '<tr>'+
                '<td>'+ kebijakan[i].name +'</td>'+
                days +
                '<td><a style="cursor:pointer" onClick="updateKebijakan('+ i +')"><i class="fa fa-edit"></a></i>&nbsp;&nbsp;&nbsp;<a style="cursor:pointer" onClick="deleteKebijakan('+ i +')"><i class="fa fa-trash-o"></i></a></td>'+
              '</tr>'
            )
          }
        }else{
          $('#kebijakan-not-found').removeClass('hidden')
        }
      }
    })
  }
  $('#page-kebijakan').change(function(){
    var page = $('#page-kebijakan').val()
    $("#tabel-kebijakan").html('')
    for(var i = (page-1)*limit; i < ((page*limit) > kebijakan.length ? kebijakan.length : (page*limit)); i++){
      $("#tabel-kebijakan").append(
            '<tr>'+
            '<td>'+ kebijakan[i].name +'</td>'+
            '<td>'+ kebijakan[i].role.name +'</td>'+
            '<td><span class="label label-'+ (kebijakan[i].status == 1 ? 'success' : 'danger') +'">'+ (kebijakan[i].status == 1 ? 'Aktif' : 'Tidak Aktif') +'</span></td>'+
            '<td>'+ kebijakan[i].date +'</td>'+(kebijakan[i].status != 1 ? '<td></td>' :
                '<td><a style="cursor:pointer" onClick="updateKebijakan('+ i +')"><i class="fa fa-edit"></a></i>&nbsp;&nbsp;&nbsp;<a style="cursor:pointer" onClick="deleteKebijakan('+ i +')"><i class="fa fa-trash-o"></i></a></td>')+
            '</tr>'
        )
    }
  })
  function tambahKebijakan(data){
    var optionString = ''
    var days = ''
    for(var i in kriteria){
      if(kebijakan.map(x => x.id != kriteria[i].id).indexOf(false) == -1){
        optionString += '<option value="'+ kriteria[i].id +'">'+ kriteria[i].name +'</option>'
      }
    }
    for(var i = 0; i< 7; i++){
        days += '<div class="form-group">'
        days += '<label class="col-sm-2 control-label" style="margin-top:10px">'+ dayOfWeek[i] +'</label>'
        days += '<div class="col-sm-10">'
        days += '<div class="checkbox">'
        days += '<label><input id="checkbox-masuk-'+ i +'" value="1" type="checkbox">Masuk</label>&nbsp;&nbsp;<label><input id="checkbox-keluar-'+ i +'" value="1" type="checkbox">Keluar</label>'
        days += '</div><hr></div></div>'

    }
    $("#modal-default").modal()
    $("#modal-title").html('Tambah Kebijakan Kartu')
    $("#modal-body").html(
      '<div class="form-group">'+
        '<label>Kriteria</label>'+
        '<select id="kriteria-kebijakan" class="form-control">'+
          optionString+
        '</select>'+
      '</div>'+
      days
    )
    $('#modal-footer').html(
      '<button type="button" class="btn btn-default pull-left" data-dismiss="modal">Close</button>'+
      '<button type="button" onClick="submitKebijakan(-1, 1)" class="btn btn-primary">Save changes</button>'
    );
  }
  function submitKebijakan(index, state){
    $("#modal-default").modal('hide');
    $('#tambah-kebijakan').addClass('disabled');
    var data = {
      role_id: $('#kriteria-kebijakan').val(),
      days : []
    }
    for(var i = 0; i < 7; i++){
        data.days.push({
            id : index != -1 ? kebijakan[index].policies[i].id : 0,
            role_id: $('#kriteria-kebijakan').val(),
            day : parseInt(i) + 1,
            checkin : $('#checkbox-masuk-'+i).is(':checked') ? 1 : 0,
            checkout : $('#checkbox-keluar-'+i).is(':checked') ? 1 : 0
        })
    }
    data.days = JSON.stringify(data.days)
    var url = ''
    switch(state){
      case 1 : 
        url = '/api/policy/create';
        break;
      case 2 :
        url = '/api/policy/update';
        break;
      case 3 : 
        url = '/api/policy/delete';
        break;
    }
    $.ajax({
      method: 'POST',
      url: url,
      type: 'json',
      data: data
    }).then(function(result){
      loadKebijakan()
      $('#tambah-kebijakan').removeClass('disabled');
    })
  }
  function updateKebijakan(index){
    var optionString = ''
    var days = ''
    for(var i in kriteria){
      if(kebijakan.map(x => x.id != kriteria[i].id).indexOf(false) == -1){
        optionString += '<option value="'+ kriteria[i].id +'">'+ kriteria[i].name +'</option>'
      }else if(kriteria[i].id == kebijakan[index].id){
        optionString += '<option value="'+ kriteria[i].id +'">'+ kriteria[i].name +'</option>'
      }
    }
    for(var i = 0; i< 7; i++){
        days += '<div class="form-group">'
        days += '<label class="col-sm-2 control-label" style="margin-top:10px">'+ dayOfWeek[i] +'</label>'
        days += '<div class="col-sm-10">'
        days += '<div class="checkbox">'
        days += '<label><input id="checkbox-masuk-'+ i +'" value="1" '+ (kebijakan[index].policies[i].checkin == 1 ? 'checked': '') +' type="checkbox">Masuk</label>&nbsp;&nbsp;<label><input id="checkbox-keluar-'+ i +'" value="1" '+ (kebijakan[index].policies[i].checkout == 1 ? 'checked': '') +' type="checkbox">Keluar</label>'
        days += '</div><hr></div></div>'

    }
    $("#modal-default").modal()
    $("#modal-title").html('Tambah Kebijakan Kartu')
    $("#modal-body").html(
      '<div class="form-group">'+
        '<label>Kriteria</label>'+
        '<select id="kriteria-kebijakan" class="form-control">'+
          optionString+
        '</select>'+
      '</div>'+
      days
    )
    $('#kriteria-kebijakan').val(kebijakan[index].id)
    $('#modal-footer').html(
      '<button type="button" class="btn btn-default pull-left" data-dismiss="modal">Close</button>'+
      '<button type="button" onClick="submitKebijakan('+ index +', 2)" class="btn btn-primary">Save changes</button>'
    );
  }
  function deleteKebijakan(index){
    $("#modal-default").modal()
    $("#modal-title").html('Delete Kebijakan')
    $("#modal-body").html(
      'Apakah anda yakin untuk menghapus kebijakan <strong>'+ kebijakan[index].name + '</strong>'
    )
    $('#modal-footer').html(
      '<button type="button" class="btn btn-default pull-left" data-dismiss="modal">Close</button>'+
      '<button type="button" onClick="submitKebijakan('+ index +', 3)" class="btn btn-danger">Delete</button>'
    );
  }