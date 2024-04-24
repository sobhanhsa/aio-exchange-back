let usernameRegex =/^(?=.*[a-zA-Z])[a-zA-Z0-9]+$/;

export function isUsernameValid(username:string) {
    if(!usernameRegex.test(username)) {
        return false
    }
    return true
}   
