import { userConstants } from '../_constants';

let jwt = JSON.parse(localStorage.getItem('jwt'));
const initialState = jwt ? { loggedIn: true, jwt } : {};

export function authentication(state = initialState, action) {
  switch (action.type) {
    case userConstants.LOGIN_REQUEST:
      return {
        loggingIn: true
      };
    case userConstants.LOGIN_SUCCESS:
      return {
        loggedIn: true,
        jwt: action.jwt
      };
    case userConstants.LOGIN_FAILURE:
      return {};
    case userConstants.LOGOUT:
      return {};
    default:
      return state
  }
}