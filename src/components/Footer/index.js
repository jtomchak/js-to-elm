import React, { Component } from "react";

class Footer extends Component {
  render() {
    return (
      <div>
        <a href="https://www.contentful.com/" rel="nofollow" target="_blank">
          <img
            src="https://images.contentful.com/fo9twyrwpveg/44baP9Gtm8qE2Umm8CQwQk/c43325463d1cb5db2ef97fca0788ea55/PoweredByContentful_LightBackground.svg"
            style={{
              maxWidth: "100px",
              width: "100%",
              margin: "auto",
              paddingTop: "20px",
              position: "absolute",
              right: "0",
              bottom: "0",
              left: "0",
              padding: "1rem"
            }}
            alt="Powered by Contentful"
          />
        </a>
      </div>
    );
  }
}

export default Footer;
