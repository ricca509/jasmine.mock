(function (jasmine) {
    'use strict';
    var module = {};

    module.getProps = function (constructor, StopAtConstructor) {
        var constructorKeys,
            getKeys = function (obj) {
                var key, keys = [];

                for (key in obj.prototype) {
                    keys.push(key);
                }

                return _.uniq(keys);
            };

        constructorKeys = getKeys(constructor);

        if (_.isFunction(StopAtConstructor)) {
            constructorKeys = _.difference(constructorKeys, getKeys(StopAtConstructor));
        }

        return constructorKeys;
    };

    module.create = function (constructor, StopAtConstructor) {
        var stopAtConstructorInstance, spyObject, key;
        if (!_.isFunction(StopAtConstructor)) {
            StopAtConstructor = null;
        }
        spyObject = jasmine.createSpyObj('mock', module.getProps(constructor, StopAtConstructor));
        if (StopAtConstructor) {
            stopAtConstructorInstance = new StopAtConstructor();
            for (key in spyObject) {
                stopAtConstructorInstance[key] = spyObject[key];
            }
            spyObject = stopAtConstructorInstance;
        }

        return spyObject;
    };

    jasmine.mock = module;
}(jasmine));
