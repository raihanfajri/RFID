var user_data = {}
$('#login-form').submit(function(e){
    e.preventDefault()
    $('#error-login').addClass('hidden')
    var data = {
        username : $('#username').val(),
        password : $('#password').val()
    }
    $.ajax({
      method: 'POST',
      url: '/api/admin/login',
      type: 'json',
      data: data
    }).then(function(result){
      if(result.data.found){
          window.localStorage.setItem('token', result.data.token)
          window.location.assign('/dashboard')
      }else{
          $('#password').val('')
          $('#error-login').removeClass('hidden')
      }
    })
})

$(document).ready(function(){
    var token = window.localStorage.getItem('token')
    if(token != null){
        $.ajax({
            method: 'GET',
            url: '/api/admin/verify',
            type: 'json',
            headers: {'Authorization': token}
        }).then(function(result){
            if(result.data.verified){
                user_data = result.data.user_data
                if(user_data.role_admin_id == 1){
                    $('#daftar-admin').removeClass('hidden')
                }
                $('#nama-admin').html(result.data.user_data.username)
            }else{
                window.localStorage.clear()
                window.location.assign('/login')
            }
        })
    }
})

$('#logout').click(function(){
    window.localStorage.clear()
    window.location.assign('/login')
})

