import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";  
import Done from "../assets/img/Done.png";
import Vector from "../assets/img/Vector.png";

function FirstPage() {
  const navigate = useNavigate();  

  const handleClick = () => {
    navigate("/todo");  
  };

  return (
    <Container>
      <Row className="align-items-center">
        <Col xs={12} md={6}>
          <div>
            <img className="moving-image" src={Done} alt="Welcome_image" />
          </div>
        </Col>
        <Col xs={12} md={6}>
          <div>
            <h6 >Welcome to</h6>
            <h1> OUR REMINDER</h1>
            <p>
              Manage your tasks easily and stay on top of your day. Keep track
              of what's important!
            </p>
            <button className="btnstart" onClick={handleClick}>
              <span className="start">Get Started</span>
              <img src={Vector} alt="imgflesh" />
            </button>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default FirstPage;
