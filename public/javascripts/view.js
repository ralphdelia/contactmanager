export default class View {
  constructor() {
    this.cacheTemplate();
  }

  main(contacts) {
    return this.templates.mainView(contacts);
  }

  createForm(tags) {
    let formData = Object.assign(
      {
        type: "create",
        method: "POST",
        action: "/api/contacts/",
        title: "Create Contact",
      },
      tags,
    );

    return this.templates.mainForm(formData);
  }

  updateForm(contact) {
    Object.assign(contact, {
      type: "update",
      method: "PUT",
      action: `/api/contacts/${contact.id}`,
      title: "Update Contact",
    });

    return this.templates.mainForm(contact);
  }

  cacheTemplate() {
    this.templates = {};
    let scripts = [...document.querySelectorAll("script.template")];
    scripts.forEach((script) => {
      let template = Handlebars.compile(script.innerHTML);
      let name = script.getAttribute("name");
      this.templates[name] = template;

      if (script.dataset.type === "partial") {
        Handlebars.registerPartial(name, template);
      }

      script.remove();
    });
  }
}
