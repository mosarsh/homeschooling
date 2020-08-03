import produce from 'immer';

import { 
    GET_STUDENTS_REQUEST,
    GET_STUDENTS_SUCCESS,
    GET_STUDENTS_FAILURE,
} from '../../actions/students/studentListActions'

const initialState = {
    students: [],
    loading: false,
    error: null
};

const studentListReducer = (state = initialState, action) => {

    switch(action.type) {
        case GET_STUDENTS_REQUEST: {
            return produce(state, (draft) => {
                draft.loading = true;
                draft.error = null;
            });
        }
        case GET_STUDENTS_SUCCESS: {
            const { students } = action.payload;
            return produce(state, (draft) => {
                draft.students = students;
                draft.loading = false;
                draft.error = null;
            });
        }
        case GET_STUDENTS_FAILURE: {
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

export default studentListReducer;