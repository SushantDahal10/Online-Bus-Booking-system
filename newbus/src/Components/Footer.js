import React from 'react';
import '../CSS/Footer.css'; 
import { LuBus } from "react-icons/lu";
import { FaFacebookSquare } from "react-icons/fa";
import { GrInstagram } from "react-icons/gr";
import { FaSquareXTwitter } from "react-icons/fa6";
import logo from '../Components/Images/download.png';
export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-logo-section">
                    <img className="footer-logo" src={logo} />
                    <p>
                        QuickBus is the online bus ticket booking service, trusted by customers globally. New Bus offers bus ticket booking through its website  for all major routes.
                    </p>
                </div>
                <div className="footer-links-section">
                    <div className="footer-column">
                        <h3>About QuickBus</h3>
                        <ul>
                            <li><a href="#">About us</a></li>
                            <li><a href="#">Investor Relations</a></li>
                            <li><a href="#">Contact us</a></li>
                            <li><a href="#">Mobile version</a></li>
                            <li><a href="#">New Bus on mobile</a></li>
                            <li><a href="#">Sitemap</a></li>
                            <li><a href="#">Offers</a></li>
                            <li><a href="#">Careers</a></li>
                            <li><a href="#">Values</a></li>
                        </ul>
                    </div>
                    <div className="footer-column">
                        <h3>Info</h3>
                        <ul>
                            <li><a href="#">T&C</a></li>
                            <li><a href="#">Privacy policy</a></li>
                            <li><a href="#">FAQ</a></li>
                            <li><a href="#">Blog</a></li>
                            <li><a href="#">Bus operator registration</a></li>
                            <li><a href="#">Agent registration</a></li>
                            <li><a href="#">Insurance partner</a></li>
                            <li><a href="#">User agreement</a></li>
                            <li><a href="#">Primo Bus</a></li>
                            <li><a href="#">Bus Timetable</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <p>© 2024 Quick Bus Pvt Ltd. All rights reserved</p>
                <div className="footer-social-icons">
                    <a href="#"><FaFacebookSquare  className="fab fa-facebook-f"/></a>
                    <a href="#"><GrInstagram className="fab fa-instagram"/></a>
                    <a href="#"><FaSquareXTwitter className="fab fa-twitter"/></a>
   
                </div>
            </div>
        </footer>
    );
}
