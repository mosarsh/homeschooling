import axios from 'axios'

class AssignmentsService {
    get = (date) => new Promise((resolve, reject) => {

        let query = '/assignments?date=' + date;
        
        axios.get(query)
          .then((response) => {
            if (response.data) {
              resolve(response.data);
            } else {
              reject(response.data.error);
            }
          })
          .catch((error) => {
            reject(error);
          });
      });

    get = (assignmentId) => new Promise((resolve, reject) => {
        axios.get('/assignments/', assignmentId)
          .then((response) => {
            if (response.data) {
              resolve(response.data);
            } else {
              reject(response.data.error);
            }
          })
          .catch((error) => {
            reject(error);
          });
      });
    
    add = (assignment) => new Promise((resolve, reject) => {
        axios.post('/assignments', assignment)
          .then((response) => {
            if (response.data) {
              resolve(response.data);
            } else {
              reject(response.data.error);
            }
          })
          .catch((error) => {
            reject(error);
          });
      });

    update = (assignment) => new Promise((resolve, reject) => {
        axios.put('/assignments', assignment)
          .then((response) => {
            if (response.data) {
              resolve(response.data);
            } else {
              reject(response.data.error);
            }
          })
          .catch((error) => {
            reject(error);
          });
      });

    delete = (assignmentId) => new Promise((resolve, reject) => {
        axios.delete('/assignments/', assignmentId)
          .then((response) => {
            if (response.data) {
              resolve(response.data);
            } else {
              reject(response.data.error);
            }
          })
          .catch((error) => {
            reject(error);
          });
      });
}

const assignmentsService = new AssignmentsService();

export default assignmentsService;