import React, { Component, useState } from "react";

import { MdEdit, MdDelete, MdDone } from "react-icons/md";

import { Button, IconButton, Anchor } from "./components/Button";
import ContactForm from "./ContactForm";

const Contact = ({ contact, editContact, deleteContact }) => {
  const { firstName, lastName, mobile, email, notes } = contact;

  return (
    <div class="bg-white rounded shadow-md mb-6 overflow-hidden">
      <div className="px-6 py-4">
        <div class="flex">
          <div className="flex-grow mb-2 text-teal-500 text-xl">
            {firstName} {lastName}
          </div>

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

const ContactCard = ({ contact, onUpdate, onDelete }) => {
  const [isEditMode, setEditMode] = useState(false);

  const enableEditMode = () => {
    console.log("enableEditMode");
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditMode(false);
  };

  const handleUpdate = contact => {
    setEditMode(false);
    onUpdate(contact);
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
          onSave={handleUpdate}
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

const ContactSearch = ({ onSearch }) => {
  const [searchText, setSearchText] = useState("");
  const handleSearch = e => {
    setSearchText(e.target.value);
    onSearch(e.target.value);
  };
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
export { ContactCard, ContactSearch };
