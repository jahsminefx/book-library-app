class BaseController {
    constructor(model) {
      this.model = model;
    }
  
    // List all items
    async list(req, res) {
      try {
        const items = await this.model.findAll();
        res.render(`${this.model.name.toLowerCase()}s/list`, {
          items,
          title: `${this.model.name}s`
        });
      } catch (err) {
        console.error(err);
        res.status(500).render('errors/error', { error: err });
      }
    }
  
    // Show form to create new item
    newForm(req, res) {
      res.render(`${this.model.name.toLowerCase()}s/new`, {
        title: `New ${this.model.name}`
      });
    }
  
    // Create new item
    async create(req, res) {
      try {
        await this.model.create(req.body);
        req.flash('success_msg', `${this.model.name} created successfully`);
        res.redirect(`/${this.model.name.toLowerCase()}s`);
      } catch (err) {
        console.error(err);
        res.status(500).render('errors/error', { error: err });
      }
    }
  
    // Show item details
    async show(req, res) {
      try {
        const item = await this.model.findByPk(req.params.id);
        if (!item) {
          req.flash('error_msg', `${this.model.name} not found`);
          return res.redirect(`/${this.model.name.toLowerCase()}s`);
        }
        res.render(`${this.model.name.toLowerCase()}s/show`, {
          item,
          title: `${this.model.name} Details`
        });
      } catch (err) {
        console.error(err);
        res.status(500).render('errors/error', { error: err });
      }
    }
  
    // Show edit form
    async editForm(req, res) {
      try {
        const item = await this.model.findByPk(req.params.id);
        if (!item) {
          req.flash('error_msg', `${this.model.name} not found`);
          return res.redirect(`/${this.model.name.toLowerCase()}s`);
        }
        res.render(`${this.model.name.toLowerCase()}s/edit`, {
          item,
          title: `Edit ${this.model.name}`
        });
      } catch (err) {
        console.error(err);
        res.status(500).render('errors/error', { error: err });
      }
    }
  
    // Update item
    async update(req, res) {
      try {
        const item = await this.model.findByPk(req.params.id);
        if (!item) {
          req.flash('error_msg', `${this.model.name} not found`);
          return res.redirect(`/${this.model.name.toLowerCase()}s`);
        }
        await item.update(req.body);
        req.flash('success_msg', `${this.model.name} updated successfully`);
        res.redirect(`/${this.model.name.toLowerCase()}s`);
      } catch (err) {
        console.error(err);
        res.status(500).render('errors/error', { error: err });
      }
    }
  
    // Delete item
    async delete(req, res) {
      try {
        const item = await this.model.findByPk(req.params.id);
        if (!item) {
          req.flash('error_msg', `${this.model.name} not found`);
          return res.redirect(`/${this.model.name.toLowerCase()}s`);
        }
        await item.destroy();
        req.flash('success_msg', `${this.model.name} deleted successfully`);
        res.redirect(`/${this.model.name.toLowerCase()}s`);
      } catch (err) {
        console.error(err);
        res.status(500).render('errors/error', { error: err });
      }
    }
  }
  
  module.exports = BaseController;