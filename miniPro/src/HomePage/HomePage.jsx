import React from "react";
import "./HomePage.css"; // Import the CSS file

const HomePage = () => {
  return (
    <section className="hero" id="homeP">
      <div className="container">
        <h1 id="mainhead">Master Your Technical Interview Preparation</h1>
        <p id="homepara">
          Curated programming problems, comprehensive solutions, and learning resources to help you ace your technical interviews.
        </p>

        {/* Features Grid */}
        <div className="features-grid">
          <FeatureCard
            icon="📘"
            title="Structured Learning"
            description="Problems organized by difficulty and topics for systematic preparation."
          />
          <FeatureCard
            icon="📄"
            title="Rich Resources"
            description="Access to detailed solutions, articles, and video tutorials."
          />
          <FeatureCard
            icon="📊"
            title="Track Progress"
            description="Monitor your progress across different topics and difficulty levels."
          />
        </div>
      </div>
    </section>
  );
};

// Feature Card Component
const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="feature-card">
      <span className="feature-icon">{icon}</span>
      <h3>{title}</h3>
      <p id="descrip">{description}</p>
    </div>
  );
};

export default HomePage;
