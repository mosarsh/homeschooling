import assignmentsService from '../../services/assignmentsService';
import { v4 as uuidv4 } from 'uuid';

export const GET_ASSIGNMENT_REQUEST = '@assignments/get-assignment-request';
export const GET_ASSIGNMENT_SUCCESS = '@assignments/get-assignment-success';
export const GET_ASSIGNMENT_FAILURE = '@assignments/get-assignment-failure';

export function getAssignment() {

    return async (dispatch) => {
        try {
            debugger;
            dispatch({ type: GET_ASSIGNMENT_REQUEST });

            const assignment = {
                  id: uuidv4(),
                  topic: 'Vocabulaire-Étude ville',
                  description: 'Étude ville, quartier 2',
                  status: 'draft',
                  date:'07/29/2020',
                  resources: [
                    {
                      id: '1-6u4YwZ6yrwW1g1AIC6sp6N3wZxDRS5-DLLPjv04nZo',
                      mimeType: 'application/vnd.google-apps.document',
                      icon: 'https://drive-thirdparty.googleusercontent.com/16/type/application/vnd.google-apps.document',
                      name: 'Untitled document',
                      url: 'https://docs.google.com/document/d/1-6u4YwZ6yrwW1g1AIC6sp6N3wZxDRS5-DLLPjv04nZo/edit?usp=drive_web',
                      embedUrl: 'https://docs.google.com/document/d/1-6u4YwZ6yrwW1g1AIC6sp6N3wZxDRS5-DLLPjv04nZo/preview',
                      serviceId: 'doc'
                    },
                    {
                      id: '1LVM2104n0l3X4d8f4oZuZcDAnbV6hHsiLeIifJS3LfY',
                      mimeType: 'application/vnd.google-apps.form',
                      icon: 'https://drive-thirdparty.googleusercontent.com/16/type/application/vnd.google-apps.form',
                      name: 'Blank Quiz',
                      url: 'https://docs.google.com/forms/d/1LVM2104n0l3X4d8f4oZuZcDAnbV6hHsiLeIifJS3LfY/edit?usp=drive_web',
                      embedUrl: 'https://docs.google.com/forms/d/1LVM2104n0l3X4d8f4oZuZcDAnbV6hHsiLeIifJS3LfY/viewform?embedded=true&usp=drive_web',
                      serviceId: 'freebird'
                    },
                    {
                      id: '1E81b0QFvp4-Gd4CVXKOndL_npyBt9Gl3f1SMX0gvTGo',
                      mimeType: 'application/vnd.google-apps.document',
                      icon: 'https://drive-thirdparty.googleusercontent.com/16/type/application/vnd.google-apps.document',
                      name: 'Untitled document',
                      url: 'https://docs.google.com/document/d/1E81b0QFvp4-Gd4CVXKOndL_npyBt9Gl3f1SMX0gvTGo/edit?usp=drive_web',
                      embedUrl: 'https://docs.google.com/document/d/1E81b0QFvp4-Gd4CVXKOndL_npyBt9Gl3f1SMX0gvTGo/preview',
                      serviceId: 'doc'
                    },
                    {
                      id: '1EipRirtd3Rckj8qQ-ZAJVFG7W8chTKoDy6mgE7hRkqs',
                      mimeType: 'application/vnd.google-apps.spreadsheet',
                      icon: 'https://drive-thirdparty.googleusercontent.com/16/type/application/vnd.google-apps.spreadsheet',
                      name: 'ETC Tennis Junior Group Lessons 2020',
                      url: 'https://docs.google.com/spreadsheets/d/1EipRirtd3Rckj8qQ-ZAJVFG7W8chTKoDy6mgE7hRkqs/edit?usp=drive_web',
                      embedUrl: 'https://docs.google.com/spreadsheets/d/1EipRirtd3Rckj8qQ-ZAJVFG7W8chTKoDy6mgE7hRkqs/htmlembed',
                      serviceId: 'spread'
                    }
                  ]
                }
                
            //await assignmentsService.get(assignmnetId);

            dispatch({
                type: GET_ASSIGNMENT_SUCCESS,
                payload: { 
                    assignment
                }
            });

        } catch (error) {
            dispatch({ type: GET_ASSIGNMENT_FAILURE });
            throw error;
        }  
    }
}