import axios from 'axios';

export const downloadFile = (url, fileName) => {
    console.log(url);
    console.log(fileName);
    return axios({
        url,
        method: 'GET',
        responseType: 'blob', // important
    }).then((response) => {
        console.log(response);
        /* const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click(); */
    });
};
