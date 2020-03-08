import React, { Component } from "react";
import { render } from "react-dom";
import ContactsContainer from "./ContactsContainer";

import "tailwindcss/dist/tailwind.css";
import "./style.scss";

const Footer = () => (
  <p class="text-center text-gray-500 text-xs mt-16">
    ©2020 Jag Inc. All rights reserved.
  </p>
);

const App = () => (
  <div class="w-full px-6 py-10">
    <ContactsContainer />
    <Footer />
  </div>
);

render(<App />, document.getElementById("root"));
