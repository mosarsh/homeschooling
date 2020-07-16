import { userConstants } from '../_constants';

let user = JSON.parse(localStorage.getItem('me'));
const initialState = user || {};

export function me(state = initialState, action) {
  switch (action.type) {
    case userConstants.GETME_REQUEST:
      return {
        loading: true
      };
    case userConstants.GETME_SUCCESS:
      return {
        user: action.user
      };
    case userConstants.GETME_FAILURE:
      return { 
        error: action.error
      };
    default:
      return state
  }
}