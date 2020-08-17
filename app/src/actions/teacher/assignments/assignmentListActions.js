import assignmentsService from '../../../services/assignmentsService'
import { v4 as uuidv4 } from 'uuid';

export const GET_ASSIGNMENTS_REQUEST = '@assignments/get-assignments-request';
export const GET_ASSIGNMENTS_SUCCESS = '@assignments/get-assignments-success';
export const GET_ASSIGNMENTS_FAILURE = '@assignments/get-assignments-failure';

export function getAssignments() {

    return async (dispatch) => {
        try {

            dispatch({ type: GET_ASSIGNMENTS_REQUEST });

            const assignments = [
                {
                  id: uuidv4(),
                  topic: 'Vocabulaire-Étude ville',
                  description: 'Étude ville, quartier 2',
                  status: 'draft'
                },
                {
                    id: uuidv4(),
                    topic: 'Lecture_Compréhension',
                    description: 'Dessin mystère',
                    status: 'published'
                },
                {
                    id: uuidv4(),
                    topic: 'Maths/ Problèmes de logique 1-p.3',
                    description: '',
                    status: 'published'
                },
                {
                    id: uuidv4(),
                    topic: 'Le parc de la Gatineau du Haut des airs',
                    description: '',
                    status: 'published'
                },
                {
                    id: uuidv4(),
                    topic: 'Fiche du G (doux)',
                    description: 'Jeux',
                    status: 'draft'
                }
                
              ]//await assignmentsService.get();

            dispatch({
                type: GET_ASSIGNMENTS_SUCCESS,
                payload: { 
                    assignments 
                }
            });

        } catch (error) {
            dispatch({ type: GET_ASSIGNMENTS_FAILURE });
            throw error;
        }  
    }
}