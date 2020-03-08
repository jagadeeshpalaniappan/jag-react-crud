import React, { Component } from "react";
import { render } from "react-dom";

import DataGenerator from "./utils/DataGenerator";
import ContactsContainer from "./ContactsContainer";

import "tailwindcss/dist/tailwind.css";
import "./style.scss";


/* ###################### Data ###################### */

const mapContact = id => ({
  id,
  name: `Person - ${id}`,
  email: `user${id}@gmail.com`,
  mobile: `+1 ${id}-456-7890`,
  notes:
    "Lorem ipsum dolor sit amet, consectetur elit. Voluptatibus quia, nulla!",
  tags: ["eat", "code", "sleep"]
});
const contacts = DataGenerator.generate(100, mapContact);


/* ###################### App ###################### */

const Footer = () => (
  <p class="text-center text-gray-500 text-xs mt-16">
    ©2020 Jag Inc. All rights reserved.
  </p>
);

const App = () => (
  <div class="bg-gray-200 px-6 py-10">
    <div class="w-full">
      <ContactsContainer contacts={contacts} />
    </div>
    <Footer />
  </div>
);

render(<App />, document.getElementById("root"));
