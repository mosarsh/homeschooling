export function authHeader() {
    // return authorization header with jwt token
    let jwt = JSON.parse(localStorage.getItem('jwt'));

    if (jwt && jwt.token) {
        return { 'Authorization': 'Bearer ' + jwt.token };
    } else {
        return {};
    }
}