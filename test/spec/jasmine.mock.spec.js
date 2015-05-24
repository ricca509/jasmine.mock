describe('The jasmineMock', function() {
    var backboneDefaultProps = ['_changing', '_pending', '_previousAttributes', 'attributes', 'changed', 'cid'];

    beforeEach(function () {
        this.Model = Backbone.Model;

        this.ModelExtendedOnce = Backbone.Model.extend({
            newProperty1: 1,
            newProperty2: 2,
            newMethod1: function () {},
            newMethod2: function () {}
        });

        this.ModelExtendedTwice = this.ModelExtendedOnce.extend({
            newProperty3: 3,
            newProperty4: 4,
            newMethod3: function () {},
            newMethod4: function () {}
        });
    });

    it('should add a "mock" object to jasmine', function () {
        expect(jasmine.mock).toBeDefined();
    });

    it('should have a "getProps" function', function () {
        expect(jasmine.mock.getProps).toBeDefined();
        expect(_.isFunction(jasmine.mock.getProps)).toBeTruthy();
    });

    it('should have a "create" function', function () {
        expect(jasmine.mock.create).toBeDefined();
        expect(_.isFunction(jasmine.mock.create)).toBeTruthy();
    });

    describe('#getProps(constructor, stopAtConstructor)', function () {
        describe('when given a simple Backbone object', function () {
            it('should return the list of properties', function () {
                var expected = _.keys(Backbone.Model.prototype).sort(),
                    result = jasmine.mock.getProps(this.Model).sort();

                expect(result.length).toBe(expected.length);
                expect(result).toEqual(expected);
            });
        });

        describe('when given an extended (once) Backbone object', function () {
            it('should return the list of properties', function () {
                var expected = _.keys(Backbone.Model.prototype).concat(_.keys(this.ModelExtendedOnce.prototype)).sort(),
                    result = jasmine.mock.getProps(this.ModelExtendedOnce).sort();

                expect(result.length).toBe(expected.length);
                expect(result).toEqual(expected);
            });
        });

        describe('when given an extended (twice) Backbone object', function () {
            it('should return the list of properties', function () {
                var expected = _.unique(_.keys(Backbone.Model.prototype)
                        .concat(_.keys(this.ModelExtendedOnce.prototype))
                        .concat(_.keys(this.ModelExtendedTwice.prototype))
                        .sort()),
                    result = jasmine.mock.getProps(this.ModelExtendedTwice).sort();

                expect(result.length).toBe(expected.length);
                expect(result).toEqual(expected);
            });

            describe('when asked to stop at a certain point in the extension chain (given a certain "stopAtConstructor" function)', function () {
                describe('if it is a function', function () {
                    it('should not return the keys of the "stopAtConstructor" function passed', function () {
                        var expected = _.unique((_.keys(this.ModelExtendedOnce.prototype))
                                .concat(_.keys(this.ModelExtendedTwice.prototype))
                                .sort()),
                            result = jasmine.mock.getProps(this.ModelExtendedTwice, Backbone.Model).sort();

                        expect(result.length).toBe(expected.length);
                        expect(result).toEqual(expected);
                    });
                });

                describe('if it is NOT a function', function () {
                    it('should just ignore it and return all the keys in the object\'s chain', function () {
                        var expected = _.unique(_.keys(Backbone.Model.prototype)
                                .concat(_.keys(this.ModelExtendedOnce.prototype))
                                .concat(_.keys(this.ModelExtendedTwice.prototype))
                                .sort()),
                            result = jasmine.mock.getProps(this.ModelExtendedTwice).sort();

                        expect(result.length).toBe(expected.length);
                        expect(result).toEqual(expected);
                    });
                });
            });
        });
    });

    describe('#create(constructor, stopAtConstructor)', function () {
        var ModelExtendedOnce, ModelExtendedTwice;

        ModelExtendedOnce = Backbone.Model.extend({
            newProperty1: 1,
            newProperty2: 2,
            newMethod1: function () {},
            newMethod2: function () {}
        });

        ModelExtendedTwice = ModelExtendedOnce.extend({
            newProperty3: 3,
            newProperty4: 4,
            newMethod3: function () {},
            newMethod4: function () {}
        });

        function checkSpies () {
            var results = jasmine.mock.create(ModelExtendedTwice);

            for (var key in results) {
                it('should create a spy for the "' + key + '" property', function () {
                    expect(_.isFunction(results[key])).toBeTruthy();
                });
            }
        }

        describe('when asked for a spy object', function () {
            checkSpies();
        });

        describe('when asked to stop at a certain point in the extension chain (given a certain "stopAtConstructor" parameter)', function () {
            describe('if "stopAtConstructor" is a function', function () {
                it('should return an instance of the "stopAtConstructor" function', function () {
                    var result = jasmine.mock.create(this.ModelExtendedTwice, Backbone.Model),
                        expected = _.unique(_.keys(Backbone.Model.prototype).sort());
                    result = _.keys(Object.getPrototypeOf(result)).sort();

                    expect(result).toEqual(expected);
                });

                it('should return all the properties of "constructor" as spies attached to the "stopAtConstructor" instance', function () {
                    var expected = _.unique(_.keys(this.ModelExtendedOnce.prototype)
                            .concat(_.keys(this.ModelExtendedTwice.prototype)))
                            .sort(),
                        result = _.chain(jasmine.mock.create(this.ModelExtendedTwice, Backbone.Model))
                            .keys()
                            .difference(backboneDefaultProps)
                            .value()
                            .sort();

                    expect(result).toEqual(expected);
                });
            });

            describe('if "stopAtConstructor" is NOT a function', function () {
                beforeEach(function () {
                    this.ModelExtendedOnce = Backbone.Model.extend({
                        newProperty1: 1,
                        newProperty2: 2,
                        newMethod1: function () {},
                        newMethod2: function () {}
                    });
                });

                it('should just ignore it and mock the whole object', function () {
                    var expected = _.keys(jasmine.mock.create(this.ModelExtendedOnce)).sort(),
                        result = _.keys(jasmine.mock.create(this.ModelExtendedOnce, 'foo')).sort();
                    expect(result).toEqual(expected);
                });
            });
        });
    });
});
