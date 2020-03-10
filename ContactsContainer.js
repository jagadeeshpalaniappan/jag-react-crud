import React, { Component } from "react";
import debounce from "lodash.debounce";

import { ContactCard, ContactSearch } from "./Contact";
import { Button } from "./components/Button";
import { MdAdd } from "react-icons/md";

import ContactForm from "./ContactForm";

import { hp, cp, setStateAsync } from "./utils/PromiseUtil";

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

    // console.log("onscroll:", { innerHeight, scrollTop, offsetHeight });
    if (window.innerHeight + scrollTop === offsetHeight) {
      cb();
    }
  }, 100);
};

/* ###################### ContactsContainer ###################### */

const DEFAULT_PAGINATON = {
  lastPageNo: 0,
  pageSize: 10,
  hasMoreData: true
};

class ContactsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contacts: [],
      showCreateForm: false,
      pagination: { ...DEFAULT_PAGINATON },
      searchCriteria: {
        searchText: "",
        searchResults: [],
        pagination: { ...DEFAULT_PAGINATON }
      },
      isLoading: false
    };

    this.tx = [];

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

  cancelPrevTx() {
    console.log(`cancelPrevTx: start`);
    for (const tx of this.tx) {
      console.log(`cancelPrevTx: tx`, tx);
      tx.cancel();
    }
    this.tx = [];
    console.log(`cancelPrevTx: done`);
  }

  getPagination() {
    const newPagination = {};
    if (this.state.searchCriteria.searchText) {
      // SEARCH-PAGINATION:
      newPagination = this.state.searchCriteria.pagination;
    } else {
      // PAGINATION:
      newPagination = this.state.pagination;
    }
    return newPagination;
  }

  getQuery() {
    const query = {};

    // SEARCH-TEXT:
    if (this.state.searchCriteria.searchText) {
      query.searchText = this.state.searchCriteria.searchText;
    }

    // PAGINATION:
    const pagination = this.getPagination();
    query.pagination = {
      pageNo: pagination.lastPageNo + 1,
      pageSize: pagination.pageSize
    };

    return query;
  }

  getNewState(contactsResp) {
    console.log("this.state", this.state);

    const newState = {};

    const { data, meta } = contactsResp;
    const { pageNo, totalRecords } = meta;

    const { searchCriteria } = this.state;
    const { searchText } = searchCriteria;

    if (searchText) {
      console.log(`RESP:searchText `, searchCriteria.searchResults, data);

      // const searchResults =
      //   searchText === searchCriteria.searchText
      //     ? [...searchCriteria.searchResults, ...data]
      //     : [...data];

      const searchResults = [...searchCriteria.searchResults, ...data];

      const hasMoreData = searchResults.length < totalRecords;

      const pagination = {
        ...searchCriteria.pagination,
        lastPageNo: pageNo,
        hasMoreData
      };

      newState.searchCriteria = {
        ...searchCriteria,
        searchResults,
        pagination
      };

      console.log(
        `loadMoreContacts: ${searchText} :${searchText ===
          this.state.searchCriteria.searchText}: newState.searchResults: `,
        newState.searchCriteria.searchResults
      );
    } else {
      newState.contacts = [...this.state.contacts, ...data];
      const hasMoreData = newState.contacts.length < totalRecords;

      newState.pagination = {
        ...this.state.pagination,
        lastPageNo: pageNo,
        hasMoreData
      };
    }

    newState.isLoading = false;

    return newState;
  }

  async loadMoreContacts() {
    console.log(`loadMoreContacts: start`);
    this.cancelPrevTx();

    // SET-STATE: isLoading:true
    await this.setStateAsync({ isLoading: true });

    // QUERY:
    const query = this.getQuery();
    console.log(`QUERY: `, query);
    const prObj = cp(getAll(query));

    // API:
    this.tx.push(prObj);
    const [err, contactsResp] = await hp(prObj.promise);
    if (!err) {
      // RESP:
      console.log(`RESP:success`, contactsResp);
      const newState = this.getNewState(contactsResp);

      // SET-STATE: resp
      await this.setStateAsync({ ...this.state, ...newState });
      console.log(
        `loadMoreContacts: ${contactsResp.pageNo}: newData: `,
        contactsResp.data
      );
      console.log(
        `loadMoreContacts: ${contactsResp.pageNo}: allContacts: `,
        this.state.contacts
      );
      console.log(
        `loadMoreContacts: ${contactsResp.pageNo}: allSearchResults: `,
        this.state.searchCriteria.searchResults
      );
    } else {
      console.log(`RESP:err`, err);
      this.setStateAsync({ isLoading: false });
    }
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
      const { isLoading } = this.state;
      const { hasMoreData } = this.getPagination();
      if (!isLoading && hasMoreData) {
        console.log("infiniteScroll:", { isLoading, hasMoreData });
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

    // update: searchText & reset: searchCriteria
    const searchCriteria = {
      ...this.state.searchCriteria,
      searchText,
      searchResults: [],
      pagination: { ...DEFAULT_PAGINATON }
    };
    await this.setStateAsync({ ...this.state, searchCriteria });
    this.loadMoreContacts();
  }

  render() {
    const {
      contacts,
      searchCriteria,
      showCreateForm,
      pagination,
      isLoading
    } = this.state;

    const { searchText, searchResults } = searchCriteria;
    const displayContacts = searchText ? searchResults : contacts; // if:searchText available, showOnly searchResults
    const { hasMoreData } = this.getPagination();

    return (
      <div className="app-m-h-70">
        <div className="flex mb-5">
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

        <div className="mb-5">
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
        {!hasMoreData && (
          <p className="text-center text-gray-500"> No more records </p>
        )}
      </div>
    );
  }
}

export default ContactsContainer;
