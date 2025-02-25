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

const BaseException = require('./baseexception');
const Globalize = require('./globalize');

/**
 * Error thrown when a Concerto type does not exist.
 * @extends BaseException
 * @see see {@link BaseException}
 * @class
 * @memberof module:concerto
 * @private
 */
class TypeNotFoundException extends BaseException {
    /**
     * Constructor. If the optional 'message' argument is not supplied, it will be set to a default value that
     * includes the type name.
     * @param {String} typeName - fully qualified type name.
     * @param {String} [message] - error message.
     * @param {String} component - the optional component which throws this error
     */
    constructor(typeName, message, component) {
        if (!message) {
            const formatter = Globalize.messageFormatter('typenotfounderror-defaultmessage');
            message = formatter({
                typeName: typeName
            });
        }

        super(message, component);
        this.typeName = typeName;
    }

    /**
     * Get the name of the type that was not found.
     * @returns {string} fully qualified type name.
     */
    getTypeName() {
        return this.typeName;
    }

}

module.exports = TypeNotFoundException;
