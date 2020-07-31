import produce from 'immer';

import { 
    GET_ASSIGNMENTS_REQUEST,
    GET_ASSIGNMENTS_SUCCESS,
    GET_ASSIGNMENTS_FAILURE,
} from '../../actions/assignments/assignmentListActions'

const initialState = {
    assignments: [],
    loading: false,
    error: null
};

const assignmentListReducer = (state = initialState, action) => {

    switch(action.type) {
        case GET_ASSIGNMENTS_REQUEST: {
            return produce(state, (draft) => {
                draft.loading = true;
                draft.error = null;
            });
        }
        case GET_ASSIGNMENTS_SUCCESS: {
            const { assignments } = action.payload;
            return produce(state, (draft) => {
                draft.assignments = assignments;
                draft.loading = false;
                draft.error = null;
            });
        }
        case GET_ASSIGNMENTS_FAILURE: {
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

export default assignmentListReducer;