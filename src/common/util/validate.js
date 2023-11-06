/* eslint-disable */
const ValidateEmail = email => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};

const isURL = str => {
  var re = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/;
  return re.test(str);
};

function isVideo(url) {
  if (url === undefined || url === null || url.trim() === '') {
    return false;
  }
  if(url.startsWith("assets-library://asset")){
    return true;
  }
  const fileType = url.substring(url.length - 3, url.length);
  if (fileType === 'mp4' || fileType === '3gp' || fileType === 'mov')
    return true;
}

export {
  ValidateEmail,
  isURL,
  isVideo
};
