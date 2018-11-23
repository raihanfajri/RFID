const ROLE_SUPER_ADMIN = 1;
const ROLE_ADMIN = 2;

exports.roleAdminNumberToString = function(adminNumber){
    switch (adminNumber){
        case ROLE_SUPER_ADMIN : 
            return 'Super Admin';
        case ROLE_ADMIN :
            return 'Admin';
        default :
            return null
    }
}

exports.roleAdminStringToNumber = function(adminString){
    switch (adminString){
        case 'Super Admin' : 
            return ROLE_SUPER_ADMIN;
        case 'Admin' :
            return ROLE_ADMIN;
        default :
            return null
    }
}

exports.convertToGMT7 = function(time, offset){
    var date = new Date(time)
    var utc = date.getTime() + ((offset*(-60)) * 60000)
    var gmt7 = new Date(utc + (3600000*7))
    gmt7 = gmt7.getDate() + '-' + (gmt7.getMonth()+1) + '-' + gmt7.getFullYear() + ' ' + 
            (gmt7.getHours()<10? '0' : '') + gmt7.getHours() + ':' + (gmt7.getMinutes()<10? '0' : '') + gmt7.getMinutes()
    return gmt7;
}