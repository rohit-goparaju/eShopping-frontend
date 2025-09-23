import axios from 'axios'


const backend = axios.create(
    {
        baseURL : "http://localhost:8080/eShopping"
    }
)

backend.interceptors.request.use(
    config=>{
        const jwt = localStorage.getItem('jwt');
        if(jwt){
            config.headers.Authorization = `Bearer ${jwt}`;
        }
        return config;
    },
    error=>{
        console.error("Request Error", error);
        return Promise.reject(error);
    }
);

backend.interceptors.response.use(
    response=>response,
    error=>{

        if(error.response?.status === 401){
            console.log("Unauthorized! Redirecting to login");
            window.location.href = "http://localhost:5173/eShopping/logout";
        }
        if(error.response?.status === 403){
            console.log("forbidden! Redirecting to login");
            window.location.href = "http://localhost:5173/eShopping/logout";
        }

        console.error("Response Error:",error);

        return Promise.reject(error);
    }
);

export default backend;