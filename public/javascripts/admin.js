  var limit = 5
  var admin = {}
  loadAdmin()
  function loadAdmin(){
    $.ajax({
      method: 'GET',
      url: '/api/admin/all',
      type: 'json',
    }).done(function(res){
      $('#loading-admin').addClass('hidden')
      $('#admin-not-found').addClass('hidden')
      if(!res.err){
        admin = res.data
        if(admin.length > 0){
          $('#page-admin').html('')
          for(var i = 1; i <= Math.ceil(admin.length/limit); i++){
            $('#page-admin').append('<option value="'+ i +'">'+ i +'</option>')
          }
          $("#tabel-admin").html('')
          for(var i = 0; i < (admin.length < limit ? admin.length : limit); i++){
            $("#tabel-admin").append(
              '<tr>'+
                '<td>'+ admin[i].username +'</td>'+
                '<td><span class="label label-'+ (admin[i].status == 1 ? 'success' : 'danger') +'">'+ (admin[i].status == 1 ? 'Aktif' : 'Tidak Aktif') +'</span></td>'+
                '<td>'+ admin[i].date +'</td>'+ (admin[i].status != 1 ? '<td><a style="cursor:pointer" onClick="activateAdmin('+ i +')"><i class="fa fa-check-square-o"></a></i></td>' :
                '<td><a style="cursor:pointer" onClick="updateAdmin('+ i +')"><i class="fa fa-edit"></a></i>&nbsp;&nbsp;&nbsp;<a style="cursor:pointer" onClick="deleteAdmin('+ i +')"><i class="fa fa-trash-o"></i></a></td>')+
              '</tr>'
            )
          }
        }else{
          $('#admin-not-found').removeClass('hidden')
        }
      }
    })
  }
  $('#page-admin').change(function(){
    var page = $('#page-admin').val()
    $("#tabel-admin").html('')
    for(var i = (page-1)*limit; i < ((page*limit) > admin.length ? admin.length : (page*limit)); i++){
      $("#tabel-admin").append(
            '<tr>'+
              '<td>'+ admin[i].username +'</td>'+
              '<td><span class="label label-'+ (admin[i].status == 1 ? 'success' : 'danger') +'">'+ (admin[i].status == 1 ? 'Aktif' : 'Tidak Aktif') +'</span></td>'+
              '<td>'+ admin[i].date +'</td>'+ (admin[i].status != 1 ? '<td><a style="cursor:pointer" onClick="activateAdmin('+ i +')"><i class="fa fa-check-square-o"></a></i></td>' :
              '<td><a style="cursor:pointer" onClick="updateAdmin('+ i +')"><i class="fa fa-edit"></a></i>&nbsp;&nbsp;&nbsp;<a style="cursor:pointer" onClick="deleteAdmin('+ i +')"><i class="fa fa-trash-o"></i></a></td>')+
            '</tr>'
        )
    }
  })
  function tambahAdmin(){
    $("#modal-default").modal()
    $("#modal-title").html('Tambah Admin')
    $("#modal-body").html(
      '<div class="form-group">'+
        '<label>Userame Admin</label>'+
        '<input id="username-admin" type="text" class="form-control" placeholder="Masukan username admin">'+
      '</div>'+
      '<div class="form-group">'+
        '<label>Password Admin</label>'+
        '<div class="input-group">'+
        '<input id="password-admin" type="password" class="form-control" placeholder="Masukan password admin">'+
        '<span class="input-group-addon" style="cursor:pointer" onClick="showPassword()"><i id="eye" class="fa fa-eye"></i></span></div>'+
      '</div>'
    )
    $('#modal-footer').html(
      '<button type="button" class="btn btn-default pull-left" data-dismiss="modal">Close</button>'+
      '<button type="button" onClick="submitAdmin(0, 1)" class="btn btn-primary">Save changes</button>'
    );
  }
  function submitAdmin(id, state){
    $("#modal-default").modal('hide');
    $('#tambah-admin').addClass('disabled');
    var data = {
      id: id,
      username: $('#username-admin').val(),
      password: $('#password-admin').val(),
      role_admin: 2
    }
    var url = ''
    switch(state){
      case 1 : 
        url = '/api/admin/register';
        break;
      case 2 :
        url = '/api/admin/update';
        break;
      case 3 : 
        url = '/api/admin/delete';
        break;
      case 4 :
        url = '/api/admin/activate';
        break;
    }
    $.ajax({
      method: 'POST',
      url: url,
      type: 'json',
      data: data
    }).then(function(result){
      $('#tambah-admin').removeClass('disabled');
      loadAdmin()
    })
  }
  function updateAdmin(index){
    $("#modal-default").modal()
    $("#modal-title").html('Edit Admin')
    $("#modal-body").html(
      '<div class="form-group">'+
        '<label>Username Admin</label>'+
        '<input id="username-admin"  type="text" class="form-control" placeholder="Masukan username admin">'+
      '</div>'+
      '<div class="form-group">'+
        '<label>Password Admin Baru</label>'+
        '<div class="input-group">'+
        '<input id="password-admin" type="password" class="form-control" placeholder="Masukan password admin baru">'+
        '<span class="input-group-addon" style="cursor:pointer" onClick="showPassword()"><i id="eye" class="fa fa-eye"></i></span></div>'+
      '</div>'
    )
    $('#username-admin').val(admin[index].username)
    $('#modal-footer').html(
      '<button type="button" class="btn btn-default pull-left" data-dismiss="modal">Close</button>'+
      '<button type="button" onClick="submitAdmin('+ admin[index].id +', 2)" class="btn btn-primary">Save changes</button>'
    );
  }
  function deleteAdmin(index){
    $("#modal-default").modal()
    $("#modal-title").html('Delete Admin')
    $("#modal-body").html(
      'Apakah anda yakin untuk menghapus admin <strong>'+ admin[index].username + '</strong>'
    )
    $('#modal-footer').html(
      '<button type="button" class="btn btn-default pull-left" data-dismiss="modal">Close</button>'+
      '<button type="button" onClick="submitAdmin('+ admin[index].id +', 3)" class="btn btn-danger">Delete</button>'
    );
  }
  function showPassword(){
    var password = document.getElementById('password-admin')
    if(password.type === "password"){
        password.type = "text"
        document.getElementById('eye').setAttribute('class','fa fa-eye-slash')
    }else{
        password.type = "password"
        document.getElementById('eye').setAttribute('class','fa fa-eye')
    }
  }
  function activateAdmin(index){
    $("#modal-default").modal()
    $("#modal-title").html('Aktifkan Kembali Admin')
    $("#modal-body").html(
      'Apakah anda yakin untuk mengaktifkan kembali admin <strong>'+ admin[index].username + '</strong>'
    )
    $('#modal-footer').html(
      '<button type="button" class="btn btn-default pull-left" data-dismiss="modal">Close</button>'+
      '<button type="button" onClick="submitAdmin('+ admin[index].id +', 4)" class="btn btn-success">Aktifkan</button>'
    );
  }
  $('#button-nama-admin').click(function(){
    $("#modal-default").modal()
    $("#modal-title").html('Edit Admin')
    $("#modal-body").html(
      '<div class="form-group">'+
        '<label>Username Admin</label>'+
        '<input id="username-admin"  type="text" class="form-control" placeholder="Masukan username super admin">'+
      '</div>'+
      '<div class="form-group">'+
        '<label>Password Admin Baru</label>'+
        '<div class="input-group">'+
        '<input id="password-admin" type="password" class="form-control" placeholder="Masukan password super admin baru">'+
        '<span class="input-group-addon" style="cursor:pointer" onClick="showPassword()"><i id="eye" class="fa fa-eye"></i></span></div>'+
      '</div>'
    )
    $('#username-admin').val(user_data.username)
    $('#modal-footer').html(
      '<button type="button" class="btn btn-default pull-left" data-dismiss="modal">Close</button>'+
      '<button type="button" onClick="submitAdmin('+ user_data.id +', 2)" class="btn btn-primary">Save changes</button>'
    );
  })