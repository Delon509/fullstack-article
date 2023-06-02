import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const RegisterForm = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    if (id === "username") {
      setUsername(value);
    } else if (id === "email") {
      setEmail(value);
    } else if (id === "password") {
      setPassword(value);
    }
  };
  const handleRegisterSubmit = async () => {
    //console.log(username, email, password);
    //console.log("Sending  Register Request");
    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "users",
        { username, email, password },
        {
          headers: {
            "Content-Type": "application/json",
            // "Access-Control-Allow-Origin": "http://127.0.0.1:5173",
          },
        }
      );
      //console.log(response.status);
      //console.log(response.data);
      navigate("/login");
    } catch (error) {
      setErrorMessage(error.response.data.body[0].message);
    }
  };

  return (
    <>
      <div className=" text-center mb-4 ">
        <div className=" text-4xl mb-2">Sign up</div>
        <Link to="/login" className=" text-green-300">
          Have an account?
        </Link>
      </div>
      <div className=" w-full max-w-screen-sm mx-auto">
        <div className="mb-6">
          <input
            type="username"
            id="username"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="username"
            onChange={(e) => handleInputChange(e)}
            required
          />
          <p
            className={` mt-2 text-sm text-red-600 dark:text-red-500 ${
              errorMessage === "Username can't be empty or null" ? "" : "hidden"
            }`}
          >
            <span className="font-medium">Oops!</span> Username can not be
            empty!
          </p>
          <p
            className={` mt-2 text-sm text-red-600 dark:text-red-500 ${
              errorMessage === "Username already exist" ? "" : "hidden"
            }`}
          >
            <span className="font-medium">Oops!</span> Username already taken!
          </p>
        </div>
        <div className="mb-6">
          <input
            type="email"
            id="email"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="email"
            onChange={(e) => handleInputChange(e)}
            required
          />
          <p
            className={` mt-2 text-sm text-red-600 dark:text-red-500 ${
              errorMessage === "Email can't be empty or null" ? "" : "hidden"
            }`}
          >
            <span className="font-medium">Oops!</span> Email can not be empty!
          </p>
          <p
            className={` mt-2 text-sm text-red-600 dark:text-red-500 ${
              errorMessage === "Email already exist" ? "" : "hidden"
            }`}
          >
            <span className="font-medium">Oops!</span> This email address is
            already used!
          </p>
          <p
            className={` mt-2 text-sm text-red-600 dark:text-red-500 ${
              errorMessage === "Email format incorrect" ? "" : "hidden"
            }`}
          >
            <span className="font-medium">Oops!</span> Email format is incorrect!
          </p>
        </div>
        <div className="mb-6">
          <input
            type="password"
            id="password"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="password"
            onChange={(e) => handleInputChange(e)}
            required
          />
          <p
            className={` mt-2 text-sm text-red-600 dark:text-red-500 ${
              errorMessage === "Password can't be empty or null" ? "" : "hidden"
            }`}
          >
            <span className="font-medium">Oops!</span> Password can not be
            empty!
          </p>
        </div>
        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          onClick={() => handleRegisterSubmit()}
        >
          Submit
        </button>
      </div>
    </>
  );
};

export default RegisterForm;
