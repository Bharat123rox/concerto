/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

const ClassDeclaration = require('./classdeclaration');

/**
 * EnumDeclaration defines an enumeration of static values.
 *
 * @extends ClassDeclaration
 * @see See {@link ClassDeclaration}
 * @class
 * @memberof module:concerto
 */
class EnumDeclaration extends ClassDeclaration {

    /**
     * Create an AssetDeclaration.
     * @param {ModelFile} modelFile the ModelFile for this class
     * @param {Object} ast - The AST created by the parser
     * @throws {IllegalModelException}
     */
    constructor(modelFile, ast) {
        super(modelFile, ast);
        this._isEnumDeclaration = true;
    }

    /**
     * Returns true if this class is an enumeration.
     *
     * @return {boolean} true if the class is an enumerated type
     */
    isEnum() {
        return true;
    }

    /**
     * Returns the string representation of this class
     * @return {String} the string representation of the class
     */
    toString() {
        return 'EnumDeclaration {id=' + this.getFullyQualifiedName() + '}';
    }

    /**
     * Alternative instanceof that is reliable across different module instances
     * @see https://github.com/hyperledger/composer-concerto/issues/47
     *
     * @param {object} object - The object to test against
     * @returns {boolean} - True, if the object is an instance of a Class Declaration
     */
    static [Symbol.hasInstance](object){
        return typeof object !== 'undefined' && object !== null && Boolean(object._isEnumDeclaration);
    }
}

module.exports = EnumDeclaration;
