import axios from "axios";

const getpluginlist = (callback_susscess = () => { }, callback_failed = () => { }) => {
  axios
    .get("/plugin/list")
    .then(function (response) {
      callback_susscess(response.data);
    })
    .catch(function (error) {
      callback_failed();
    });
};

const getpluginnames = (callback_susscess = () => { }, callback_failed = () => { }) => {
  axios
    .get("/plugin/names")
    .then(function (response) {
      callback_susscess(response.data);
    })
    .catch(function (error) {
      callback_failed();
    });
};
export const pluginapi = {
  getpluginlist,
  getpluginnames
}