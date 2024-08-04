import React from 'react';
import './Pricing.css';

const Pricing = () => {
  return (
    <div className="pricing-container">
      <h1 className="pricing-title">Pricing Structure</h1>
      <p className="pricing-intro">
        Welcome to our AI-driven music creation platform! Whether you're just starting or looking to expand your creative possibilities, we have a pricing plan tailored to fit your needs.
      </p>
      <div className="pricing-option">
        <h2>Option 1: Free</h2>
        <ul>
          <li>Upload and convert 1 sample voice</li>
          <li>Sample duration limit: 30 seconds</li>
          <li>Access to 4 instrument library options</li>
        </ul>
        <p>Perfect for:</p>
        <ul>
          <li>Beginners wanting to try out the platform</li>
          <li>Experimenting with basic voice-to-instrument conversions</li>
        </ul>
      </div>
      <div className="pricing-option">
        <h2>Option 2: Pay Per Sample</h2>
        <p>Pricing: $0.30 per sample upload</p>
        <ul>
          <li>Upload and convert 1 sample voice per payment</li>
          <li>Sample duration limit: 30 seconds</li>
          <li>Access to 8 instrument library options</li>
        </ul>
        <p>Perfect for:</p>
        <ul>
          <li>Users who want more variety in instruments</li>
          <li>Occasional use without a long-term commitment</li>
        </ul>
      </div>
      <div className="pricing-option">
        <h2>Option 3: Unlimited</h2>
        <p>Pricing: Monthly subscription</p>
        <ul>
          <li>Unlimited sample voice uploads</li>
          <li>Play up to 3 samples simultaneously</li>
          <li>Sample duration limit: 3 minutes</li>
          <li>Access to unlimited instrument library options</li>
        </ul>
        <p>Perfect for:</p>
        <ul>
          <li>Serious musicians and producers</li>
          <li>Users looking for extensive creative freedom and tools</li>
        </ul>
      </div>
      <div className="pricing-call-to-action">
        <h2>Ready to get started?</h2>
        <p>
          Choose the plan that best suits your musical journey and unlock the potential of your creativity today!
        </p>
        <h3>Why iHum?</h3>
        <ul>
          <li>Simplicity and Action: Youth need straightforward solutions. Our app features a simple page design that takes users directly to the recording stage, with preset instruments ready to transform their hums into musical pieces.</li>
          <li>Increased Equity: iHum provides an affordable alternative for families who can't afford instruments or lessons, allowing children to explore their musical inclinations.</li>
        </ul>
        <h3>User Empowerment</h3>
        <ul>
          <li>Non-Musicians: Allows anyone to create complex musical pieces without prior musical training.</li>
          <li>Musicians: Provides tools for quick prototyping of ideas.</li>
        </ul>
        <h3>Benefits</h3>
        <ul>
          <li>Unlock Creativity: Emphasize our app's ability to unlock your creative potential.</li>
          <li>Ease of Use: Showcase how easy it is to use iHum and produce professional-quality music.</li>
          <li>Unique Mental Landscapes: Highlight the uniqueness of each user's musical ideas and how iHum brings them to life.</li>
        </ul>
        <p>
          Join us at iHum and transform your musical thoughts into reality. Your journey from mind to melody starts here.
        </p>
      </div>
    </div>
  );
};

export default Pricing;
