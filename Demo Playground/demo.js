const {MongoClient} = require('mongodb');

async function main() {

    const uri = "mongodb+srv://crowtherdb:Db12345%21@cluster0.dozth36.mongodb.net/test";
    
    const client = new MongoClient(uri);

    try {
        await client.connect();

// call function to create a listing
        //await createListing(client, {
            //name: "Lovely Loft",
            //summary: "A charming loft in Paris",
            //bedrooms: 1,
            //bathrooms:1
      //})

// call function to create multiple listings      
        // await createMutlipleListings(client, [
        //     {
        //         name:"Infinite Views",
        //         summary: "Modern home with infinite views from the infinity pool",
        //         property_type: "House",
        //         bedrooms: 5,
        //         bathrooms: 4.5,
        //         beds: 5
        //     },
        //     {
        //         name: "Private room in London",
        //         property_type: "Apartment",
        //         bedrooms: 1,
        //         bathrooms: 1
        //     },
        //     {
        //         name: "Beautiful Beach House",
        //         summary: "Enjoy relaxed beach living in this house with a private beach",
        //         bedrooms: 4,
        //         bathrooms: 2.5,
        //         beds: 7,
        //         last_review: new Date()
        //     }
        // ]);

// call function to search find one listing by name
        // await findOneListingByName(client, "Infinite Views");

// call function with min bed bath and results
    // await findListingsWithMinBedBathAndReviews(client, {
    //     minimumNumberofBed: 4,
    //     minimumNumberBath: 2,
    //     maximumNumberResults: 5
    // });      

//call update listing function
    // await updateListingByName(client, "Infinite Views", {bedrooms: 6, beds: 8});

//call upsert function
   //  await upsertListingByName(client, "Cozy Cottage", {name: "Cozy Cottage", bedrooms: 2, bathrooms: 1});

//call updatemany function
    // await updateAllListingsToHavePropertyType(client);

//call delete function
    // await deleteListingByName(client, "Cozy Cottage");

//call delete many function
    await deleteListingsScrapedBeforeDate(client, new Date(2019-02-15));

    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }

}
// function to call main
main().catch(console.error);

//delete many listings
async function deleteListingsScrapedBeforeDate(client, date) {
    const result = await client.db("sample_airbnb").collection("listingsAndReviews").deleteMany({"last_scraped": {$lt: date}});

    console.log(`${result.deletedCount} document(s) was/were deleted`);

}

//delete single document
async function deleteListingByName(client, nameOfListing) {
    const result = await client.db("sample_airbnb").collection("listingsAndReviews").deleteOne({ name: nameOfListing});

    console.log(`${result.deletedCount} document(s) was/were deleted`);
}

// update many listings
async function updateAllListingsToHavePropertyType(client) {
    const result = await client.db("sample_airbnb").collection("listingsAndReviews").updateMany({ property_type: {$exists: false}}, {$set: { property_type: "Unknown"}});

    console.log(`${result.matchedCount} document(s) matched the query criteria`);
    console.log(`${result.modifiedCount} document(s) was/were updated`);

}

//update or create new
async function upsertListingByName (client, nameOfListing, updatedListing) {
    const result = await client.db("sample_airbnb").collection("listingsAndReviews").updateOne({ name: nameOfListing }, { $set: updatedListing }, {upsert: true});

    console.log(`${result.matchedCount} document(s) matched the query criteria`);

    if (result.upsertedCount > 0) {
        console.log(`One document was inserted with the id ${result.upsertedId}`)
    } else {
        console.log(`${result.modifiedCount} document(s) was/were updated`);

    }

}

// function for updating one listing
async function updateListingByName(client, nameOfListing, updatedListing) {
    const result = await client.db("sample_airbnb").collection("listingsAndReviews").updateOne({ name: nameOfListing }, { $set: updatedListing });

    console.log(`${result.matchedCount} document(s) matched the query criteria`);
    console.log(`${result.modifiedCount} document(s) was/were updated`);

}

//find min bed bath and results
async function findListingsWithMinBedBathAndReviews(client, {
    minimumNumberofBed = 0,
    minimumNumberBath = 0,
    maximumNumberResults = Number.MAX_SAFE_INTEGER
} = {}) {

    const cursor = client.db("sample_airbnb").collection("listingsAndReviews").find({
        bedrooms: {$gte: minimumNumberofBed},
        bathrooms: {$gte: minimumNumberBath},
    }).sort({last_review: -1})
    .limit(maximumNumberResults);

    const results = await cursor.toArray();
    
    if (results.length > 0) {
        console.log(`Found listing(s) with at least ${minimumNumberofBed} bedrooms and ${minimumNumberBath} bathrooms:`);
        results.forEach((result, i) => {
            date = new Date(result.last_review).toDateString();
            console.log();
            console.log(`${i + 1}. name: ${result.name}`);
            console.log(`    _id: ${result._id}`),
            console.log(`    bedrooms: ${result.bedrooms}`);
            console.log(`    most recent review date: ${new Date(result.last_review).toDateString()}`);
        });
    } else {
        console.log(`No listings founs with at least ${minimumNumberofBed} bedrooms and ${minimumNumberBath} bathrooms`);
    }

}

//function to find one listing by name
async function findOneListingByName(client, nameOfListing) {
    const result = await client.db("sample_airbnb").collection("listingsAndReviews").findOne({name: nameOfListing});

    if (result) {
        console.log(`Found a listing in the collection with the name '${nameOfListing}'`);
        console.log(result);
    }
    else {
        console.log(`No listing found with '${nameOfListing}'`);
    }
}

//function to create multiple listings
async function createMutlipleListings(client, newListings) {
    const result = await client.db("sample_airbnb").collection("listingsAndReviews").insertMany(newListings);

    console.log(`${result.insertedCount} new listings created with the following id(s):`);

    console.log(result.insertedIds);
}


// function to create a listing
async function createListing(client, newListing) {
   const result = await client.db("sample_airbnb").collection("listingsAndReviews").insertOne(newListing);

   console.log(`New listing created with the following id: ${result.insertedId}`);

}

//function to list databases available
async function listDatabases(client) {
    const databasesList = await client.db().admin().listDatabases();

    console.log("Databases:");
    databasesList.databases.forEach(db => {
        console.log(`- ${db.name}`);
        
    });
}