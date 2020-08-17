import assignmentsService from '../../../services/assignmentsService'

export const EDIT_ASSIGNMENT_REQUEST = '@assignments/edit-assignment-request';
export const EDIT_ASSIGNMENT_SUCCESS = '@assignments/edit-assignment-success';
export const EDIT_ASSIGNMENT_FAILURE = '@assignments/edit-assignment-failure';

export function editAssignment(assignment) {
    return async (dispatch) => {
        try {
            dispatch({ type: EDIT_ASSIGNMENT_REQUEST });

            let editedAssignment = assignment; //await assignmentsService.add(assignment);

            dispatch({ 
                type: EDIT_ASSIGNMENT_SUCCESS, 
                payload: editedAssignment
            });
        } catch (error) {
            dispatch({ type: EDIT_ASSIGNMENT_FAILURE });
            throw error;
        }
    };
}