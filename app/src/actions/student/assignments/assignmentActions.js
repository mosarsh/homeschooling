
import { v4 as uuidv4 } from 'uuid';

export const GET_STUDENT_ASSIGNMENTS_REQUEST = '@student/assignments/get-assignment-request';
export const GET_STUDENT_ASSIGNMENTS_SUCCESS = '@student/assignments/get-assignment-success';
export const GET_STUDENT_ASSIGNMENTS_FAILURE = '@student/assignments/get-assignment-failure';

export function getAssignment() {

    return async (dispatch) => {
        try {

            dispatch({ type: GET_STUDENT_ASSIGNMENTS_REQUEST });

            const assignments = [
                {
                    id: uuidv4(),
                    img: 'https://mail.google.com/mail/u/0?ui=2&ik=2713a812ed&attid=0.1&permmsgid=msg-f%3A1666354812829777936&th=172014dfa07b4010&view=snatt&disp=thd&safe=1&sz=w360-h240-p-nu',
                    title: 'Aiguise ton crayon2  p.4.pdf',
                    type: 'pdf',
                    url: 'https://mail.google.com/mail/u/0?ui=2&ik=2713a812ed&attid=0.1&permmsgid=msg-f:1666354812829777936&th=172014dfa07b4010&view=att&disp=inline',
                    desc: 'This impressive paella is a perfect party dish and a fun meal to cook together with your guests. Add 1 cup of frozen peas along with the mussels, if you like.',
                },
                {
                    id: uuidv4(),
                    img: 'https://mail.google.com/mail/u/0?ui=2&ik=2713a812ed&attid=0.11&permmsgid=msg-f%3A1666354812829777936&th=172014dfa07b4010&view=snatt&disp=thd&safe=1&sz=w360-h240-p-nu',
                    title: 'TÉtude_métiers_gn.pdf',
                    type: 'pdf',
                    url: 'https://mail.google.com/mail/u/0?ui=2&ik=2713a812ed&attid=0.11&permmsgid=msg-f:1666354812829777936&th=172014dfa07b4010&view=att&disp=inline',
                    desc: 'This impressive paella is a perfect party dish and a fun meal to cook ',
                },
                {
                    id: uuidv4(),
                    img: 'https://i.ytimg.com/vi/H8tbrSx537I/hqdefault.jpg?sqp=-oaymwEZCNACELwBSFXyq4qpAwsIARUAAIhCGAFwAQ==&rs=AOn4CLCiu-Z3zlbPK8W2P38vr7niZ3ObbQ',
                    title: 'Jogging mathématique no 2',
                    type: 'youtube',
                    url:'https://www.youtube.com/embed/vxeDgDoZBJo',
                    desc: 'This impressive paella is a perfect party dish and a fun meal to cook together with your guests. Add 1 cup of frozen peas along with the mussels, if you like.',
                },
                {
                    id: uuidv4(),
                    img: 'https://mail.google.com/mail/u/0?ui=2&ik=2713a812ed&attid=0.22&permmsgid=msg-f%3A1666354812829777936&th=172014dfa07b4010&view=snatt&disp=thd&safe=1&sz=w360-h240-p-nu',
                    title: 'réécrire le mot Métiers.pdf',
                    type: 'pdf',
                    url: 'https://mail.google.com/mail/u/0?ui=2&ik=2713a812ed&attid=0.22&permmsgid=msg-f:1666354812829777936&th=172014dfa07b4010&view=att&disp=inline',
                    desc: 'This impressive paella is a perfect party dish and a fun meal to cook together with your guests. Add 1 cup of frozen peas along with the mussels, if you like.',
                },
                {
                    id: uuidv4(),
                    img: 'https://mail.google.com/mail/u/0?ui=2&ik=2713a812ed&attid=0.16&permmsgid=msg-f%3A1666354812829777936&th=172014dfa07b4010&view=snatt&disp=thd&safe=1&sz=w360-h240-p-nu',
                    title: 'Les nombres tout compris 76.pdf',
                    type: 'pdf',
                    url:'https://mail.google.com/mail/u/0?ui=2&ik=2713a812ed&attid=0.16&permmsgid=msg-f:1666354812829777936&th=172014dfa07b4010&view=att&disp=inline',
                    desc: 'This impressive paella is a perfect party dish and a fun meal to cook together with your guests. Add 1 cup of frozen peas along with the mussels, if you like.',
                },
                {
                    id: uuidv4(),
                    img: 'https://mail.google.com/mail/u/0?ui=2&ik=2713a812ed&attid=0.24&permmsgid=msg-f%3A1666354812829777936&th=172014dfa07b4010&view=snatt&disp=thd&safe=1&sz=w360-h240-p-nu',
                    title: 'Rosalie chez le médecin.pdf',
                    type: 'pdf',
                    url:'https://mail.google.com/mail/u/0?ui=2&ik=2713a812ed&attid=0.24&permmsgid=msg-f:1666354812829777936&th=172014dfa07b4010&view=att&disp=inline',
                    desc: 'This impressive paella is a perfect party dish and a fun meal to cook together with your guests. Add 1 cup of frozen peas along with the mussels, if you like.',
                },
                {
                    id: uuidv4(),
                    img: 'https://mail.google.com/mail/u/0?ui=2&ik=2713a812ed&attid=0.7&permmsgid=msg-f%3A1666354812829777936&th=172014dfa07b4010&view=snatt&disp=thd&safe=1&sz=w360-h240-p-nu',
                    title: 'Devinette-Les métiers.pdf',
                    type: 'pdf',
                    url:'https://mail.google.com/mail/u/0?ui=2&ik=2713a812ed&attid=0.7&permmsgid=msg-f:1666354812829777936&th=172014dfa07b4010&view=att&disp=inline',
                    desc: 'This impressive paella is a perfect party dish and a fun meal to cook together with your guests. Add 1 cup of frozen peas along with the mussels, if you like.',
                }

                
            ];
                
            //service call here

            return dispatch({
                type: GET_STUDENT_ASSIGNMENTS_SUCCESS,
                payload: { 
                    assignments
                }
            });

        } catch (error) {
            dispatch({ type: GET_STUDENT_ASSIGNMENTS_FAILURE });
            throw error;
        }  
    }
}