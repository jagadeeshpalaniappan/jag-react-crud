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
      showCreateForm: false,
      pagination: {
        lastPageNo: 0,
        pageSize: 10,
        reachedMax: false,
        isLoading: false
      },
      searchCriteria: {
        searchText: "",
        searchResults: [],
        pagination: {
          lastPageNo: 0,
          pageSize: 10,
          reachedMax: false,
          isLoading: false
        }
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
    console.log(`loadMoreContacts: start`);

    // mark: isLoading
    await this.setStateAsync({
      ...this.state,
      pagination: {
        ...this.state.pagination,
        isLoading: true
      }
    });

    const { pagination, searchCriteria } = this.state;
    const { searchText } = searchCriteria;

    // QUERY:
    const query = {};

    if (searchText) {
      query.searchText = searchText;

      // SEARCH-PAGINATION:
      const { lastPageNo, pageSize } = searchCriteria.pagination;
      const nextPageNo = lastPageNo + 1;
      query.pagination = { pageNo: nextPageNo, pageSize };
    } else {
      // PAGINATION:
      const { lastPageNo, pageSize } = pagination;
      const nextPageNo = lastPageNo + 1;
      query.pagination = { pageNo: nextPageNo, pageSize };
    }

    console.log(`QUERY: `, query);
    const [err, contactsResp] = await getAll(query);
    console.log(`RESP: `, contactsResp);

    const { data, meta } = contactsResp;
    const { totalRecords } = meta;
    const reachedMax = this.state.contacts.length === totalRecords;

    const newState = {
      pagination: {
        ...this.state.pagination,
        lastPageNo: nextPageNo,
        isLoading: false,
        reachedMax
      }
    };

    if (searchText) {
      console.log(`RESP:searchText `, this.state.searchResults, data);
      const { searchCriteria } = this.state;

      const searchResults =
        searchText === searchCriteria.searchText
          ? [...searchCriteria.searchResults, ...data]
          : [...data];

      newState.searchCriteria = { ...searchCriteria, searchResults };

      console.log(
        `loadMoreContacts: ${searchText} :${searchText ===
          this.state.searchCriteria.searchText}: newState.searchResults: `,
        newState.searchCriteria.searchResults
      );
    } else {
      newState.contacts = [...this.state.contacts, ...data];
    }

    await this.setStateAsync({ ...this.state, ...newState });
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
    } else if (this.state.searchCriteria.searchText) {
      await this.getAllContacts();
      this.handleSearch(this.state.searchCriteria.searchText);
    } else {
      this.getAllContacts();
    }
  }

  async handleSearchLocal(searchText) {
    console.log("handleSearch", searchText);
    if (searchText) {
      const [err, searchResults] = await search(searchText);
      const searchCriteria = {
        ...this.state.searchCriteria,
        searchText,
        searchResults
      };
      this.setState({ ...this.state, searchCriteria });
    } else {
      const searchCriteria = { ...this.state.searchCriteria, searchText };
      this.setState({ ...this.state, searchCriteria });
    }
  }

  async handleSearch(searchText) {
    console.log("handleSearch", searchText);
    const searchCriteria = { ...this.state.searchCriteria, searchText };
    await this.setStateAsync({ ...this.state, searchCriteria });
    this.loadMoreContacts();
  }

  render() {
    const { contacts, searchCriteria, showCreateForm, pagination } = this.state;

    const { searchText, searchResults } = searchCriteria;
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
