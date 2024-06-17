import React from "react";
import axios from "axios";
import { FaVolumeUp, FaCat } from "react-icons/fa";
import "./App.css";

function App() {
  const handleFeed = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URI}/eat`,
        {
          eat: true,
        }
      );
      alert("Đổ thức ăn thành công");
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCloseLid = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URI}/eat`,
        {
          eat: false,
        }
      );
      alert("Tắt động cơ");
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="App">
      <div className="button-container">
        <button className="btn-class-name" onClick={handleFeed}>
          <span className="back"></span>
          <span className="front"><FaCat size={40} /></span>
        </button>
        <label>Đổ thức ăn</label>
      </div>
      <div className="button-container">
        <button className="btn-class-name" onClick={handleCloseLid}>
          <span className="back"></span>
          <span className="front"><FaVolumeUp size={40} /></span>
        </button>
        <label>Tắt động cơ</label>
      </div>
    </div>
  );
}

export default App;
