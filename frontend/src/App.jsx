import { createContext, useContext, useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import logo from "./fonts/logo.png";
import xlogo from "./fonts/twitter-logo.png";
import "./App.css";
import {
  BrowserRouter,
  Link,
  Outlet,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import axios from "axios";
import { flushSync } from "react-dom";

const PetsContext = createContext();

const ContxtProvider = ({ children }) => {
  const [pets, setPets] = useState([]);

  const addpet = (newpet) => {
    setPets((prevpets) => [...prevpets, newpet]);
  };
  return (
    <>
      <PetsContext.Provider value={{ pets, addpet, setPets }}>
        {children}
      </PetsContext.Provider>
    </>
  );
};

const InputComp = () => {
  const { setPets } = useContext(PetsContext);
  const [petname, setpetname] = useState("");
  const [pettype, setpettype] = useState("");
  const [breed, setBreed] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phn, setPhn] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Send the data to your backend
      const token = localStorage.getItem("token");
      await axios.post(
        "https://pawpal-backend.onrender.com/addpets",
        {
          petname,
          pettype,
          breed,
          name,
          phn,
        },
        {
          headers: {
            token: token,
          },
        }
      );

      // Fetch updated data
      const response = await axios.get("https://pawpal-backend.onrender.com/getpets", {
        headers: {
          token: token,
        },
      });
      setPets(response.data);

      alert("Pet data saved successfully!");
      navigate("/table");
    } catch (error) {
      console.error("Error saving pet data:", error);
      alert("Error saving pet data. Please try again.");
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div className="formdiv">
        <form onSubmit={handleSubmit}>
          <span
            style={{
              display: "flex",
              justifyContent: "center",
              fontFamily: "sans-serif",
              marginTop: 20,
              fontSize: "large",
              fontWeight: "bold",
            }}
          >
            Pet Adoption Form
          </span>
          <div className="formele">
            <label htmlFor="petname">Pet Name</label> <br />
            <input
              className="forminput"
              onChange={(e) => setpetname(e.target.value)}
              id="petname"
              type="text"
              placeholder="Pet Name"
              required
            />
          </div>

          <div className="formele">
            <label htmlFor="petype">Pet Type</label>
            <br />
            <select
              className="forminput"
              onChange={(e) => setpettype(e.target.value)}
              name="Pet Type"
              required
              style={{
                width: 300,
                padding: 5,
                fontFamily: "sans-serif",
                backgroundColor: "#111",
                color: "white",
              }}
            >
              <option value="Select">Select</option>
              <option value="Dog">Dog</option>
              <option value="Cat">Cat</option>
            </select>
          </div>

          <div className="formele">
            <label htmlFor="breed">Breed</label>
            <br />
            <input
              className="forminput"
              onChange={(e) => setBreed(e.target.value)}
              id="breed"
              type="text"
              required
              placeholder="Breed"
            />
          </div>

          <div className="formele">
            <label htmlFor="urname">Your Name</label>
            <br />
            <input
              className="forminput"
              onChange={(e) => setName(e.target.value)}
              id="urname"
              type="text"
              required
              placeholder="Your Name"
            />
          </div>

          <div className="formele">
            <label htmlFor="phn">Phone No.</label>
            <br />
            <input
              className="forminput"
              onChange={(e) => setPhn(e.target.value)}
              id="phn"
              type="number"
              required
              placeholder="Phone"
            />
          </div>

          <div className="submitbtn">
            <button type="submit" className="button-85" role="button">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Table = () => {
  const { pets, setPets } = useContext(PetsContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // useEffect(() => {
  //   async function fetchPets() {
  //     try {
  //       setLoading(true);
  //       const response = await axios.get("http://localhost:3000/getpets");
  //       setPets(response.data); // Update the pets data in context
  //       setLoading(false);
  //     } catch (err) {
  //       setError("Failed to fetch pets data");
  //       setLoading(false);
  //       console.error("Error fetching pets:", err);
  //     }
  //   }

  //   fetchPets();
  // }, []); // Empty dependency array means this runs once when component mounts
  useEffect(() => {
    async function fetchPets() {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get("https://pawpal-backend.onrender.com/getpets", {
          headers: {
            token: token,
          },
        });
        setPets(response.data); // Update the pets data in context
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch pets data");
        setLoading(false);
        console.error("Error fetching pets:", err);
      }
    }

    fetchPets();
  }, []); // Empty dependency array means this runs once when component mounts

  if (loading) {
    return <div className="text-center p-4">Loading pets data...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">{error}</div>;
  }

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
      <div style={{}}>
        <table>
          <thead>
            <tr className="bg-gray-100">
              <th>Pet Name</th>
              <th>Pet Type</th>
              <th>Breed</th>
              <th>Adopter Name</th>
              <th>Phone</th>
            </tr>
          </thead>
          <tbody>
            {pets.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center p-4">
                  No pets data available
                </td>
              </tr>
            ) : (
              pets.map((pet, index) => (
                <tr key={index}>
                  <td>{pet.petname}</td>
                  <td>{pet.pettype}</td>
                  <td>{pet.breed}</td>
                  <td>{pet.name}</td>
                  <td>{pet.phn}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div
          style={{ display: "flex", justifyContent: "center", marginTop: 30 }}
        >
          <Link to="/">
            <button className="goback">Go Back</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

const Headers = () => {
  return (
    <>
      <div className="header">
        <div style={{ display: "flex", alignItems: "center" }}>
          <Link to={"/"}>
            <img width={70} src={logo} />
          </Link>
          <Link style={{ textDecoration: "none", color: "inherit" }} to={"/"}>
            <span style={{ fontWeight: "bold" }}>PawPals</span>
          </Link>
        </div>
        <div className="navele">
          <Link to={"/"}>
            <button style={{ marginRight: 150 }} className="navbtns">
              home
            </button>
          </Link>
          <Link to={"/"}>
            <button style={{ marginRight: 150 }} className="navbtns">
              sign up
            </button>
          </Link>
          <Link to={"/login"}>
            <button style={{ marginRight: 150 }} className="navbtns">
              login
            </button>
          </Link>
        </div>
      </div>
    </>
  );
};

const Footer = () => {
  return (
    <div className="footer">
      Made with ❤️ by Akshit{" "}
      <a href="https://x.com/AkshitVig4">
        <img style={{ marginLeft: 5 }} width={20} src={xlogo} alt="" />
      </a>
    </div>
  );
};

const Pagelayout = () => {
  return (
    <div className="page-container">
      <Headers />
      <div style={{ flex: 1 }}>
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};
const LandingPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const validateForm = () => {
    // Check if the username is empty
    if (username.trim() === "") {
      alert("Username is required");
      return false;
    }

    // Check if email format is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address");
      return false;
    }

    // Check if the password meets length requirement
    if (password.length < 6) {
      alert("Password should be at least 6 characters long");
      return false;
    }

    return true; // If all checks pass, return true
  };

  async function signupfn() {
    if (!validateForm()) {
      return; // Stop submission if validation fails
    }

    try {
      await axios.post("https://pawpal-backend.onrender.com/signup", {
        username,
        email,
        password,
      });
      alert("Sign-up successful");
      navigate("/login");
    } catch (e) {
      alert("Error while signing up");
    }
  }

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div className="signupdiv">
        <span
          style={{
            color: "white",
            display: "flex",
            justifyContent: "center",
            fontSize: 20,
            fontWeight: "bold",
            marginTop: 30,
          }}
        >
          Create an account
        </span>
        <div style={{ padding: 30 }}>
          <div className="signup">
            <label htmlFor="1">Username</label>
            <br />
            <input
              onChange={(e) => setUsername(e.target.value)}
              id="1"
              required
              className="authinput"
              type="text"
              placeholder="username"
            />
          </div>

          <div className="signup">
            <label htmlFor="2">Email</label>
            <br />
            <input
              onChange={(e) => setEmail(e.target.value)}
              id="2"
              className="authinput"
              type="text"
              required
              placeholder="email"
            />
          </div>
          <div className="signup">
            <label htmlFor="3">Password</label>
            <br />
            <input
              onChange={(e) => setPassword(e.target.value)}
              id="3"
              className="authinput"
              type="password"
              required
              placeholder="password"
            />
          </div>
          <div
            style={{ display: "flex", justifyContent: "center", marginTop: 25 }}
          >
            <button onClick={signupfn} className="signupbtn">
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const validateForm = () => {
    // Check if email format is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address");
      return false;
    }

    // Check if the password meets length requirement
    if (password.length < 6) {
      alert("Password should be at least 6 characters long");
      return false;
    }

    return true; // If all checks pass, return true
  };

  const loginbtn = async () => {
    if (!validateForm()) {
      return; // Stop submission if validation fails
    }

    try {
      const res = await axios.post("https://pawpal-backend.onrender.com/login", {
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      alert("login successful");
      navigate("/form");
    } catch (e) {
      alert("error while login");
    }
  };
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div className="signupdiv">
        <span
          style={{
            color: "white",
            display: "flex",
            justifyContent: "center",
            fontSize: 20,
            fontWeight: "bold",
            marginTop: 30,
          }}
        >
          Login
        </span>
        <div style={{ padding: 30 }}>
          <div className="signup">
            <label htmlFor="2">Email</label>
            <br />
            <input
              onChange={(e) => setEmail(e.target.value)}
              id="2"
              className="authinput"
              type="text"
              required
              placeholder="email"
            />
          </div>
          <div className="signup">
            <label htmlFor="3">Password</label>
            <br />
            <input
              onChange={(e) => setPassword(e.target.value)}
              id="3"
              className="authinput"
              type="password"
              required
              placeholder="password"
            />
          </div>
          <div
            style={{ display: "flex", justifyContent: "center", marginTop: 25 }}
          >
            <button onClick={loginbtn} className="signupbtn">
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <>
      <BrowserRouter>
        <ContxtProvider>
          <Routes>
            <Route path="/" element={<Pagelayout />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/form" element={<InputComp />} />
              <Route path="/table" element={<Table />} />
              <Route path="*" element={<ErrorOccured />} />
            </Route>
          </Routes>
        </ContxtProvider>
      </BrowserRouter>
    </>
  );
}

const ErrorOccured = () => {
  return <>Invalid Route</>;
};

export default App;
