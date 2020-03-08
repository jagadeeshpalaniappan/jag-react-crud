import React, { Component } from "react";
import { ContactCard, ContactSearch } from "./Contact";
import { Button } from "./components/Button";
import { MdAdd } from "react-icons/md";

import ContactForm from "./ContactForm";

import { getAll, getById, create, update, remove } from "./ContactsService";
import { search } from "./utils/CrudTemplateLocal";


/* ###################### ContactsContainer ###################### */

class ContactsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contacts: [],
      searchText: "",
      searchResults: [],
      showCreateForm: false
    };

    this.handleCreate = this.handleCreate.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleSearch = this.handleSearch.bind(this);

    this.toggleCreateForm = this.toggleCreateForm.bind(this);

    this.getAllContacts();
  }

  async getAllContacts() {
    const [err, contacts] = await getAll();
    console.log(contacts);
    this.setState({ contacts });
  }

  async handleCreate(newContact) {
    console.log("handleCreate", newContact);
    const [err] = await create(newContact);
    if (err) {
      console.error(err);
    } else {
      this.toggleCreateForm(false);
      this.getAllContacts();
    }
  }

  toggleCreateForm(overideStatus) {
    this.setState({ showCreateForm: !!overideStatus });
  }

  async handleUpdate(updatedContact) {
    console.log("handleUpdate", updatedContact);
    const [err] = await update(updatedContact);
    if (err) {
      console.error(err);
    } else {
      this.getAllContacts();
    }
  }

  async handleDelete(targetContact) {
    console.log("handleDelete");
    const [err] = await remove(targetContact);
    if (err) {
      console.error(err);
    } else if(this.state.searchText) {
      await this.getAllContacts();
      this.handleSearch(this.state.searchText);
    } else {
      this.getAllContacts();
    }
  }

  handleSearch(searchText) {
    console.log("handleSearch", searchText);
    if (searchText) {
      const searchResults = search(this.state.contacts, searchText);
      this.setState(state => ({
        ...state,
        searchText,
        searchResults
      }));
    } else {
      this.setState({ searchText });
    }
  }

  render() {
    const { contacts, searchText, searchResults, showCreateForm } = this.state;

    const displayContacts = searchText ? searchResults : contacts;

    return (
      <>
        <div class="flex mb-5">
          <Button
            text="Create"
            icon={<MdAdd />}
            color="primary"
            className="ml-auto"
            onClick={() => this.toggleCreateForm(true)}
          />
        </div>
        {showCreateForm && (
          <ContactForm
            onSave={this.handleCreate}
            onCancel={() => this.toggleCreateForm(false)}
          />
        )}

        <div class="mb-5">
          <ContactSearch onSearch={this.handleSearch} />
        </div>
        <div>
          {displayContacts.map(contact => (
            <ContactCard
              key={contact.id}
              contact={contact}
              onUpdate={this.handleUpdate}
              onDelete={this.handleDelete}
            />
          ))}
        </div>
      </>
    );
  }
}

export default ContactsContainer;
