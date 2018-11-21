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