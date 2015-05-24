# Jasmine.mock
Jasmine.mock is a small Jasmine helper that allows you to easily mock (**completely** or **partially**) objects and classes in your tests.

It helps you testing modules in **isolation**, offering a simple way to mock their dependencies.


## Install
To install it, just download the `jasmineMock.js` file and make sure to load it along with your helpers.

**Grunt**
1. Create a `helpers` folder under your test and copy `jasmineMock.js` there.
- Configure the jasmine task to load the helpers from that folder.

```javascript
jasmine: {
    lib: {
        src: 'path/to/src/**/*.js',
        options: {
            specs: 'path/to/spec/*.spec.js',
            helpers: 'path/to/spec/helpers/*.js'
        }
    }
}
```

--------------------------------------------------------------------------------

## Usage
You can use the library to create mock versions of your objects/dependencies.

**Example 1. Completely mock a model for a view**

```javascript
beforeEach(function () {
    var fakeModel = jasmine.mock.create(Backbone.Model);

    // fakeModel has all the methods of a Backbone.Model as spies
    fakeModel.get.and.callFake(function (prop) {
        // Fake implementation
    });

    this.view = new PersonView({ model: fakeModel });
})
```

**Example 2. Partially mock a model for a view**

```javascript
// In your Person.js
...
var Person = Backbone.Model.extend({
    getFullName: function () { // implementation },
    getBirthDate: function () { // implementation },
    getAge: function () { // implementation },
    ...
});
...

// In your spec.
// You want to mock all the new methods of the Person model,
// but still want to use the default get/set/trigger method of
// a plain Backbone.Model
beforeEach(function () {
    var fakeModel = jasmine.mock.create(Person, Backbone.Model);

    fakeModel.getFullName.and.callFake(function () {
        // Fake implementation
    });

    this.view = new PersonView({ model: fakeModel });
})

it('works as expected', function () {
    // You can still use the default implementation of 'set'
    this.view.model.set('name', 'Steve');
    this.view.model.set('surname', 'Jobs');
    ...
});
```
