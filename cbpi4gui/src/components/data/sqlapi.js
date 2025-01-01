import axios from "axios";

const getarchivelist = (callback_susscess = () => { }, callback_failed = () => { }) => {
  axios
    .get("/api/hydrometer/v1/data/getarchive")
    .then(function (response) {
      callback_susscess(response.data);
    })
    .catch(function (error) {
      callback_failed();
    });
};

const getdiagramlist = (callback_susscess = () => { }, callback_failed = () => { }) => {
  axios
    .get("/api/hydrometer/v1/data/getdiagrams")
    .then(function (response) {
      callback_susscess(response.data);
    })
    .catch(function (error) {
      callback_failed();
    });
};

const getarchiveheader = (ArchiveID, callback_susscess = () => { }, callback_failed = () => { }) => {
  axios
    .post("/api/hydrometer/v1/data/getarchiveheader/" + ArchiveID+"/")
    .then(function (response) {
      callback_susscess(response.data);
      })
    .catch(function (error) {
      callback_failed();
    });
};

const getarchivevalues = (data, callback_susscess = () => {}, callback_failed = () => {}) => {
  axios
    .post("/api/hydrometer/v1/data/getarchivevalues", data)
    .then(function (response) {
      callback_susscess(response.data);
    })
    .catch(function (error) {
      callback_failed();
    });
};


export const sqlapi = {
  getdiagramlist,
  getarchivelist,
  getarchiveheader,
  getarchivevalues
}