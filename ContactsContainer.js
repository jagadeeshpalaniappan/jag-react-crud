import React, { Component } from "react";
import { ContactCard, ContactSearch } from "./Contact";


class ContactsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contacts: this.props.contacts || [],
      searchText: "",
      searchResults: []
    };

    this.handleSave = this.handleSave.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

  handleSave(newContact) {
    console.log("handleSave", newContact);
    this.setState(state => {
      console.log(state.contacts);
      const newContacts = state.contacts.map(contact =>
        contact.id === newContact.id ? { ...newContact } : contact
      );
      console.log(newContacts);
      return { ...state, contacts: newContacts };
    });
  }

  handleDelete(targetContact) {
    console.log("handleDelete");
    this.setState(state => {
      console.log(state.contacts);
      const newContacts = state.contacts.filter(
        contact => contact.id !== targetContact.id
      );
      console.log(newContacts);
      return { ...state, contacts: newContacts };
    });
  }

  handleSearch(searchText) {
    console.log("handleSearch", searchText);
    if (searchText) {
      this.setState(state => {
        console.log(state.contacts);
        const searchResults = state.contacts.filter(
          contact =>
            contact.name.includes(searchText) ||
            contact.email.startsWith(searchText) ||
            contact.mobile.startsWith(searchText) ||
            contact.notes.startsWith(searchText)
        );
        return { ...state, searchText, searchResults };
      });
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
              onSave={this.handleSave}
              onDelete={this.handleDelete}
            />
          ))}
        </div>
      </>
    );
  }
}

export default ContactsContainer;
