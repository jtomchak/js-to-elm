import React, { Component } from "react";
import "./style.scss";

class Footer extends Component {
  render() {
    return (
      <div>
        <a href="https://www.contentful.com/" rel="nofollow" target="_blank">
          <img
            className="constentful_footer"
            src="https://images.contentful.com/fo9twyrwpveg/44baP9Gtm8qE2Umm8CQwQk/c43325463d1cb5db2ef97fca0788ea55/PoweredByContentful_LightBackground.svg"
            alt="Powered by Contentful"
          />
        </a>
      </div>
    );
  }
}

export default Footer;
