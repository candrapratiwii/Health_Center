// api.jsx dari project lama 
import { jwtStorage } from "./jwt_storage";

const REACT_APP_API_URL = import.meta.env.VITE_REACT_APP_API_URL;

export const getDataPublic = (url) => {
  return fetch(url, {
    method: "GET", headers: new Headers({
        "ngrok-skip-browser-warning": "69420",
      }),})
    .then((response) =>
      response.status >= 200 &&
      response.status <= 299 &&
      response.status !== 204
        ? response.json()
        : response,
    )
    .then((data) => {
      return data;
    })
    .catch((err) => console.log(err));
};
export const getData = async (url) => {
  return fetch(REACT_APP_API_URL + url, {
    method: "GET",
    headers: new Headers({
      "ngrok-skip-browser-warning": "69420",
    }),
  })
    .then((response) =>
      response.status >= 200 &&
      response.status <= 299 &&
      response.status !== 204
        ? response.json()
        : response,
    )
    .then((data) => {
      return data;
    })
    .catch((err) => console.log(err));
};

export const getDataPrivate = async (url) => {
  let token = await jwtStorage.retrieveToken();
  return fetch(REACT_APP_API_URL + url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "ngrok-skip-browser-warning": "69420",
    },
  })
    .then((response) =>
      response.status >= 200 &&
      response.status <= 299 &&
      response.status !== 204
        ? response.json()
        : response,
    )
    .then((data) => {
      return data;
    })
    .catch((err) => {
      throw err;
    });
};

export const sendData = async (url, data) => {
  let isFormData = data instanceof FormData;
  let headers = new Headers({
    "ngrok-skip-browser-warning": "69420",
  });
  let body = data;
  if (!isFormData) {
    headers.set("Content-Type", "application/json");
    if (typeof data !== "string") {
      body = JSON.stringify(data);
    }
  }
  return fetch(REACT_APP_API_URL + url, {
    method: "POST",
    body,
    headers,
  })
    .then(async (response) => {
      if (!response.ok) {
        let errorMsg = "Unknown error";
        try {
          const errData = await response.json();
          errorMsg = errData?.message || JSON.stringify(errData);
        } catch (e) {}
        throw new Error(errorMsg);
      }
      return response.json();
    })
    .catch((err) => {
      throw err;
    });
};

export const sendDataPrivate = async (url, data) => {
  let token = await jwtStorage.retrieveToken();
  let headers = {
    Authorization: `Bearer ${token}`,
    "ngrok-skip-browser-warning": "69420",
  };
  let body = data;
  if (data && !(data instanceof FormData)) {
    headers["Content-Type"] = "application/json";
    if (typeof data !== "string") {
      body = JSON.stringify(data);
    }
  }
  return fetch(REACT_APP_API_URL + url, {
    method: "POST",
    headers,
    body,
  })
    .then((response) =>
      response.status === 401
        ? { isExpiredJWT: true }
        : response.status >= 200 &&
            response.status <= 299 &&
            response.status !== 204
          ? response.json()
          : response,
    )
    .then((data) => data)
    .catch((err) => console.log(err));
};

export const deleteData = async (url, data) => {
  return fetch(REACT_APP_API_URL + url, {
    method: "DELETE",
    body: data,
  })
    .then((response) => response)
    .catch((err) => console.log(err));
};

export const editDataPrivatePut = async (url, data) => {
  //401 -> jwt expired, flow process to login
  //400 -> jwt malformed
  //204 -> No Content, but success
  //NOTE : You must special handle for HTTP status above
  let token = await jwtStorage.retrieveToken();
  return fetch(REACT_APP_API_URL + url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) =>
      response.status === 401
        ? { isExpiredJWT: true }
        : response.status >= 200 &&
            response.status <= 299 &&
            response.status !== 204
          ? response.json()
          : response,
    )
    .then((data) => data)
    .catch((err) => console.log(err));
};

export const editDataPrivateURLEncoded = async (url, data) => {
  //401 -> jwt expired, flow process to login
  //400 -> jwt malformed
  //204 -> No Content, but success
  //NOTE : You must special handle for HTTP status above
  // var token = localStorage.getItem("token_auth");
  let token = await jwtStorage.retrieveToken();
  return fetch(REACT_APP_API_URL + url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    },
    body: data,
  })
    .then((response) =>
      response.status === 401
        ? { isExpiredJWT: true }
        : response.status >= 200 &&
            response.status <= 299 &&
            response.status !== 204
          ? response.json()
          : response,
    )
    .then((data) => data)
    .catch((err) => console.log(err));
};

export const deleteDataPrivateURLEncoded = async (url, data) => {
  //401 -> jwt expired, flow process to login
  //400 -> jwt malformed
  //204 -> No Content, but success
  //NOTE : You must special handle for HTTP status above
  // var token = localStorage.getItem("token_auth");
  let token = await jwtStorage.retrieveToken();
  return fetch(REACT_APP_API_URL + url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    },
    body: data,
  })
    .then((response) =>
      response.status === 401
        ? { isExpiredJWT: true }
        : response.status >= 200 &&
            response.status <= 299 &&
            response.status !== 204
          ? response.json()
          : response,
    )
    .then((data) => data)
    .catch((err) => console.log(err));
};

export const deleteDataPrivateJSON = async (url, data) => {
  //401 -> jwt expired, flow process to login
  //400 -> jwt malformed
  //204 -> No Content, but success
  //NOTE : You must special handle for HTTP status above
  // var token = localStorage.getItem("token_auth");
  let token = await jwtStorage.retrieveToken();
  return fetch(REACT_APP_API_URL + url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: data,
  })
    .then((response) =>
      response.status === 401
        ? { isExpiredJWT: true }
        : response.status >= 200 &&
            response.status <= 299 &&
            response.status !== 204
          ? response.json()
          : response,
    )
    .then((data) => data)
    .catch((err) => console.log(err));
};

export const logoutAPI = async () => {
  let token = await jwtStorage.retrieveToken();
  let formData = new FormData();
  formData.append("logout", "Logout"); // Assuming jwtStorage retrieves token
  return fetch(REACT_APP_API_URL + "/api/auth/logout", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })
    .then((response) => {
      if (response.status === 200) {
        jwtStorage.removeItem();
        return { isLoggedOut: true };
      } else {
        // Handle errors (e.g., unexpected status code)
        console.error("Logout failed:", response.statusText);
        return false;
      }
    })
    .catch((error) => {
      console.error("Logout error:", error);
      return false;
    });
};

export const getImage = (url_image) => {
  const imgDefault = "/storage/images/userpng_1717846018.png";
  let imgResult = url_image ? url_image : imgDefault;
  return REACT_APP_API_URL + imgResult;
}; 