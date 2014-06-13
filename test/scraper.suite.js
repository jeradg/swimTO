var chai = require( 'chai' ),
    expect = chai.expect,
    request = require( 'request' ),
    path = require( 'path' ),
    fs = require( 'fs' ),
    cheerio = require( 'cheerio' ),
    server = require( './testServer' ),
    port = 7345,
    // tempPath = path.resolve( __dirname, 'temp/' ),
    getVenueURLs = require( '../lib/getVenueURLs' ),
    scrapeVenue = require( '../lib/scrapeVenue' );

describe( 'swimTO scraper', function() {
  before( function( done ) {
    server( port, done );
  } );

  describe( 'getVenueURLs', function() {
    it( 'should return an error when passed a first argument that isn\'t an array', function( done ) {
      var urls = { 'foo': 'bar' },
          callback = function( err, venueURLs ) {
            expect( err ).to.be.an.instanceOf( Error );

            done();
          }

      getVenueURLs( urls, callback );
    } );

    it( 'should return an error when passed an empty array', function( done ) {
      var urls = [],
          callback = function( err, venueURLs ) {
            expect( err ).to.be.an.instanceOf( Error );

            done();
          }

      getVenueURLs( urls, callback );
    } );

    it( 'should return an error when passed a website with no valid links', function( done ) {
      var urls = [
            'http://localhost:' + port + '/noPoolsHere.html'
          ],
          callback = function( err, venueURLs ) {
            expect( err ).to.be.an.instanceOf( Error );

            done();
          }

      getVenueURLs( urls, callback );
    } );

    it( 'should return the URLs from a page with a list of venue pages', function( done ) {
      var urls = [
            'http://localhost:' + port + '/outdoorPools.html',
            'http://localhost:' + port + '/indoorPools.html'
          ],
          callback = function( err, venueURLs ) {
            expect( err ).to.equal( null );

            expect( venueURLs ).to.be.an( 'array' );
            expect( venueURLs.length ).to.equal( 20 );

            // TODO: Add more stringent expectations here

            done();
          }

      getVenueURLs( urls, callback );
    } );
  } );

  describe( 'scrapeVenue', function() {
    it( 'should return a venue object with the correct values', function( done ) {
      var url = 'http://localhost:' + port + '/venue1.html',
          callback = function( err, venue ) {
            expect( err ).to.equal( null );

            expect( venue ).to.be.an( 'object' );
            expect( venue.name ).to.equal( 'North Toronto Memorial Community Centre' );
            expect( venue.url ).to.equal( url );
            expect( venue.address ).to.equal( '200 Eglinton Ave W M4R 1A7' );
            expect( venue.phone ).to.equal( '416-392-6591' );
            expect( venue.type ).to.equal( 'indoor and outdoor' );
            expect( venue.normalizedUrl ).to.equal( 'north-toronto-memorial-community-centre' );
            expect( venue.schedule ).to.be.an( 'array' );
            expect( venue.schedule.length ).to.equal( 159 );

            for ( var i = 0; i < venue.schedule.length; i++ ) {
              expect( venue.schedule[ i ].start ).to.be.an.instanceOf( Date );
              expect( venue.schedule[ i ].end ).to.be.an.instanceOf( Date );
              expect( venue.schedule[ i ].start ).to.be.below( venue.schedule[ i ].end );
            }

            done();
          }

      scrapeVenue( url, callback );
    } );
  } );

  describe( 'createVenue', function() {
  } );

  describe( 'updateVenue', function() {
  } );

  describe( 'writeVenue', function() {
  } );

  describe( 'updateMetadata', function() {
  } );
} );