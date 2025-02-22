#!/usr/bin/env node

/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/* eslint-env node */

'use strict';

const path = require( 'path' );
const fs = require( 'fs' );
const devEnv = require( '@ckeditor/ckeditor5-dev-env' );

const CKEDITOR5_INTERNAL_PATH = path.resolve( __dirname, '..', '..', 'external', 'ckeditor5-internal' );

if ( !fs.existsSync( CKEDITOR5_INTERNAL_PATH ) ) {
	throw new Error( `The script assumes that the directory "${ CKEDITOR5_INTERNAL_PATH }" exists.` );
}

Promise.resolve()
	.then( () => devEnv.generateChangelogForMonoRepository( {
		cwd: process.cwd(),
		packages: 'packages',
		releaseBranch: 'release',
		highlightsPlaceholder: true,
		collaborationFeatures: true,
		transformScope: name => {
			if ( name === 'ckeditor5' ) {
				return 'https://www.npmjs.com/package/ckeditor5';
			}

			if ( name === 'build-*' ) {
				return 'https://www.npmjs.com/search?q=keywords%3Ackeditor5-build%20maintainer%3Ackeditor';
			}

			return 'https://www.npmjs.com/package/@ckeditor/ckeditor5-' + name;
		},
		externalRepositories: [
			{
				cwd: CKEDITOR5_INTERNAL_PATH,
				packages: 'packages',
				skipLinks: true
			}
		]
	} ) )
	.then( () => {
		console.log( 'Done!' );
	} )
	.catch( err => {
		console.error( err.stack );
	} );
