export default class API {
  static async createContact(url, method, json) {
    try {
      let response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: json,
      });
      if (!response.ok) {
        throw new Error("Create Contact: Non 200");
      }
      return;
    } catch (e) {
      console.error("Create Contact Error:", e);
    }
  }

  static async updateContact(url, method, json) {
    try {
      let response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: json,
      });
      if (!response.ok) {
        throw new Error("Update Contact: Non 200");
      }
      return;
    } catch (e) {
      console.error("Create Contact Error:", e);
    }
  }

  static async getContacts() {
    try {
      let response = await fetch("/api/contacts", { method: "GET" });

      if (!response.ok) {
        throw new Error("Get Contacts: Non 200");
      }

      return await response.json();
    } catch (e) {
      console.error(e);
    }
  }
  static async delete(id) {
    try {
      let response = await fetch(`/api/contacts/${id}`, { method: "DELETE" });
      if (!response.ok) {
        throw new Error("Delete: Non 200");
      }
      return;
    } catch (e) {
      console.error(e);
    }
  }

  static async getContact(id) {
    try {
      let response = await fetch(`/api/contacts/${id}`);

      if (!response.ok) {
        throw new Error("Get Contact: Non 200");
      }
      return await response.json();
    } catch (e) {
      console.error(e);
    }
  }
}
