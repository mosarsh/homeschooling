import produce from 'immer';

import { 
    CREATE_ASSIGNMENT_REQUEST,
    CREATE_ASSIGNMENT_SUCCESS,
    CREATE_ASSIGNMENT_FAILURE
} from '../../actions/assignments/assignmentCreateActions'

const initialState = {
    assignment: {},
    loading: false,
    error: null
};

const assignmentCreateReducer = (state = initialState, action) => {
    switch(action.type) {
        case CREATE_ASSIGNMENT_REQUEST: {
            return produce(state, (draft) => {
                draft.loading = true;
                draft.error = null;
            });
        }
        case CREATE_ASSIGNMENT_SUCCESS: {
            return produce(state, (draft) => {
                draft.assignment = action.payload;;
                draft.loading = false;
                draft.error = null;
            });
        }
        case CREATE_ASSIGNMENT_FAILURE: {
            return produce(state, (draft) => {
                draft.loading = false;
                draft.error = action.payload.error;
            });
        }
        default: {
            return state;
        }
    }
};

export default assignmentCreateReducer;