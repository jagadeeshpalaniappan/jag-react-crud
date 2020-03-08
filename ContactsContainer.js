import React, { Component } from "react";
import { ContactCard, ContactSearch } from "./Contact";

import {
  getAll,
  getById,
  create,
  update,
  remove,
  search
} from "./ContactsService";

/* ###################### ContactsContainer ###################### */

class ContactsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contacts: getAll() || [],
      searchText: "",
      searchResults: []
    };

    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

  handleUpdate(newContact) {
    console.log("handleUpdate", newContact);
    this.setState(state => {
      return { ...state, contacts: update(state.contacts, newContact) };
    });
  }

  handleDelete(targetContact) {
    console.log("handleDelete");
    this.setState(
      state => {
        return { ...state, contacts: remove(state.contacts, targetContact) };
      },
      () => this.handleSearch(this.state.searchText)
    );
  }

  handleSearch(searchText) {
    console.log("handleSearch", searchText);
    if (searchText) {
      this.setState(state => ({
        ...state,
        searchText,
        searchResults: search(state.contacts, searchText)
      }));
    } else {
      this.setState({ searchText });
    }
  }

  render() {
    const { contacts, searchText, searchResults } = this.state;

    const displayContacts = searchText ? searchResults : contacts;

    return (
      <>
        <div class="mb-5">
          <ContactSearch onSearch={this.handleSearch} />
        </div>
        <div>
          {displayContacts.map(contact => (
            <ContactCard
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
