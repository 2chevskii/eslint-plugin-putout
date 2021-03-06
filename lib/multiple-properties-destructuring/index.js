'use strict';

const {isCorrectLoc} = require('../common');

module.exports.category = 'destructuring';
module.exports.report = () => 'Keep each property on separate lines when using multiple destructuring properties';

module.exports.include = ({options}) => {
    const {minProperties = 2} = options[0] || {};

    return [
        `VariableDeclarator[id.type="ObjectPattern"][id.properties.length>=${minProperties}]`,
        `ImportDeclaration[specifiers.length>=${minProperties}]`
    ];
};

module.exports.filter = ({node}) => {

    let correct = false;

    if (node.type === 'ImportDeclaration') {
        correct = isCorrectLoc(node.loc.start.line, node.specifiers);
    } else {
        if (node.parent.parent.type === 'ForOfStatement')
        return false;

        correct = isCorrectLoc(node.loc.start.line, node.id.properties);
    }

    return !correct;
};

module.exports.fix = ({text}) => {
    return text
        .replace(/,/g, ',\n')
        .replace('{', '{\n')
        .replace('}', '\n}')
        .replace(/\n(\s*)?\n/g, '\n');
};
