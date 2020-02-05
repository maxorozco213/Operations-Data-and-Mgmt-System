import SatApi from "../Apis/SatApi";
import axios from "axios";

// Register a new user
export const register = (username, email, pass, inviteCode = '') => async dispatch => {
    const registerData = new FormData();

    registerData.append("username", username);
    registerData.append("email", email);
    registerData.append("pass", pass);

    console.log("Username", registerData.get("username"));
    console.log("Email", registerData.get("email"));
    console.log("Password", registerData.get("pass"));

    if (inviteCode.length > 0) {
        registerData.append("code", inviteCode);
        console.log("Invite", registerData.get("code"));
    }

    const response = await axios({
        method: 'POST',
        url: `${SatApi.url}register/`,
        header: {'Content-type': 'application/json'},
        data: registerData
    })
        .catch((function (error) {
            console.log(error.error)
        }));

    dispatch({ type: "REGISTER", payload: response })
};

// Log the user in and obtain an Auth token
export const login = (username, pass) => async dispatch => {
    const loginData = new FormData();

    loginData.append("username", username);
    loginData.append("pass", pass);

    console.log("Username", loginData.get("username"));
    console.log("Password", loginData.get("pass"));

    const response = await axios({
        method: 'POST',
        url: `${SatApi.url}login/`,
        header: { 'Content-type': 'application/json' },
        data: loginData
    })
        .catch((function (error) {
            console.log(error.error)
        }));

    dispatch({ type: "LOGIN", payload: response })
};