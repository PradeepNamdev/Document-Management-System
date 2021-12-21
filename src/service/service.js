import axios from "axios";

const DMS_URL = "http://10.244.0.43:8080/dms/";
class service {

    createDirectory(data) {
        return axios.post(DMS_URL + "addRootDirectory/", data);
    }

    createChildDirectory(data) {
        return axios.post(DMS_URL + "addChildDirectory/", data)
    }

    getFolderStructure(userId) {
        return axios.get(DMS_URL + "getDirectories/" + userId);
    }

    fileUpload(file, user_id, dir_name, durationInMinutes, contentName) {
        let formData = new FormData();
        formData.append("file", file);
        formData.append("user_id", user_id)
        formData.append("dir_name", dir_name);
        formData.append("durationInMinutes", durationInMinutes);
        formData.append("contentName", contentName);
        return axios.post(DMS_URL + "fileUpload/", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            }
        })
    }

    contentDetails(dir_id, user_id) {
        return axios.get(DMS_URL + "getContentDetails/" + dir_id + "/" + user_id);
    }

    deleteDirectory(data) {
        return axios.post(DMS_URL + "deleteDirectory", data);
    }

    contentDelete(contentId) {
        return axios.post(DMS_URL + "deleteContent/" + contentId);
    }

    fileCotentDetailsUpdate(data) {
        return axios.post(DMS_URL + "updateContent", data)
    }

}

export default new service;