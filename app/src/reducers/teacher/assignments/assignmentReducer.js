import produce from 'immer';

import { 
    GET_ASSIGNMENT_REQUEST,
    GET_ASSIGNMENT_SUCCESS,
    GET_ASSIGNMENT_FAILURE,
} from '../../../actions/teacher/assignments/assignmentActions'

const initialState = {
    assignment: {},
    loading: false,
    error: null
};

const assignmentReducer = (state = initialState, action) => {

    switch(action.type) {
        case GET_ASSIGNMENT_REQUEST: {
            return produce(state, (draft) => {
                draft.loading = true;
                draft.error = null;
            });
        }
        case GET_ASSIGNMENT_SUCCESS: {
            return produce(state, (draft) => {
                draft.assignment = action.payload;
                draft.loading = false;
                draft.error = null;
            });
        }
        case GET_ASSIGNMENT_FAILURE: {
            return produce(state, (draft) => {
                draft.loading = false;
                draft.error = action.payload.error;
            })
        }
        default: {
            return state;
        }
    }

};

export default assignmentReducer;