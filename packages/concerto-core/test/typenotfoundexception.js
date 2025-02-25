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

const TypeNotFoundException = require('../lib/typenotfoundexception');

const chai = require('chai');
chai.should();

describe('TypeNotFoundException', function() {
    describe('#constructor', function() {
        it('with one argument', function() {
            const typeName = 'namespace.TypeName';
            const obj = new TypeNotFoundException(typeName);
            obj.toString().should.include(typeName);
            obj.component.should.equal('@accordproject/concerto');
        });

        it('with two arguments', function() {
            const message = 'MESSAGE_TEXT';
            const obj = new TypeNotFoundException('namespace.TypeName', message);
            obj.toString().should.include(message);
            obj.component.should.equal('@accordproject/concerto');
        });

        it('with three arguments', function() {
            const message = 'MESSAGE_TEXT';
            const obj = new TypeNotFoundException('namespace.TypeName', message, 'foo');
            obj.toString().should.include(message);
            obj.component.should.equal('foo');
        });
    });

    describe('#getTypeName', function() {
        it('should return the type', function() {
            const typeName = 'namespace.TypeName';
            const obj = new TypeNotFoundException(typeName);
            obj.getTypeName().should.equal(typeName);
        });
    });

});
