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

const removeridflag = (ArchiveID, callback_susscess = () => { }, callback_failed = () => { }) => {
  axios
    .post("/api/hydrometer/v1/data/removeridflag/" + ArchiveID+"/")
    .then(function (response) {
      callback_susscess(response.data);
      })
    .catch(function (error) {
      callback_failed();
    });
};

const addridflag = (ArchiveID, Timestamp, callback_susscess = () => { }, callback_failed = () => { }) => {
  axios
    .post("/api/hydrometer/v1/data/addridflag/" + ArchiveID+"/"+Timestamp+"/")
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

const deletearchive = (ArchiveID, callback_susscess = () => { }, callback_failed = () => { }) => {
  axios
    .post("/api/hydrometer/v1/data/deletearchive/" + ArchiveID+"/")
    .then(function (response) {
      callback_susscess(response.data);
      })
    .catch(function (error) {
      callback_failed();
    });
};

const getcalibration = (callback_susscess = () => { }, callback_failed = () => { }) => {
  axios
    .post("/api/hydrometer/v1/data/getcalibration/")
    .then(function (response) {
      callback_susscess(response.data);
      })
    .catch(function (error) {
      callback_failed();
    });
};

const savecalibration = (id, data, callback_susscess = () => {}, callback_failed = () => {}) => {
  axios
    .post("/api/hydrometer/v1/data/savecalibration/"+ id +"/", data)
    .then(function (response) {
      callback_susscess(response.data);
    })
    .catch(function (error) {
      callback_failed();
    });
};

const getrecentdata = (days, callback_susscess = () => { }, callback_failed = () => { }) => {
  axios
    .post("/api/hydrometer/v1/data/getrecentdata/" + days + "/")
    .then(function (response) {
      callback_susscess(response.data);
      })
    .catch(function (error) {
      callback_failed();
    });
};

const resetrecipe = (id, data, callback_susscess = () => {}, callback_failed = () => {}) => {
  axios
    .post("/api/hydrometer/v1/data/resetspindlerecipe/"+ id +"/", data)
    .then(function (response) {
      callback_susscess(response.data);
    })
    .catch(function (error) {
      callback_failed();
    });
};

const transfercalibration = (SpindleID, ArchiveID, callback_susscess = () => {}, callback_failed = () => {}) => {
  axios
    .post("/api/hydrometer/v1/data/transfercalibration/"+ SpindleID +"/"+ ArchiveID +"/")
    .then(function (response) {
      callback_susscess(response.status);
    })
    .catch(function (error) {
      callback_failed();
    });
};

const testsqlconnection = (callback_susscess = () => { }, callback_failed = () => { }) => {
  axios
    .post("/api/hydrometer/v1/data/testsqlconnection")
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
  getarchivevalues,
  removeridflag,
  addridflag,
  deletearchive,
  getcalibration,
  savecalibration,
  getrecentdata,
  resetrecipe,
  transfercalibration,
  testsqlconnection
}