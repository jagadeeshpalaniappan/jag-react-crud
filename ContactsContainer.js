import React, { Component } from "react";
import debounce from "lodash.debounce";

import { ContactCard, ContactSearch } from "./Contact";
import { Button } from "./components/Button";
import { MdAdd } from "react-icons/md";

import ContactForm from "./ContactForm";

import { setStateAsync } from "./utils/PromiseUtil";

// import { getAll, getById, create, update, remove } from "./ContactsService";
import {
  getAll,
  getById,
  search,
  create,
  update,
  remove
} from "./ContactsServiceLocal";

// import { search } from "./utils/CrudTemplateLocal";

const infiniteScroll = cb => {
  // Binds our scroll event handler
  window.onscroll = debounce(() => {
    // Checks that the page has scrolled to the bottom
    const { scrollTop, offsetHeight } = document.documentElement;
    const { innerHeight } = window;

    console.log("onscroll:", { innerHeight, scrollTop, offsetHeight });
    if (window.innerHeight + scrollTop === offsetHeight) {
      cb();
    }
  }, 100);
};

/* ###################### ContactsContainer ###################### */

class ContactsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contacts: [],
      searchText: "",
      searchResults: [],
      showCreateForm: false,
      pagination: {
        lastPageNo: 0,
        pageSize: 10,
        reachedMax: false,
        isLoading: false
      }
    };

    this.handleCreate = this.handleCreate.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleSearch = this.handleSearch.bind(this);

    this.toggleCreateForm = this.toggleCreateForm.bind(this);
    this.setStateAsync = setStateAsync.bind(this);
  }

  componentDidMount() {
    this.getAllContacts();
    this.registerInifinteScroll();
  }

  async loadMoreContacts() {
    // mark: isLoading
    await this.setStateAsync({
      ...this.state,
      pagination: {
        ...this.state.pagination,
        isLoading: true
      }
    });

    const { lastPageNo, pageSize } = this.state.pagination;

    const nextPageNo = lastPageNo + 1;
    const [err, contactsResp] = await getAll({ pageNo: nextPageNo, pageSize });
    const { data, meta } = contactsResp;
    const { totalRecords } = meta;
    const reachedMax = this.state.contacts.length === totalRecords;

    await this.setStateAsync({
      ...this.state,
      contacts: [...this.state.contacts, ...data],
      pagination: {
        ...this.state.pagination,
        lastPageNo: nextPageNo,
        isLoading: false,
        reachedMax
      }
    });
    console.log(`loadMoreContacts: ${nextPageNo}: newData: `, data);
    console.log(
      `loadMoreContacts: ${nextPageNo}: allData: `,
      this.state.contacts
    );
  }

  async getAllContacts() {
    await this.loadMoreContacts();
    // await this.loadMoreContacts();
    // await this.loadMoreContacts();
    // await this.loadMoreContacts();
    // await this.loadMoreContacts();
  }

  registerInifinteScroll() {
    infiniteScroll(() => {
      console.log("infiniteScroll:");
      const { isLoading, reachedMax } = this.state.pagination;
      if (!isLoading && !reachedMax) {
        this.loadMoreContacts();
      }
    });
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
    } else if (this.state.searchText) {
      await this.getAllContacts();
      this.handleSearch(this.state.searchText);
    } else {
      this.getAllContacts();
    }
  }

  async handleSearch(searchText) {
    console.log("handleSearch", searchText);
    if (searchText) {
      const [err, searchResults] = await search(searchText);
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
    const {
      contacts,
      searchText,
      searchResults,
      showCreateForm,
      pagination
    } = this.state;
    const displayContacts = searchText ? searchResults : contacts; // if:searchText available, showOnly searchResults
    const { isLoading } = pagination;

    return (
      <div className="app-m-h-70">
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

        {isLoading && <p className="text-center text-gray-500"> Loading... </p>}
      </div>
    );
  }
}

export default ContactsContainer;
