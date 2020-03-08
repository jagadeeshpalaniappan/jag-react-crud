import React, { Component, useState } from "react";

import { MdEdit, MdDelete, MdDone } from "react-icons/md";

import { Button, IconButton, Anchor } from "./components/Button";
import { FormInput } from "./components/Form";

class ContactForm extends Component {
  constructor(props) {
    super(props);

    console.log("Contact: init", this.state);

    this.state = {
      contact: this.props.contact || {}
    };

    this.onContactChange = this.onContactChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  onContactChange(key, val) {
    console.log("onContactChange", key, val);
    // this.setState({ contact: { ...this.state.contact, [key]: val } });
    this.setState(state => ({
      contact: { ...this.state.contact, [key]: val }
    }));
  }

  handleSubmit(e) {
    console.log("handleSubmit", this.state.contact); // TODO: not working
    e.preventDefault();
    this.props.onSave(this.state.contact);
    return false;
  }

  render() {
    const { onCancel } = this.props;
    const { contact } = this.state;
    const { id, firstName, lastName, email, mobile, notes, tags } = contact;

    console.log("Contact: render", this.state);

    return (
      <div class="bg-white rounded shadow-md mb-6 overflow-hidden">
        <div className="px-6 py-4">
          <form id={`form-${id}`} onSubmit={this.handleSubmit} noValidate>
            <div class="flex flex-wrap -mx-3 mb-6">
              <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                <FormInput
                  id={`firstName-${id}`}
                  label="First Name"
                  text={firstName}
                  onTextChange={val => this.onContactChange("firstName", val)}
                />
              </div>
              <div class="w-full md:w-1/2 px-3">
                <FormInput
                  id={`lastName-${id}`}
                  label="Last Name"
                  text={lastName}
                  onTextChange={val => this.onContactChange("lastName", val)}
                />
              </div>
            </div>

            <div class="flex flex-wrap -mx-3 mb-6">
              <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                <FormInput
                  id={`email-${id}`}
                  label="Email"
                  text={email}
                  onTextChange={val => this.onContactChange("email", val)}
                />
              </div>
              <div class="w-full md:w-1/2 px-3">
                <FormInput
                  id={`mobile-${id}`}
                  label="Mobile"
                  text={mobile}
                  onTextChange={val => this.onContactChange("mobile", val)}
                />
              </div>
            </div>

            <FormInput
              id={`notes-${id}`}
              label="Notes"
              text={notes}
              onTextChange={val => this.onContactChange("notes", val)}
            />

            <div className="flex mt-5">
              <Button
                text="Cancel"
                onClick={onCancel}
                color="default"
                className="ml-auto"
              />
              <Button
                text="Save"
                type="submit"
                color="primary"
                icon={<MdDone />}
              />
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default ContactForm;
