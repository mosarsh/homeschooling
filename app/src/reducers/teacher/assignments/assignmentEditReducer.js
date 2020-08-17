import produce from 'immer';

import { 
    EDIT_ASSIGNMENT_REQUEST,
    EDIT_ASSIGNMENT_SUCCESS,
    EDIT_ASSIGNMENT_FAILURE
} from '../../../actions/teacher/assignments/assignmentEditActions'

const initialState = {
    assignment: {},
    loading: false,
    error: null
};

const assignmentCreateReducer = (state = initialState, action) => {
    switch(action.type) {
        case EDIT_ASSIGNMENT_REQUEST: {
            return produce(state, (draft) => {
                draft.loading = true;
                draft.error = null;
            });
        }
        case EDIT_ASSIGNMENT_SUCCESS: {
            return produce(state, (draft) => {
                draft.assignment = action.payload;;
                draft.loading = false;
                draft.error = null;
            });
        }
        case EDIT_ASSIGNMENT_FAILURE: {
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