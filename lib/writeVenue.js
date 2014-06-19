var exports = module.exports = writeVenue,
    updateVenue = require( './updateVenue' ),
    createVenue = require( './createVenue' ),
    VenueModel = require( './models/VenueModel' );

function writeVenue( venue, callback ) {
  VenueModel.findOne( {
    'name': venue.name
  }, function( err, result ) {
    if ( err ) {
      callback( err );
    } else {
      if ( result ) {
        // If the venue already exists in the database, update its schedule
        updateVenue( venue, result, callback );
      } else {
        // Otherwise, create it
        createVenue( venue, callback );
      }
    }
  } );
}