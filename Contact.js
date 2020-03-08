import React, { Component, useState } from "react";

import { MdEdit, MdDelete, MdDone } from "react-icons/md";

import { Button, IconButton, Anchor } from "./components/Button";
import { FormInput } from "./components/Form";

const Contact = ({ contact, editContact, deleteContact }) => {
  const { name, mobile, email, notes } = contact;

  return (
    <div class="bg-white rounded shadow-md mb-6 overflow-hidden">
      <div className="px-6 py-4">
        <div class="flex">
          <div className="flex-grow mb-2 text-teal-500 text-xl">{name}</div>

          <div class="flex-grow-0 text-gray-800 ml-2">
            <IconButton
              onClick={editContact}
              icon={<MdEdit />}
              title="Edit Contact"
            />
            <IconButton
              onClick={deleteContact}
              color="red"
              icon={<MdDelete />}
              title="Delete Contact"
            />
          </div>
        </div>

        {notes && <p className="text-gray-700 text-base">{notes}</p>}

        <div className="mt-3">
          {email && (
            <Anchor text={email} href={`mailto:${email}`} target="_blank" />
          )}
          {mobile && (
            <Anchor text={mobile} href={`tel:${mobile}`} target="_blank" />
          )}
        </div>
      </div>
    </div>
  );
};

class ContactForm extends Component {
  constructor(props) {
    super(props);

    console.log("Contact: init", this.state);

    this.state = {
      contact: this.props.contact
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
    const { onSave, onCancel } = this.props;
    const { contact } = this.state;
    const { id, name, email, mobile, notes, tags } = contact;

    console.log("Contact: render", this.state);

    return (
      <div class="bg-white rounded shadow-md mb-6 overflow-hidden">
        <div className="px-6 py-4">
          <form id={`form-${id}`} onSubmit={this.handleSubmit} noValidate>
            <FormInput
              id={`name-${id}`}
              label="Name"
              text={name}
              onTextChange={val => this.onContactChange("name", val)}
            />

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

const ContactCard = ({ contact, onSave, onDelete }) => {
  const [isEditMode, setEditMode] = useState(false);

  const enableEditMode = () => {
    console.log("enableEditMode");
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditMode(false);
  };

  const handleSave = contact => {
    setEditMode(false);
    onSave(contact);
  };

  const deleteContact = () => {
    if (confirm("Are you sure you want to delete?")) {
      onDelete(contact);
    }
  };

  return (
    <>
      {isEditMode && (
        <ContactForm
          contact={contact}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
      {!isEditMode && (
        <Contact
          contact={contact}
          editContact={enableEditMode}
          deleteContact={deleteContact}
        />
      )}
    </>
  );
};

const ContactSearch = ({onSearch}) => {
  const [searchText, setSearchText] = useState('');
  const handleSearch = (e) => {
    console.log(e);
    setSearchText(e.target.value);
    onSearch(e.target.value);
  }
  return (
      <input
        className="bg-gray-200 text-teal-500 focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block w-full appearance-none leading-normal"
        type="email"
        placeholder="Search"
        value={searchText}
        onChange={handleSearch}
      />
  );
};
export { ContactCard, ContactSearch};
