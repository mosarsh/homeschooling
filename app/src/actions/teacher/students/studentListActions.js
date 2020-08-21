//import studentsService from '../../services/studentsService'
import moment from 'moment';

export const GET_STUDENTS_REQUEST = '@assignments/get-students-request';
export const GET_STUDENTS_SUCCESS = '@assignments/get-students-success';
export const GET_STUDENTS_FAILURE = '@assignments/get-students-failure';

export function getStudents() {

    return async (dispatch) => {
        try {

            dispatch({ type: GET_STUDENTS_REQUEST });

            const students = [
                {
                  id: '5e887a62195cc5aef7e8ca5e',
                  name: 'Timothé Rigal',
                  email: 'timothé.rigal@gmail.com',
                  avatar: '/static/images/avatars/avatar_1.png',
                  status: 'joined'
                },
                {
                  id: '5e887a62195cc5aef7e8ca5d',
                  name: 'Théodore Jauffret',
                  email: 'théodore.jauffret@gmail.com',
                  avatar: '/static/images/avatars/avatar_2.png',
                  status: 'joined'
                },
                {
                  id: '5e887ac47eed253091be10cb',
                  name: 'Denis Vasseur',
                  email: 'denis.vas@gmail.com',
                  avatar: '/static/images/avatars/avatar_3.png',
                  status: 'joined'
                },
                {
                  id: '5e887b209c28ac3dd97f6db5',
                  name: 'Joëlle Martin',
                  email: 'joëlle.martin@gmail.com',
                  avatar: '/static/images/avatars/avatar_4.png',
                  status: 'joined'
                },
                {
                  id: '5e887b7602bdbc4dbb234b27',
                  name: 'Jean-Baptiste Trouvé',
                  email: 'jean-baptiste@gmail.com',
                  avatar: '/static/images/avatars/avatar_5.png',
                  status: 'joined'
                },
                {
                  id: '5e86809283e28b96d2d38537',
                  name: 'René Balzac',
                  email: 'rene.balzac@gmail.com',
                  avatar: '/static/images/avatars/avatar_6.png',
                  status: 'joined'
                },
                {
                  id: '5e86805e2bafd54f66cc95c3',
                  name: 'Théo Lavigne',
                  email: 'theo.lavigne@gmail.com',
                  avatar: '/static/images/avatars/avatar_7.png',
                  status: 'pending'
                },
                {
                  id: '5e887a1fbefd7938eea9c981',
                  name: 'Bérénice Grandis',
                  email: 'berenice.grandis@gmail.com',
                  avatar: '/static/images/avatars/avatar_8.png',
                  status: 'joined'
                },
                {
                  id: '5e887d0b3d090c1b8f162003',
                  name: 'Rachelle Cousteau',
                  email: 'rachelle.cousteau@gmail.com',
                  avatar: '/static/images/avatars/avatar_9.png',
                  status: 'joined'
                },
                {
                  id: '5e88792be2d4cfb4bf0971d9',
                  name: 'Olivier Auvray',
                  email: 'olivier.auvray@gmail.com',
                  avatar: '/static/images/avatars/avatar_10.png',
                  status: 'joined'
                },
                {
                  id: '5e8877da9a65442b11551975',
                  name: 'Stéphane Le Tonnelier',
                  email: 'stephane.tonn@gmail.com',
                  avatar: '/static/images/avatars/avatar_11.png',
                  status: 'joined'
                },
                {
                  id: '5e8680e60cba5019c5ca6fda',
                  name: 'Victor Courbet',
                  email: 'victor.courbet@gmail.com',
                  avatar: '/static/images/avatars/avatar_12.png',
                  status: 'joined'
                }
              ]//await assignmentsService.get();

            dispatch({
                type: GET_STUDENTS_SUCCESS,
                payload: { 
                    students
                }
            });

        } catch (error) {
            dispatch({ type: GET_STUDENTS_FAILURE });
            throw error;
        }  
    }
}