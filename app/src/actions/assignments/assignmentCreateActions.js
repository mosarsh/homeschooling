import assignmentsService from '../../services/assignmentsService'

export const CREATE_ASSIGNMENT_REQUEST = '@assignments/create-assignment-request';
export const CREATE_ASSIGNMENT_SUCCESS = '@assignments/create-assignment-success';
export const CREATE_ASSIGNMENT_FAILURE = '@assignments/create-assignment-failure';

export function createAssignment(assignment) {
    return async (dispatch) => {
        try {
            dispatch({ type: CREATE_ASSIGNMENT_REQUEST });

            let savedAssignment = assignment; //await assignmentsService.add(assignment);

            dispatch({ 
                type: CREATE_ASSIGNMENT_SUCCESS, 
                payload: savedAssignment
            });
        } catch (error) {
            dispatch({ type: CREATE_ASSIGNMENT_FAILURE });
            throw error;
        }
    };
}