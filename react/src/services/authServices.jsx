import jwt_decode from "jwt-decode";
export default function authHeader() {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user && user.token) {
    return "Bearer " + user.token;
  } else {
    return "";
  }
}

export const hasToken= () =>{
  const user = JSON.parse(localStorage.getItem("user"));

  if (user && user.token) {
    //Check Token Valid or not
    return true;
  } else {
    //console.log(" Local Storage can't find token");
    return false;
  }
}

export const checkToken= () =>{
  const user = JSON.parse(localStorage.getItem("user"));
  if(user&& user.token){
    let decodedToken = jwt_decode(user.token);
  //console.log("Decoded Token", decodedToken);
  let currentDate = new Date();

  // JWT exp is in seconds
  if (decodedToken.exp * 1000 < currentDate.getTime()) {
    //console.log("Token expired.");
    localStorage.removeItem("user");
    return false;
  } else {
    //console.log("Valid token");   
    return true;
  }
  }
  return false;
  
}

export const isAuthentication = () =>{
  const has = hasToken();
  const valid = checkToken();
  //console.log("hasToken is"+ has);
  //console.log("checkToken is" + valid);
  return hasToken()&&checkToken();
}

export const updateLocalStorage = (providedUsername,providedEmail,providedImage,providedBio) =>{
  const user = JSON.parse(localStorage.getItem("user"));
  user.username = providedUsername;
  user.email = providedEmail;
  user.image = providedImage;
  user.bio = providedBio;
  //console.log("It should be the result for updateLocalStorage"+ JSON.stringify(user));
  localStorage.setItem("user", JSON.stringify(user));
}

export const storeNewToken =(providedToken) =>{
  const user = JSON.parse(localStorage.getItem("user"));
  user.token = providedToken;
  localStorage.setItem("user", JSON.stringify(user));
}

export const deleteLocalStorage = () => {
  localStorage.removeItem("user");
}

export const checkUserIsAuthor = (authorName) =>{
  if(!hasToken()){
    return false;
  }
  const user = JSON.parse(localStorage.getItem("user"));
  return user.username === authorName ;

  
}

export const getCurrentUserImage = () =>{
  if(hasToken){
    const user = JSON.parse(localStorage.getItem("user"));
  return user.image ;
  }else return "";
}