import React from "react";
import "../App.css"
function Footer({Isopen}) {
  return (
    <div style={{filter: Isopen === true? "brightness(50%)" : "",width:"100%" }}>
      <footer class="bbc-footer" >
        <div class="footer-social">
          <span>Follow on:</span>
          <a href="#">Facebook</a>
          <a href="#">Twitter</a>
          <a href="#">Instagram</a>
          <a href="#">YouTube</a>
        </div>

        <div class="footer-links">
          <a href="#">Terms of Use</a>
          <a href="#">About the us</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Cookies</a>
          <a href="#">Accessibility Help</a>
          <a href="#">Contact </a>
          <a href="#">Advertise with us</a>
          <a href="#">Do not share or sell my info</a>
          <a href="#">Contact technical support</a>
        </div>
      </footer>
    </div>
  );
}
export default Footer;
