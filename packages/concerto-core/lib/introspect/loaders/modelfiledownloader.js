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

const JobQueue = require('./jobqueue');
const debug = require('debug')('concerto:ModelFileDownloader');

/**
 * Downloads the transitive closure of a set of model files.
 * @class
 * @private
 * @memberof module:concerto
 */
class ModelFileDownloader extends JobQueue {

    /**
     * Create a ModelFileDownloader and bind to a ModelFileLoader.
     * @param {ModelFileLoader} mfl - the loader to use to download model files
     * @param {Number} startDelay - the delay before downloading starts
     * @param {Number} jobDelay - the delay before each download
     */
    constructor(mfl, startDelay = 0, jobDelay = 0) {
        super(startDelay, jobDelay);
        this.modelFileLoader = mfl;
        this.results = [];
    }

    /**
     * Download all external dependencies for an array of model files
     * @param {ModelFile[]} modelFiles - the model files
     * @param {Object} [options] - Options object passed to ModelFileLoaders
     * @return {Promise} a promise that resolves to ModelFiles[] for the external model files
     */
    downloadExternalDependencies(modelFiles, options) {

        const method = 'downloadExternalDependencies';
        debug(method);

        const result = new Promise((resolve, reject) => {
            let externalCount = 0;

            const downloadedUris = new Set();

            if (!options) {
                options = {};
            }

            modelFiles.forEach((mf) => {
                const externalImports = mf.getExternalImports();
                Object.keys(externalImports).forEach((importDeclaration) => {
                    const url = externalImports[importDeclaration];
                    externalCount++;
                    this.addJob({
                        downloadedUris: downloadedUris,
                        url: url,
                        options: options
                    });
                });
            });

            this.on('queueError', (error, jobQueue) => {
                const badHttpResponse = error.response && error.response.status && error.response.status !== 200;
                const dnsFailure = error.code && error.code === 'ENOTFOUND';
                if(badHttpResponse || dnsFailure){
                    const err = new Error(`Unable to download external model dependency '${jobQueue[0].url}'`);
                    err.code = 'MISSING_DEPENDENCY';
                    return reject(err);
                }
                reject(new Error('Failed to load model file. Queue: ' + jobQueue + ' Details: ' + error));
            });

            this.on('jobAdd', (job, jobQueue) => {
                debug(method, 'Downloading', job.options.url);
            });

            this.on('jobFinish', (job, jobQueue) => {
                if (jobQueue.length === 0) {
                    this.results.forEach((mf) => {
                        debug(method, 'Loaded namespace', mf.getNamespace());
                    });
                    resolve(this.results);
                } else {
                    debug(method, 'Downloaded', job.options.url);
                }
            });

            // nothing to do, just return an empty array
            if (externalCount === 0) {
                resolve([]);
            }
        });

        debug(method);
        return result;
    }

    /**
     * Execute a Job
     * @param {Object} job - the job to execute
     * @return {Promise} a promise to the job results
     */
    runJob(job) {
        const downloadedUris = job.downloadedUris;
        const options = job.options;
        const url = job.url;

        // cache the URI, so we don't download it again
        downloadedUris.add(url);
        debug('runJob', 'Loading', url);
        return this.modelFileLoader.load(url, options).
            then((mf) => {
                // save the result
                this.results.push(mf);

                // get the external import
                const importedUris = new Set();
                const externalImports = mf.getExternalImports();
                Object.keys(externalImports).forEach((importDeclaration) => {
                    const uri = externalImports[importDeclaration];
                    importedUris.add(uri);
                });

                importedUris.forEach(uri => {
                    if (!downloadedUris.has(uri)) {
                        // recurse and add a new job for the referenced URI
                        this.addJob({
                            options: options,
                            url: uri,
                            downloadedUris: downloadedUris
                        });
                    }
                });

                return mf;
            })
            .catch((err) => {
                throw err;
            });
    }
}

module.exports = ModelFileDownloader;
