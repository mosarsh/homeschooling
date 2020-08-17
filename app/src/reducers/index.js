import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import accountReducer from './accountReducer';
import notificationsReducer from './notificationsReducer';
import chatReducer from './chatReducer';
import mailReducer from './mailReducer';
import kanbanReducer from './kanbanReducer';
import assignmentListReducer from './teacher/assignments/assignmentListReducer';
import assignmentCreateReducer from './teacher/assignments/assignmentCreateReducer';
import assignmentEditReducer from './teacher/assignments/assignmentEditReducer';
import assignmentReducer from './teacher/assignments/assignmentReducer';
import studentListReducer from './teacher/students/studentListReducer';
import homeworkListReducer from './student/assignments/assignmentListReducer'

const rootReducer = combineReducers({
  account: accountReducer,
  assignmentListReducer: assignmentListReducer,
  assignmentCreateReducer: assignmentCreateReducer,
  assignmentEditReducer: assignmentEditReducer,
  assignmentReducer: assignmentReducer,
  studentListReducer: studentListReducer,
  homeworkListReducer: homeworkListReducer,
  notifications: notificationsReducer,
  chat: chatReducer,
  mail: mailReducer,
  kanban: kanbanReducer,
  form: formReducer
});

export default rootReducer;
