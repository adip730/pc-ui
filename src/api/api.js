import axios from 'axios';


const endpoint = process.env.REACT_APP_STRAPIURL;
const auth = process.env.REACT_APP_STRAPIAUTH;

export const getProjects = () => {
    let url = `https://${endpoint}/api/projects?populate=*`
    return axios.get(url, {
        headers: {
            'Authorization': `${auth}`,
        }
    });
};

export const getMedia = () => {
    let url = `https://${endpoint}/api/upload/files`
    return axios.get(url, {
        headers: {
            'Authorization': `${auth}`,
        }
    })
};

export const getConfig = () => {
    let url = `https://${endpoint}/api/config`
    return axios.get(url, {
        headers: {
            'Authorization': `${auth}`,
        }
    })
};

export const getHdri = () => {
    let url = `https://${endpoint}/api/logotexture?populate=*`
    return axios.get(url, {
        headers: {
            'Authorization': `${auth}`,
        }
    })
}