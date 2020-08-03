import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import accountReducer from './accountReducer';
import notificationsReducer from './notificationsReducer';
import chatReducer from './chatReducer';
import mailReducer from './mailReducer';
import kanbanReducer from './kanbanReducer';
import assignmentListReducer from './assignments/assignmentListReducer';
import assignmentCreateReducer from './assignments/assignmentCreateReducer';
import assignmentEditReducer from './assignments/assignmentEditReducer';
import assignmentReducer from './assignments/assignmentReducer';
import studentListReducer from './students/studentListReducer';

const rootReducer = combineReducers({
  account: accountReducer,
  assignmentListReducer: assignmentListReducer,
  assignmentCreateReducer: assignmentCreateReducer,
  assignmentEditReducer: assignmentEditReducer,
  assignmentReducer: assignmentReducer,
  studentListReducer: studentListReducer,
  notifications: notificationsReducer,
  chat: chatReducer,
  mail: mailReducer,
  kanban: kanbanReducer,
  form: formReducer
});

export default rootReducer;
