import API from "./api.js";
import View from "./view.js";

document.addEventListener("DOMContentLoaded", (e) => {
  class App {
    constructor() {
      this.view = new View();
      this.mainContainer = document.getElementById("main-container");
      this.renderMain();
    }

    renderMain() {
      API.getContacts().then((data) => {
        this.contacts = data.map((contact) => {
          if (contact.tags) {
            contact.tags = contact.tags.split(",");
          } else {
            contact.tags = ["None"];
          }
          return contact;
        });

        this.tags = [];
        this.contacts.forEach((contact) => {
          contact.tags.forEach((tag) => {
            if (!this.tags.includes(tag)) {
              this.tags.push(tag);
            }
          });
        });

        let html = this.view.main({ contacts: this.contacts, tags: this.tags });
        this.mainContainer.innerHTML = html;
        this.bindMainEvents();
      });
    }

    bindMainEvents() {
      let addContactBtns = [...document.querySelectorAll("button.add-contact")];
      addContactBtns.forEach((btn) =>
        btn.addEventListener("click", this.renderCreateForm.bind(this)),
      );

      let contactsContainer = document.getElementById("contacts-container");
      contactsContainer.addEventListener(
        "click",
        this.buttonInteractions.bind(this),
      );

      let mainTags = document.getElementById("main-tags");
      console.log(mainTags);
      mainTags.addEventListener("click", this.buttonInteractions.bind(this));

      let searchBar = document.querySelector("input.search");
      searchBar.addEventListener("keyup", this.searchHandler.bind(this));
    }

    buttonInteractions(e) {
      if (!(e.target instanceof HTMLButtonElement)) return;

      let action = e.target.name;
      let id = e.target.dataset.id;
      let tagName = e.target.dataset.tagName;

      if (action === "edit") {
        this.renderUpdateForm(id);
      } else if (action === "delete") {
        this.handleDelete(id);
      } else if (action === "select-tag") {
        this.handleTagSelect(tagName);
      }
    }

    handleTagSelect(tag) {
      let searchBar = document.querySelector("input.search");
      searchBar.value = "";
      if (tag === "exit-selection") {
        this.removeSelection();
      } else {
        this.showSelected(tag);
        let remove = document.querySelector("button.cancel");
        remove.style.display = "inline-block";
      }
    }

    removeSelection() {
      this.showAll();
      let remove = document.querySelector("button.cancel");
      remove.style.display = "none";
    }

    showAll() {
      let contactElements = this.mainContainer.querySelectorAll(".contact");
      for (let i = 0; i < contactElements.length; i++) {
        let contact = contactElements[i];
        contact.hidden = false;
      }
    }

    showSelected(tag) {
      let displayable = this.contacts.reduce((acc, contact) => {
        if (contact.tags && contact.tags.includes(tag)) {
          return [...acc, String(contact.id)];
        }
        return acc;
      }, []);

      let contactElements = this.mainContainer.querySelectorAll(".contact");
      for (let i = 0; i < contactElements.length; i++) {
        let contact = contactElements[i];
        if (displayable.includes(contact.id)) {
          contact.hidden = false;
        } else {
          contact.hidden = true;
        }
      }
    }

    renderCreateForm() {
      this.mainContainer.innerHTML = this.view.createForm({ tags: this.tags });
      this.bindFormEvents();
    }

    handleDelete(id) {
      let confirmed = confirm("Are you sure you want to delete this contact?");
      if (confirmed) {
        API.delete(id);
        this.renderMain();
      }
    }

    renderUpdateForm(id) {
      API.getContact(id).then((contactData) => {
        contactData["tags"] = this.tags;
        let html = this.view.updateForm(contactData);
        this.mainContainer.innerHTML = html;
        this.bindFormEvents();
      });
    }

    bindFormEvents() {
      let form = document.querySelector("form");
      if (form.dataset.type === "create") {
        form.addEventListener("submit", this.createSubmission.bind(this));
      } else if (form.dataset.type === "update") {
        form.addEventListener("submit", this.updateSubmission.bind(this));
      }

      let other = document.getElementById("other");
      other.addEventListener("change", this.otherCheckboxHandler);

      let cancelBtn = document.querySelector("button.cancel");
      cancelBtn.addEventListener("click", this.cancelForm.bind(this));
    }

    otherCheckboxHandler(e) {
      let otherInput = document.getElementById("otherValue");
      if (other.checked) {
        otherInput.style.display = "inline-block";
      } else {
        otherInput.style.display = "none";
      }
    }

    cancelForm(e) {
      e.preventDefault();
      this.renderMain();
    }

    serializeFormData(form) {
      const data = {};
      const fields = Array.from(form.querySelectorAll(".field"));

      fields.forEach((field) => {
        data[field.name] = field.value;
      });

      const tags = [];
      const checkboxes = Array.from(
        form.querySelectorAll('input.tag[type="checkbox"]'),
      );

      checkboxes.forEach((checkbox) => {
        if (checkbox.checked) {
          if (checkbox.value === "other") {
            const otherValue = form.querySelector("#otherValue").value;
            tags.push(otherValue);
          } else {
            tags.push(checkbox.value);
          }
        }
      });

      data.tags = tags.join(",");

      return JSON.stringify(data);
    }

    updateSubmission(e) {
      e.preventDefault();
      let form = e.currentTarget;
      const jsonData = this.serializeFormData(form);

      API.updateContact(form.action, "PUT", jsonData);
      this.renderMain();
    }

    createSubmission(e) {
      e.preventDefault();
      let form = e.currentTarget;
      const jsonData = this.serializeFormData(form);

      API.createContact(form.action, form.method, jsonData);
      this.renderMain();
    }

    searchHandler(e) {
      this.removeSelection();
      let contacts = [...document.querySelectorAll(".contact")];
      let searchValue = e.target.value;
      let criteria = new RegExp(searchValue.toLowerCase());

      this.filterVisible(contacts, criteria);

      let emptySearch = document.querySelector(".emptySearch");

      let noVisibleContacts = contacts.every((contact) => contact.hidden);
      if (noVisibleContacts) {
        emptySearch.textContent = `There are no contacts with the letters ${searchValue}.`;
        emptySearch.hidden = false;
      } else {
        emptySearch.hidden = true;
      }
    }

    filterVisible(contacts, criteria) {
      contacts.forEach((contact) => {
        let nameElement = contact.querySelector(".contact-name");
        let name = nameElement.textContent.toLowerCase();

        if (criteria.test(name)) {
          contact.hidden = false;
        } else {
          contact.hidden = true;
        }
      });
    }
  }

  new App();
});
