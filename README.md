# Node.js simple REST generator

## Features

* Easy to use :)
* List Pagination
* List Autocomplete
* List ordering/sorting
* Customisable controller methods
* Customisable model methods
* Customisable middleware

# Lets move to fast examples!

## Use when fetching:

```javascript
POST http://localhost:5000/cat/list
Content-Type: application/json

{
    "limit": 2,
    "page": 1,
    "autocomplete": { "key": "code", "value": "tes"},
    "sort": "+cat"
}
```

## Use in Model:

```javascript
const modelSchema = new mongoose.Schema(
  {
    cat: {
      type: String,
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

const listOptions = {
  listSelect: "-_id",
};

Generator.generateModel(modelSchema, listOptions);

module.exports = mongoose.model("Model", modelSchema);

```

## Use in Controller:

```javascript
const options = {};

Generator.controllerGenerator(router, Model, options);

module.exports = router;

```

# Documentation:

Model Parameters:
--------------------

generateModel(scheme, {listPopulate, listSelect, getPopulate, getSelect}, {customGet, customList, customCreate, customEdit, customDelete})

parameter             |  description
----------------------|------------------------------------------------------------------------------------
scheme                | Should be normal moongose scheme [documentation](https://mongoosejs.com/docs/guide.html)
listPopulate          | Mongoose populate for LIST [documentation](https://mongoosejs.com/docs/populate.html)
listSelect            | Mongoose select for LIST [documentation](https://mongoosejs.com/docs/queries.html)
getPopulate           | Mongoose populate for GET [documentation](https://mongoosejs.com/docs/populate.html)
getSelect             | Mongoose select for GET [documentation](https://mongoosejs.com/docs/queries.html)
customGet             | Custom function for GET
customList            | Custom function for LIST
customCreate          | Custom function for CREATE
customEdit            | Custom function for EDIT
customDelete          | Custom function for DELETE


Controller Parameters:
--------------------

generateController(router, {customGet, customList, customCreate, customEdit, customDelete}, middleware)

