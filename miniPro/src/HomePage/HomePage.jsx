import React from "react";
import { FaLaptopCode, FaBookOpen, FaChartLine } from "react-icons/fa";
import "./HomePage.css";

const HomePage = () => {
  return (
    <section className="hero">
      <div className="container">
        <h1 className="main-heading">
          Master Your <span className="highlight" >Technical Interviews</span>
        </h1>
        <p className="sub-heading">
          Curated programming problems, comprehensive solutions, and learning resources to help you ace your technical interviews.
        </p>

        <div className="features-grid">
          <FeatureCard
            icon={<FaLaptopCode className="feature-icon" />}
            title="Structured Learning"
            description="Problems organized by difficulty and topics for systematic preparation."
          />
          <FeatureCard
            icon={<FaBookOpen className="feature-icon" />}
            title="Rich Resources"
            description="Access to detailed solutions, articles, and video tutorials."
          />
          <FeatureCard
            icon={<FaChartLine className="feature-icon" />}
            title="Track Progress"
            description="Monitor your progress across different topics and difficulty levels."
          />
        </div>
      </div>
    </section>
  );
};

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="feature-card">
      <div className="feature-icon-container">{icon}</div>
      <h3 className="feature-title">{title}</h3>
      <p className="feature-description">{description}</p>
    </div>
  );
};

export default HomePage;