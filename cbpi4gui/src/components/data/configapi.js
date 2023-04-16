import axios from "axios";

export const get = ( callback_susscess = () => {}, callback_failed = () => {}) => {
  axios
    .put("/config/")
    .then(function (response) {
      callback_susscess(response.data);
    })
    .catch(function (error) {
      callback_failed();
    });
};

export const update = (name, value, callback_susscess = () => {}, callback_failed = () => {}) => {
  axios
    .put("/config/"+name+"/", {value})
    .then(function (response) {
      callback_susscess(response.data);
     // window.location.reload()
    })
    .catch(function (error) {
      callback_failed();
    });
};

export const getone = (name, callback_susscess = () => {}, callback_failed = () => {}) => {
  axios
    .post("/config/"+name+"/")
    .then(function (response) {
      callback_susscess(response.data);
    })
    .catch(function (error) {
      callback_failed();
    });
};

export const getobsolete = (callback_susscess = () => {}, callback_failed = () => {}) => {
  axios
    .get("/config/getobsolete")
    .then(function (response) {
      callback_susscess(response.data);
    })
    .catch(function (error) {
      callback_failed();
    });
};

export const removeobsolete = (callback_susscess = () => {}, callback_failed = () => {}) => {
  axios
    .get("/config/removeobsolete")
    .then(function (response) {
      callback_susscess(response.data);
    })
    .catch(function (error) {
      callback_failed();
    });
};

export const configapi = {
  get,
  update,
  getone,
  getobsolete,
  removeobsolete
}